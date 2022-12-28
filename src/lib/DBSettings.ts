export enum DBSettings {
  obs = 'obs-scene-switcher',
  xl = 'minimap-xl',
  simple = 'minimap-simple',
  mblock = 'minimap-blocker',
  pblock = 'picks-blocker',
  obsMinimap = 'obs-minimap',
  obsPicks = 'obs-picks',
  obsDc = 'obs-dc',
  onlyBlockRanked = 'only-block-ranked',
  mmrTracker = 'mmr-tracker',
  mmr = 'mmr',
  bp = 'battlepass',
  bets = 'bets',
  chatter = 'chatter',
  rosh = 'rosh',
  aegis = 'aegis',
  minimapRight = 'minimapRight',
  commandWL = 'commandWL',
  commandXPM = 'commandXPM',
  commandGPM = 'commandGPM',
  commandAPM = 'commandAPM',
  commandPleb = 'commandPleb',
  commandModsonly = 'commandModsonly',
  commandHero = 'commandHero',
  commandNP = 'commandNP',
  commandGM = 'commandGM',
  commandLG = 'commandLG',
  commandSmurfs = 'commandSmurfs',
  customMmr = 'customMmr',
  commandRanked = 'commandRanked',
  commandAvg = 'commandAvg',
  commandDisable = 'commandDisable',
  commandCommands = 'commandCommands',
  commandDotabuff = 'commandDotabuff',
  commandOpendota = 'commandOpendota',
  betsInfo = 'betsInfo',
  chatters = 'chatters',
}

export const defaultSettings = {
  [DBSettings.obs]: true,
  [DBSettings.simple]: false,
  [DBSettings.xl]: false,
  [DBSettings.mblock]: true,
  [DBSettings.pblock]: true,
  [DBSettings.mmrTracker]: true,
  [DBSettings.onlyBlockRanked]: true,
  [DBSettings.obsMinimap]: '[dotabod] blocking minimap',
  [DBSettings.obsPicks]: '[dotabod] blocking picks',
  [DBSettings.obsDc]: '[dotabod] game disconnected',
  [DBSettings.mmr]: null,
  [DBSettings.bp]: false,
  [DBSettings.bets]: true,
  [DBSettings.chatter]: true,
  [DBSettings.rosh]: true,
  [DBSettings.aegis]: true,
  [DBSettings.minimapRight]: false,
  [DBSettings.commandWL]: true,
  [DBSettings.commandXPM]: true,
  [DBSettings.commandGPM]: true,
  [DBSettings.commandAPM]: true,
  [DBSettings.commandPleb]: true,
  [DBSettings.commandModsonly]: true,
  [DBSettings.commandHero]: true,
  [DBSettings.commandNP]: true,
  [DBSettings.commandGM]: true,
  [DBSettings.commandLG]: true,
  [DBSettings.commandSmurfs]: true,
  [DBSettings.customMmr]:
    '[currentmmr] | [currentrank] | Next rank at [nextmmr] [wins]',
  [DBSettings.commandRanked]: true,
  [DBSettings.commandAvg]: true,
  [DBSettings.commandDisable]: false,
  [DBSettings.commandCommands]: true,
  [DBSettings.commandOpendota]: true,
  [DBSettings.commandDotabuff]: true,
  [DBSettings.betsInfo]: {
    title: 'Will we win with [heroname]?',
    yes: 'Yes',
    no: 'No',
    duration: 4 * 60,
  },
  [DBSettings.chatters]: {
    midas: {
      description: 'If your midas is ready and unused for 10s',
      enabled: true,
      message: 'massivePIDAS Use your midas',
    },
    pause: {
      description: 'As soon as anyone presses F9',
      enabled: true,
      message: 'PauseChamp Who paused the game?',
    },
    smoke: {
      description: 'Whenever your hero has smoke debuff',
      enabled: true,
      message: 'Shush [heroname] is smoked!',
    },
    passiveDeath: {
      description: 'Whenever you die with passive stick / faerie / etc',
      enabled: true,
      message: '[heroname] died with passive [itemnames] ICANT',
    },
  },
}

export const getValueOrDefault = (data, key) => {
  if (!Array.isArray(data) || !data.length || !data.filter(Boolean).length) {
    return defaultSettings[key]
  }

  const dbVal = data?.find((s) => s.key === key)?.value

  // Undefined is not touching the option in FE yet
  // So we give them our best default
  if (dbVal === undefined) {
    return defaultSettings[key]
  }

  try {
    if (typeof dbVal === 'string') {
      const val = JSON.parse(dbVal) as unknown as any
      if (typeof val === 'object' && typeof defaultSettings[key] === 'object') {
        return {
          ...(defaultSettings[key] as any),
          ...val,
        }
      }

      return val
    }

    if (typeof dbVal === 'object' && typeof defaultSettings[key] === 'object') {
      return {
        ...(defaultSettings[key] as any),
        ...dbVal,
      }
    }

    return dbVal
  } catch {
    return dbVal
  }
}

export const rankedModes = [2, 22]
