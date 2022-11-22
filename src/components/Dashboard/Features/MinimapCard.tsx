import { Card } from '@/ui/card'
import { Button, Checkbox, Display, Image } from '@geist-ui/core'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline'
import { useUpdateSetting } from '@/lib/useUpdateSetting'
import { DBSettings } from '@/lib/DBSettings'

export default function MinimapCard(): JSX.Element {
  const {
    isEnabled,
    loading: l0,
    updateSetting,
  } = useUpdateSetting(DBSettings.mblock)
  const {
    isEnabled: minimapSimple,
    loading: l1,
    updateSetting: updateSimple,
  } = useUpdateSetting(DBSettings.simple)
  const {
    isEnabled: minimapXl,
    loading: l2,
    updateSetting: updateXl,
  } = useUpdateSetting(DBSettings.xl)
  const {
    isEnabled: isBP,
    loading: l3,
    updateSetting: updateBP,
  } = useUpdateSetting(DBSettings.bp)

  const loading = l0 || l1 || l2 || l3

  return (
    <Card>
      <Card.Header>
        <Card.Title>Minimap</Card.Title>
        <Card.Description>
          Block your minimap to deter people from destroying your wards or
          observing teammate positions. This overlay will make it confusing to
          see where the true wards are.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col items-center">
        <div>
          <Display
            shadow
            caption="Semi-transparent blocker that auto places itself over your minimap"
          >
            <Image
              alt="minimap blocker"
              height={minimapXl ? `280px` : `240px`}
              src={`/images/731-${minimapSimple ? 'Simple' : 'Complex'}-${
                minimapXl ? 'X' : ''
              }Large-AntiStreamSnipeMap.png`}
              style={{
                backgroundImage:
                  "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEX////09PQtDxrOAAAAE0lEQVQI12P4f4CBKMxg/4EYDAAFkR1NiYvv7QAAAABJRU5ErkJggg==')",
              }}
            />
          </Display>
        </div>
      </Card.Content>
      <Card.Footer className="flex items-center space-x-4">
        {loading ? (
          <Button disabled>loading...</Button>
        ) : (
          <Button
            icon={isEnabled ? <PauseIcon /> : <PlayIcon />}
            type="secondary"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              updateSetting(!isEnabled)
            }}
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </Button>
        )}
        <div className="flex flex-col items-start space-y-2 md:space-y-1">
          <Checkbox
            disabled={!isEnabled}
            checked={minimapSimple}
            value={DBSettings.simple}
            onChange={(e) => updateSimple(!!e?.target?.checked)}
          >
            Use simple minimap background
          </Checkbox>
          <Checkbox
            disabled={!isEnabled}
            checked={minimapXl}
            value={DBSettings.xl}
            onChange={(e) => updateXl(!!e?.target?.checked)}
          >
            Use extra large minimap
          </Checkbox>
          <Checkbox
            disabled={!isEnabled}
            checked={isBP}
            value={DBSettings.bp}
            onChange={(e) => updateBP(!!e?.target?.checked)}
          >
            Use Battlepass 2022 HUD
          </Checkbox>
        </div>
      </Card.Footer>
    </Card>
  )
}
