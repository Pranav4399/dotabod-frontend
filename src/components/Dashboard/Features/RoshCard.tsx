import { Card } from '@/ui/card'
import { Button, Display } from '@geist-ui/core'
import { useUpdateSetting } from '@/lib/useUpdateSetting'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline'
import { DBSettings } from '@/lib/DBSettings'
import Image from 'next/image'

export default function RoshCard() {
  const {
    isEnabled: hasAegis,
    loading: lA,
    updateSetting: uA,
  } = useUpdateSetting(DBSettings.aegis)

  const {
    isEnabled: hasRosh,
    loading: lR,
    updateSetting: uR,
  } = useUpdateSetting(DBSettings.rosh)

  return (
    <Card>
      <Card.Header>
        <Card.Title>Roshan timers</Card.Title>
        <Card.Description>
          Dotabod can detect when roshan is killed or aegis is picked up. Sadly
          the data does not tell us when someone dies with aegis, so{' '}
          <b>the aegis icon will remain for the full 5 minutes</b>. The rosh
          timer starts red for 8 minutes (min rosh spawn), then turns yellow for
          3 minutes (max rosh spawn).
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-2">
        <Display shadow>
          <div className="flex items-center justify-center space-x-4">
            <Image
              alt="aegis timer"
              width={219}
              height={107}
              src="/images/just-aegis-timer.png"
              className="inline"
            />

            <Image
              alt="aegis timer"
              width={293}
              height={533}
              src="/images/rosh-timer.png"
              className="inline"
            />
          </div>
        </Display>
      </Card.Content>
      <Card.Footer className="space-x-4">
        {lA ? (
          <Button disabled>loading...</Button>
        ) : (
          <Button
            icon={hasAegis ? <PauseIcon /> : <PlayIcon />}
            type="secondary"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => uA(!hasAegis)}
          >
            {hasAegis ? 'Disable' : 'Enable'} aegis
          </Button>
        )}
        {lR ? (
          <Button disabled>loading...</Button>
        ) : (
          <Button
            icon={hasRosh ? <PauseIcon /> : <PlayIcon />}
            type="secondary"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => uR(!hasRosh)}
          >
            {hasRosh ? 'Disable' : 'Enable'} rosh
          </Button>
        )}
      </Card.Footer>
    </Card>
  )
}
