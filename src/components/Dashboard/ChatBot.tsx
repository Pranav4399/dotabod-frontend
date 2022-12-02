import { Card } from '@/ui/card'
import { Collapse, Snippet } from '@geist-ui/core'
import Link from 'next/link'

const emotes = [
  { label: 'BASED' },
  { label: 'Chatting' },
  {
    label: 'massivePIDAS',
    url: 'https://7tv.app/emotes/6257e7a3131d4588262a7505',
  },
  { label: 'Sadge' },
  { label: 'EZ', url: 'https://betterttv.com/emotes/5590b223b344e2c42a9e28e3' },
  { label: 'Clap' },
  { label: 'peepoGamble' },
  { label: 'PauseChamp' },
]

export default function ChatBot() {
  return (
    <Card>
      <Collapse
        className="border-dark-700"
        shadow
        title="Step one. Chat bot"
        subtitle="Allows the Dotabod chat bot to type in your chat in case you have
        followers mode or subscribers mode ever turned on."
      >
        <div className="space-y-2 text-sm text-dark-300">
          <div>
            i. Add @dotabod as a moderator to your channel. Type the following
            in your stream.
          </div>

          <Snippet symbol="" text="/mod dotabod" width="750px" />

          <div>
            ii. Add the following emotes to your channel using BTTV (case
            sensitive):
          </div>
          <ul className="ml-8 list-disc">
            {emotes.map(({ label, url }) => (
              <li key={label}>
                <Link
                  className="text-dark-300 transition-colors hover:text-[#E6E8F1]"
                  target="_blank"
                  href={
                    url ??
                    `https://betterttv.com/emotes/shared/search?query=${label}`
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Collapse>
    </Card>
  )
}
