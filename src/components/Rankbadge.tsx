'use client'
import clsx from 'clsx'
import { Badge } from './Badge'
import { Card } from './Card'

export const Rankbadge = ({
  image,
  leaderboard = false,
  rank,
  transformRes,
  ...props
}) => {
  return (
    <Card className="rounded-bl-none" {...props}>
      <Badge transformRes={transformRes} image={image} />
      <span
        className={clsx(
          leaderboard || ['80.png', '92.png'].includes(image)
            ? '-mt-1'
            : '-mt-3',
          'font-mono'
        )}
        style={{
          fontSize: transformRes ? transformRes({ height: 22 }) : 16,
        }}
      >
        {leaderboard && '#'}
        {rank}
      </span>
    </Card>
  )
}
