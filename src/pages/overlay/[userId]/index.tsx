'use client'

import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { fetcher } from '@/lib/fetcher'
import {
  DBSettings,
  defaultSettings,
  getValueOrDefault,
} from '@/lib/DBSettings'
import { getRankImage } from '@/lib/ranks'
import { Card, Rankbadge } from '@/components/Rankbadge'

let socket

const HeroBlocker = ({ teamName, type }) => {
  if (!type) return null

  return (
    <Image
      priority
      alt={`${type} blocker`}
      width={1920}
      height={1080}
      src={`/images/block-${teamName}-${type}.png`}
    />
  )
}

const getWL = (steam32Id, cb) => {
  fetcher(
    `https://api.opendota.com/api/players/${steam32Id}/wl/?date=0.5`
  ).then(cb)
}

export default function OverlayPage() {
  const router = useRouter()
  const { userId } = router.query

  const [data, setData] = useState(null)
  const [wl, setWL] = useState({
    win: 0,
    lose: 0,
  })

  const [rankImageDetails, setRankImageDetails] = useState({
    image: '0.png',
    rank: 0,
    leaderboard: false,
  })

  useEffect(() => {
    if (!userId) return

    fetcher(`/api/settings/?id=`, userId).then((data) => {
      setData(data)
      getWL(data?.steam32Id, setWL)
      getRankImage(data?.mmr, data?.steam32Id).then(setRankImageDetails)
    })
  }, [userId])

  const [block, setBlock] = useState({ type: null, team: null })
  const [connected, setConnected] = useState(false)

  const opts = defaultSettings
  // Replace defaults with settings from DB
  Object.values(DBSettings).forEach((key) => {
    // @ts-ignore ???
    opts[key] = getValueOrDefault(data?.settings, key)
  })

  const isMinimapBlocked = opts[DBSettings.mblock] && block.type === 'minimap'
  const isPicksBlocked =
    opts[DBSettings.pblock] && block?.type && block?.type !== 'minimap'

  useEffect(() => {
    if (!userId) return

    console.log('Connecting to socket init...')

    socket = io(process.env.NEXT_PUBLIC_GSI_WEBSOCKET_URL, {
      auth: { token: userId },
    })

    socket.on('block', setBlock)
    socket.on('connect', () => {
      console.log('Connected to socket!', socket.id)

      return setConnected(true)
    })
    socket.on('disconnect', (reason) => {
      console.log('Disconnected from sockets:', reason)
      setConnected(false)

      if (reason === 'io server disconnect') {
        console.log('Reconnecting...')
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect()
      }
    })

    socket.on('update-medal', ({ mmr, steam32Id }) => {
      // Refetch mmr and medal image
      console.log('updating medal')

      getWL(steam32Id, setWL)
      getRankImage(mmr, steam32Id).then(setRankImageDetails)
    })

    socket.on('refresh', () => {
      router.reload()
    })

    socket.on('connect_error', console.log)
  }, [router, userId])

  useEffect(() => {
    if (!userId || !opts[DBSettings.obs]) {
      return
    }

    if (!connected) {
      console.log(
        'Socket not connected just yet, will not run OBS scene switchers'
      )

      return
    }

    console.log('Connected to socket! Running OBS scene switchers')

    // Debug info
    if (isMinimapBlocked) {
      console.log({ setCurrentScene: opts[DBSettings.obsMinimap] })
    } else if (isPicksBlocked) {
      console.log({ setCurrentScene: opts[DBSettings.obsPicks] })
    } else {
      console.log({ setCurrentScene: opts[DBSettings.obsDc] })
    }

    // Only run in OBS browser source
    if (
      !opts[DBSettings.obs] ||
      typeof window !== 'object' ||
      !window?.obsstudio
    )
      return

    console.log('OBS studio is connected')

    if (isMinimapBlocked) {
      window.obsstudio.setCurrentScene(opts[DBSettings.obsMinimap])
    } else if (isPicksBlocked) {
      window.obsstudio.setCurrentScene(opts[DBSettings.obsPicks])
    } else {
      window.obsstudio.setCurrentScene(opts[DBSettings.obsDc])
    }
  }, [connected, userId, isMinimapBlocked, isPicksBlocked, opts])

  useEffect(() => {
    return () => {
      socket?.off('block')
      socket?.off('update-medal')
      socket?.off('connect')
      socket?.off('connect_error')
      socket?.disconnect()
    }
  }, [])

  return (
    <>
      <Head>
        <title>Dotabod | Stream overlays</title>
      </Head>
      <div>
        {false && process.env.NODE_ENV === 'development' && (
          <Image
            height={1080}
            width={1920}
            alt={`main game`}
            src={`/images/shot_0012.png`}
          />
        )}

        {isMinimapBlocked && (
          <>
            <div>
              <Image
                className={`absolute ${
                  opts[DBSettings.bp]
                    ? 'bottom-[14px] left-[11px]'
                    : 'bottom-0 left-0'
                }`}
                priority
                alt="minimap blocker"
                width={opts[DBSettings.xl] ? 280 : 240}
                height={opts[DBSettings.xl] ? 280 : 240}
                src={`/images/731-${
                  opts[DBSettings.simple] ? 'Simple' : 'Complex'
                }-${
                  opts[DBSettings.xl] ? 'X' : ''
                }Large-AntiStreamSnipeMap.png`}
              />
            </div>
            <div className="absolute bottom-0 right-[340px]">
              <Card>
                W{wl.win || 0} L{wl.lose || 0}
              </Card>
            </div>

            {opts[DBSettings.mmrTracker] && rankImageDetails?.rank > 0 && (
              <div className="absolute bottom-0 right-[276px]">
                <Rankbadge {...rankImageDetails} />
              </div>
            )}
          </>
        )}

        {isPicksBlocked && (
          <HeroBlocker type={block?.type} teamName={block?.team} />
        )}
      </div>
    </>
  )
}
