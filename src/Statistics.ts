import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateAllCubeMultiplier,
  calculateAmbrosiaCubeMult,
  calculateAmbrosiaGenerationSpeed,
  calculateAmbrosiaLuck,
  calculateAmbrosiaQuarkMult,
  calculateAntSacrificeMultipliers,
  calculateAscensionAcceleration,
  calculateAscensionScore,
  calculateAscensionSpeedMultiplier,
  calculateBaseObtainium,
  calculateBaseOfferings,
  calculateCashGrabCubeBonus,
  calculateCashGrabQuarkBonus,
  calculateCubeMultFromPowder,
  calculateCubeMultiplier,
  calculateEffectiveIALevel,
  calculateEventBuff,
  calculateExalt6Penalty,
  calculateEXALTBonusMult,
  calculateEXUltraCubeBonus,
  calculateEXUltraObtainiumBonus,
  calculateEXUltraOfferingBonus,
  calculateGoldenQuarkMultiplier,
  calculateHepteractMultiplier,
  calculateHypercubeMultiplier,
  calculateObtainium,
  calculateObtainiumDecimal,
  calculateObtainiumDRIgnoreCap,
  calculateOcteractMultiplier,
  calculateOfferings,
  calculateOfferingsDecimal,
  calculatePlatonicMultiplier,
  calculatePowderConversion,
  calculateQuarkMultFromPowder,
  calculateQuarkMultiplier,
  calculateSigmoidExponential,
  calculateSingularityQuarkMilestoneMultiplier,
  calculateTesseractMultiplier,
  calculateTimeAcceleration,
  calculateTotalOcteractCubeBonus,
  calculateTotalOcteractObtainiumBonus,
  calculateTotalOcteractOfferingBonus,
  calculateTotalOcteractQuarkBonus,
  derpsmithCornucopiaBonus,
  isIARuneUnlocked,
  resetTimeThreshold
} from './Calculate'
import { formatAsPercentIncrease } from './Campaign'
import { CalcECC, type Challenge15Rewards, challenge15ScoreMultiplier } from './Challenges'
import { BuffType } from './Event'
import { hepteractEffective } from './Hepteracts'
import {
  addCodeAvailableUses,
  addCodeBonuses,
  addCodeInterval,
  addCodeMaxUses,
  addCodeTimeToNextUse
} from './ImportExport'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getQuarkBonus } from './Quark'
import { calculateSingularityDebuff } from './singularity'
import { format, formatTimeShort, player } from './Synergism'
import type { GlobalVariables } from './types/Synergism'
import { sumContents } from './Utility'
import { Globals as G } from './Variables'

export interface StatLine {
  i18n: string
  stat: () => number
  color?: string
  acc?: number
}

export const allCubeStats: StatLine[] = [
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.CUBE_BUFF,
    color: 'gold'
  },
  {
    i18n: 'AscensionTime',
    stat: () =>
      Math.pow(Math.min(1, player.ascensionCounter / resetTimeThreshold()), 2)
      * (1
        + ((1 / 4) * player.achievements[204]
            + (1 / 4) * player.achievements[211]
            + (1 / 2) * player.achievements[218])
          * Math.max(0, player.ascensionCounter / resetTimeThreshold() - 1))
  },
  {
    i18n: 'CampaignTutorial',
    stat: () => player.campaigns.tutorialBonus.cubeBonus
  },
  {
    i18n: 'Campaign',
    stat: () => player.campaigns.cubeBonus
  },
  {
    i18n: 'SunMoon',
    stat: () =>
      1
      + (6 / 100) * player.achievements[250]
      + (10 / 100) * player.achievements[251]
  },
  {
    i18n: 'SpeedAchievement',
    stat: () =>
      1
      + player.achievements[240]
        * Math.min(
          0.5,
          Math.max(
            0.1,
            (1 / 20) * Math.log10(calculateTimeAcceleration().mult + 0.01)
          )
        )
  },
  {
    i18n: 'Challenge15',
    stat: () =>
      G.challenge15Rewards.cube1.value
      * G.challenge15Rewards.cube2.value
      * G.challenge15Rewards.cube3.value
      * G.challenge15Rewards.cube4.value
      * G.challenge15Rewards.cube5.value
  },
  {
    i18n: 'InfiniteAscent',
    stat: () => 1 + (1 / 100) * calculateEffectiveIALevel()
  },
  {
    i18n: 'Beta',
    stat: () => 1 + player.platonicUpgrades[10]
  },
  {
    i18n: 'Omega',
    stat: () => Math.pow(1.01, player.platonicUpgrades[15] * player.challengecompletions[9])
  },
  {
    i18n: 'Powder',
    stat: () => calculateCubeMultFromPowder()
  },
  {
    i18n: 'SingDebuff',
    stat: () => 1 / calculateSingularityDebuff('Cubes')
  },
  {
    i18n: 'PassY',
    stat: () => 1 + (0.75 * player.shopUpgrades.seasonPassY) / 100
  },
  {
    i18n: 'PassZ',
    stat: () => 1 + (player.shopUpgrades.seasonPassZ * player.singularityCount) / 100
  },
  {
    i18n: 'PassINF',
    stat: () => Math.pow(1.02, player.shopUpgrades.seasonPassInfinity)
  },
  {
    i18n: 'CashGrabUltra',
    stat: () => +calculateCashGrabCubeBonus()
  },
  {
    i18n: 'EXUltra',
    stat: () => +calculateEXUltraCubeBonus()
  },
  {
    i18n: 'StarterPack',
    stat: () => 1 + 4 * (player.singularityUpgrades.starterPack.getEffect().bonus ? 1 : 0)
  },
  {
    i18n: 'SingCubes1',
    stat: () => +player.singularityUpgrades.singCubes1.getEffect().bonus
  },
  {
    i18n: 'SingCubes2',
    stat: () => +player.singularityUpgrades.singCubes2.getEffect().bonus
  },
  {
    i18n: 'SingCubes3',
    stat: () => +player.singularityUpgrades.singCubes3.getEffect().bonus
  },
  {
    i18n: 'SingCitadel',
    stat: () => +player.singularityUpgrades.singCitadel.getEffect().bonus
  },
  {
    i18n: 'SingCitadel2',
    stat: () => +player.singularityUpgrades.singCitadel2.getEffect().bonus
  },
  {
    i18n: 'Delta',
    stat: () =>
      1 + +player.singularityUpgrades.platonicDelta.getEffect().bonus
        * Math.min(
          9,
          (player.shopUpgrades.shopSingularitySpeedup > 0)
            ? player.singularityCounter * 50 / (3600 * 24)
            : player.singularityCounter / (3600 * 24)
        )
  },
  {
    i18n: 'CookieUpgrade8',
    stat: () => 1 + 0.25 * +G.isEvent * player.cubeUpgrades[58]
  },
  {
    i18n: 'CookieUpgrade16',
    stat: () => 1 + 1 * player.cubeUpgrades[66] * (1 - player.platonicUpgrades[15])
  },
  {
    i18n: 'WowOcteract',
    stat: () => calculateTotalOcteractCubeBonus()
  },
  {
    i18n: 'NoSing',
    stat: () => +player.singularityChallenges.noSingularityUpgrades.rewards.cubes
  },
  {
    i18n: 'TwentyAscensions',
    stat: () => +calculateEXALTBonusMult()
  },
  {
    i18n: 'Ambrosia',
    stat: () => calculateAmbrosiaCubeMult()
  },
  {
    i18n: 'ModuleTutorial',
    stat: () => +player.blueberryUpgrades.ambrosiaTutorial.bonus.cubes
  },
  {
    i18n: 'ModuleCubes1',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes1.bonus.cubes
  },
  {
    i18n: 'ModuleLuckCube1',
    stat: () => +player.blueberryUpgrades.ambrosiaLuckCube1.bonus.cubes
  },
  {
    i18n: 'ModuleQuarkCube1',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarkCube1.bonus.cubes
  },
  {
    i18n: 'ModuleCubes2',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes2.bonus.cubes
  },
  {
    i18n: 'ModuleHyperflux',
    stat: () => +player.blueberryUpgrades.ambrosiaHyperflux.bonus.hyperFlux
  },
  {
    i18n: 'Exalt6',
    stat: () => {
      let exaltPenalty = 1
      if (player.singularityChallenges.limitedTime.enabled) {
        const comps = player.singularityChallenges.limitedTime.completions
        const time = player.singChallengeTimer
        exaltPenalty = calculateExalt6Penalty(comps, time)
      }
      return exaltPenalty
    }
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.Cubes)
  }
]

export const allWowCubeStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(calculateAscensionScore().effectiveScore, 1 / 4.1)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass1',
    stat: () => 1 + (2.25 * player.shopUpgrades.seasonPass) / 100
  },
  {
    i18n: 'Researches',
    stat: () =>
      (1 + player.researches[119] / 400) // 5x19
      * (1 + player.researches[120] / 400) // 5x20
      * (1 + player.researches[137] / 100) // 6x12
      * (1 + (0.9 * player.researches[152]) / 100) // 7x2
      * (1 + (0.8 * player.researches[167]) / 100) // 7x17
      * (1 + (0.7 * player.researches[182]) / 100) // 8x7
      * (1
        + (0.03 / 100) * player.researches[192] * player.antUpgrades[12 - 1]!) // 8x17
      * (1 + (0.6 * player.researches[197]) / 100) // 8x22
  },
  {
    i18n: 'Research8x25',
    stat: () => 1 + (0.004 / 100) * player.researches[200]
  },
  {
    i18n: 'CubeUpgrades',
    stat: () =>
      (1 + player.cubeUpgrades[1] / 6) // 1x1
      * (1 + player.cubeUpgrades[11] / 11) // 2x1
      * (1 + 0.4 * player.cubeUpgrades[30]) // 3x10
  },
  {
    i18n: 'ConstantUpgrade10',
    stat: () =>
      1
      + 0.01
        * Decimal.log(player.ascendShards.add(1), 4)
        * Math.min(1, player.constantUpgrades[10])
  },
  {
    i18n: 'Achievement189',
    stat: () => 1 + player.achievements[189] * Math.min(2, player.ascensionCount / 2.5e8)
  },
  {
    i18n: 'Achievement193',
    stat: () =>
      1
      + (player.achievements[193] * Decimal.log(player.ascendShards.add(1), 10))
        / 400
  },
  {
    i18n: 'Achievement195',
    stat: () =>
      1
      + Math.min(
        250,
        (player.achievements[195]
          * Decimal.log(player.ascendShards.add(1), 10))
          / 400
      )
  },
  {
    i18n: 'Achievement198-201',
    stat: () =>
      1
      + (4 / 100)
        * (player.achievements[198]
          + player.achievements[199]
          + player.achievements[200])
      + (3 / 100) * player.achievements[201]
  },
  {
    i18n: 'Achievement254',
    stat: () =>
      1
      + Math.min(0.15, (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1))
        * player.achievements[254]
  },
  {
    i18n: 'SpiritPower',
    stat: () => 1 + player.corruptions.used.totalCorruptionDifficultyMultiplier * G.effectiveRuneSpiritPower[2]
  },
  {
    i18n: 'PlatonicOpening',
    stat: () => 1 + G.platonicBonusMultiplier[0]
  },
  {
    i18n: 'Platonic1x1',
    stat: () =>
      1
      + 0.00009
        * player.corruptions.used.totalLevels
        * player.platonicUpgrades[1]
  },
  {
    i18n: 'CookieUpgrade13',
    stat: () =>
      1 + Math.pow(1.03, Math.log10(Math.max(1, player.wowAbyssals))) * player.cubeUpgrades[63]
      - player.cubeUpgrades[63]
  }
]

export const allTesseractStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(1 + Math.max(0, calculateAscensionScore().effectiveScore - 1e5) / 1e4, 0.35)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass1',
    stat: () => 1 + (2.25 * player.shopUpgrades.seasonPass) / 100
  },
  {
    i18n: 'ConstantUpgrade10',
    stat: () => 1 + 0.01 * Decimal.log(player.ascendShards.add(1), 4) * Math.min(1, player.constantUpgrades[10])
  },
  {
    i18n: 'CubeUpgrade3x10',
    stat: () => 1 + 0.4 * player.cubeUpgrades[30]
  },
  {
    i18n: 'CubeUpgrade4x8',
    stat: () => 1 + (1 / 200) * player.cubeUpgrades[38] * player.corruptions.used.totalLevels
  },
  {
    i18n: 'Achievement195',
    stat: () =>
      1 + Math.min(
        250,
        (player.achievements[195] * Decimal.log(player.ascendShards.add(1), 10)) / 400
      )
  },
  {
    i18n: 'Achievement202',
    stat: () => 1 + player.achievements[202] * Math.min(2, player.ascensionCount / 5e8)
  },
  {
    i18n: 'Achievement205-208',
    stat: () =>
      1 + (4 / 100) * (
          player.achievements[205]
          + player.achievements[206]
          + player.achievements[207]
        )
      + (3 / 100) * player.achievements[208]
  },
  {
    i18n: 'Achievement255',
    stat: () =>
      1 + Math.min(
          0.15,
          (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1)
        ) * player.achievements[255]
  },
  {
    i18n: 'PlatonicCube',
    stat: () => G.platonicBonusMultiplier[1]
  },
  {
    i18n: 'Platonic1x2',
    stat: () => 1 + 0.00018 * player.corruptions.used.totalLevels * player.platonicUpgrades[2]
  }
]

export const allHypercubeStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(1 + Math.max(0, calculateAscensionScore().effectiveScore - 1e9) / 1e8, 0.5)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass2',
    stat: () => 1 + (1.5 * player.shopUpgrades.seasonPass2) / 100
  },
  {
    i18n: 'Achievement212-215',
    stat: () =>
      1 + (4 / 100) * (
          player.achievements[212]
          + player.achievements[213]
          + player.achievements[214]
        )
      + (3 / 100) * player.achievements[215]
  },
  {
    i18n: 'Achievement216',
    stat: () => 1 + player.achievements[216] * Math.min(2, player.ascensionCount / 1e9)
  },
  {
    i18n: 'Achievement253',
    stat: () => 1 + (1 / 10) * player.achievements[253]
  },
  {
    i18n: 'Achievement256',
    stat: () =>
      1 + Math.min(
          0.15,
          (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1)
        ) * player.achievements[256]
  },
  {
    i18n: 'Achievement265',
    stat: () => 1 + Math.min(2, player.ascensionCount / 2.5e10) * player.achievements[265]
  },
  {
    i18n: 'PlatonicCube',
    stat: () => G.platonicBonusMultiplier[2]
  },
  {
    i18n: 'Platonic1x3',
    stat: () => 1 + 0.00054 * player.corruptions.used.totalLevels * player.platonicUpgrades[3]
  },
  {
    i18n: 'HyperrealHepteract',
    stat: () => 1 + (0.6 / 1000) * hepteractEffective('hyperrealism')
  }
]

export const allPlatonicCubeStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(1 + Math.max(0, calculateAscensionScore().effectiveScore - 2.666e12) / 2.666e11, 0.75)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass2',
    stat: () => 1 + (1.5 * player.shopUpgrades.seasonPass2) / 100
  },
  {
    i18n: 'Achievement196',
    stat: () =>
      1 + Math.min(
        20,
        ((player.achievements[196] * 1) / 5000) * Decimal.log(player.ascendShards.add(1), 10)
      )
  },
  {
    i18n: 'Achievement219-222',
    stat: () =>
      1 + (4 / 100) * (
          player.achievements[219]
          + player.achievements[220]
          + player.achievements[221]
        )
      + (3 / 100) * player.achievements[222]
  },
  {
    i18n: 'Achievement223',
    stat: () => 1 + player.achievements[223] * Math.min(2, player.ascensionCount / 1.337e9)
  },
  {
    i18n: 'Achievement257',
    stat: () =>
      1 + Math.min(
          0.15,
          (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1)
        ) * player.achievements[257]
  },
  {
    i18n: 'PlatonicCube',
    stat: () => G.platonicBonusMultiplier[3]
  },
  {
    i18n: 'Platonic1x4',
    stat: () => 1 + (1.2 * player.platonicUpgrades[4]) / 50
  }
]

export const allHepteractCubeStats: StatLine[] = [
  {
    i18n: 'AscensionScore',
    stat: () => Math.pow(1 + Math.max(0, calculateAscensionScore().effectiveScore - 1.666e16) / 3.33e16, 0.85)
  },
  {
    i18n: 'GlobalCube',
    stat: () => calculateAllCubeMultiplier()
  },
  {
    i18n: 'SeasonPass3',
    stat: () => 1 + (1.5 * player.shopUpgrades.seasonPass3) / 100
  },
  {
    i18n: 'Achievement258',
    stat: () =>
      1 + Math.min(
          0.15,
          (0.6 / 100) * Math.log10(calculateAscensionScore().effectiveScore + 1)
        ) * player.achievements[258]
  },
  {
    i18n: 'Achievement264',
    stat: () => 1 + Math.min(0.4, player.ascensionCount / 2e13) * player.achievements[264]
  },
  {
    i18n: 'Achievement265',
    stat: () => 1 + Math.min(0.2, player.ascensionCount / 8e14) * player.achievements[265]
  },
  {
    i18n: 'Achievement270',
    stat: () =>
      Math.min(
        2,
        1 + (1 / 1000000) * Decimal.log(player.ascendShards.add(1), 10) * player.achievements[270]
      )
  }
]

export const allOcteractCubeStats: StatLine[] = [
  {
    i18n: 'BasePerSecond',
    stat: () => 1 / (24 * 3600 * 365 * 1e15)
  },
  {
    i18n: 'AscensionScore',
    stat: () => {
      const SCOREREQ = 1e23
      const currentScore = calculateAscensionScore().effectiveScore
      return currentScore >= SCOREREQ ? currentScore / SCOREREQ : 0
    }
  },
  {
    i18n: 'PseudoCoins',
    stat: () => PCoinUpgradeEffects.CUBE_BUFF,
    color: 'gold'
  },
  {
    i18n: 'Campaign',
    stat: () => player.campaigns.octeractBonus
  },
  {
    i18n: 'SeasonPass3',
    stat: () => 1 + (1.5 * player.shopUpgrades.seasonPass3) / 100
  },
  {
    i18n: 'SeasonPassY',
    stat: () => 1 + (0.75 * player.shopUpgrades.seasonPassY) / 100
  },
  {
    i18n: 'SeasonPassZ',
    stat: () => 1 + (player.shopUpgrades.seasonPassZ * player.singularityCount) / 100
  },
  {
    i18n: 'SeasonPassLost',
    stat: () => 1 + player.shopUpgrades.seasonPassLost / 1000
  },
  {
    i18n: 'CookieUpgrade20',
    stat: () => 1 + (+(player.corruptions.used.totalLevels >= 14 * 8) * player.cubeUpgrades[70]) / 10000
  },
  {
    i18n: 'DivinePack',
    stat: () => 1 + +(player.corruptions.used.totalLevels) * +player.singularityUpgrades.divinePack.getEffect().bonus
  },
  {
    i18n: 'SingCubes1',
    stat: () => +player.singularityUpgrades.singCubes1.getEffect().bonus
  },
  {
    i18n: 'SingCubes2',
    stat: () => +player.singularityUpgrades.singCubes2.getEffect().bonus
  },
  {
    i18n: 'SingCubes3',
    stat: () => +player.singularityUpgrades.singCubes3.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain',
    stat: () => +player.singularityUpgrades.singOcteractGain.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain2',
    stat: () => +player.singularityUpgrades.singOcteractGain2.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain3',
    stat: () => +player.singularityUpgrades.singOcteractGain3.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain4',
    stat: () => +player.singularityUpgrades.singOcteractGain4.getEffect().bonus
  },
  {
    i18n: 'SingOcteractGain5',
    stat: () => +player.singularityUpgrades.singOcteractGain5.getEffect().bonus
  },
  {
    i18n: 'PatreonBonus',
    stat: () => 1 + (getQuarkBonus() / 100) * +player.singularityUpgrades.singOcteractPatreonBonus.getEffect().bonus
  },
  {
    i18n: 'OcteractStarter',
    stat: () => 1 + 0.2 * +player.octeractUpgrades.octeractStarter.getEffect().bonus
  },
  {
    i18n: 'OcteractGain',
    stat: () => +player.octeractUpgrades.octeractGain.getEffect().bonus
  },
  {
    i18n: 'OcteractGain2',
    stat: () => +player.octeractUpgrades.octeractGain2.getEffect().bonus
  },
  {
    i18n: 'DerpsmithCornucopia',
    stat: () => derpsmithCornucopiaBonus()
  },
  {
    i18n: 'DigitalOcteractAccumulator',
    stat: () =>
      Math.pow(
        1 + +player.octeractUpgrades.octeractAscensionsOcteractGain.getEffect().bonus,
        1 + Math.floor(Math.log10(1 + player.ascensionCount))
      )
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.Octeract)
  },
  {
    i18n: 'PlatonicDelta',
    stat: () =>
      1 + +player.singularityUpgrades.platonicDelta.getEffect().bonus
        * Math.min(
          9,
          (player.shopUpgrades.shopSingularitySpeedup > 0)
            ? player.singularityCounter * 50 / (3600 * 24)
            : player.singularityCounter / (3600 * 24)
        )
  },
  {
    i18n: 'NoSingUpgrades',
    stat: () => +player.singularityChallenges.noSingularityUpgrades.rewards.cubes
  },
  {
    i18n: 'PassINF',
    stat: () => Math.pow(1.02, player.shopUpgrades.seasonPassInfinity)
  },
  {
    i18n: 'Ambrosia',
    stat: () => calculateAmbrosiaCubeMult()
  },
  {
    i18n: 'ModuleTutorial',
    stat: () => +player.blueberryUpgrades.ambrosiaTutorial.bonus.cubes
  },
  {
    i18n: 'ModuleCubes1',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes1.bonus.cubes
  },
  {
    i18n: 'ModuleLuckCube1',
    stat: () => +player.blueberryUpgrades.ambrosiaLuckCube1.bonus.cubes
  },
  {
    i18n: 'ModuleQuarkCube1',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarkCube1.bonus.cubes
  },
  {
    i18n: 'ModuleCubes2',
    stat: () => +player.blueberryUpgrades.ambrosiaCubes2.bonus.cubes
  },
  {
    i18n: 'CashGrabUltra',
    stat: () => +calculateCashGrabCubeBonus()
  },
  {
    i18n: 'EXUltra',
    stat: () => +calculateEXUltraCubeBonus()
  },
  {
    i18n: 'AscensionSpeed',
    stat: () => {
      const ascensionSpeed = player.singularityUpgrades.oneMind.getEffect().bonus
        ? Math.pow(10, 1 / 2) * Math.pow(
          calculateAscensionAcceleration() / 10,
          +player.octeractUpgrades.octeractOneMindImprover.getEffect().bonus
        )
        : Math.pow(calculateAscensionAcceleration(), 1 / 2)
      return ascensionSpeed
    }
  }
]

export const allBaseOfferingStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 6 // Absolute Base
  },
  {
    i18n: 'Prestige',
    stat: () => player.prestigeCount > 0 ? 1 : 0 // Prestiged
  },
  {
    i18n: 'Transcend',
    stat: () => player.transcendCount > 0 ? 3 : 0 // Transcended
  },
  {
    i18n: 'Reincarnate',
    stat: () => player.reincarnationCount > 0 ? 5 : 0 // Reincarnated
  },
  {
    i18n: 'Achievements',
    stat: () =>
      Math.min(player.prestigecounter / 1800, 1)
      * ((player.achievements[37] > 0 ? 15 : 0)
        + (player.achievements[44] > 0 ? 15 : 0)
        + (player.achievements[52] > 0 ? 25 : 0)) // Achievements 37, 44, 52 (Based on Prestige Timer)
  },
  {
    i18n: 'Challenge1',
    stat: () => (player.challengecompletions[2] > 0) ? 2 : 0 // Challenge 2x1
  },
  {
    i18n: 'ReincarnationUpgrade2',
    stat: () => (player.upgrades[62] > 0) ? Math.min(50, (1 / 50) * sumContents(player.challengecompletions)) : 0 // Reincarnation Upgrade 2
  },
  {
    i18n: 'Research1x24',
    stat: () => 0.4 * player.researches[24] // Research 1x24
  },
  {
    i18n: 'Research1x25',
    stat: () => 0.6 * player.researches[25] // Research 1x25
  },
  {
    i18n: 'Research4x20',
    stat: () => (player.researches[95] > 0) ? 15 : 0 // Research 4x20
  }
]

export const allOfferingStats = [
  {
    i18n: 'Base',
    stat: () => calculateBaseOfferings()
  },
  {
    i18n: 'PrestigeShards',
    stat: () => 1 + Math.pow(Decimal.log(player.prestigeShards.add(1), 10), 1 / 2) / 5 // Prestige Shards
  },
  {
    i18n: 'SuperiorIntellect',
    stat: () => 1 + (1 / 2000) * G.rune5level * G.effectiveLevelMult * (1 + player.researches[85] / 200) // Superior Intellect Rune
  },
  {
    i18n: 'ReincarnationChallenge',
    stat: () =>
      1 + 1 / 50 * CalcECC('reincarnation', player.challengecompletions[6])
      + 1 / 25 * CalcECC('reincarnation', player.challengecompletions[8])
      + 1 / 25 * CalcECC('reincarnation', player.challengecompletions[10]) // Reincarnation Challenges
  },
  {
    i18n: 'AlchemyAchievement5',
    stat: () => 1 + (10 * player.achievements[33]) / 100 // Alchemy Achievement 5
  },
  {
    i18n: 'AlchemyAchievement6',
    stat: () => 1 + (15 * player.achievements[34]) / 100 // Alchemy Achievement 6
  },
  {
    i18n: 'AlchemyAchievement7',
    stat: () => 1 + (25 * player.achievements[35]) / 100 // Alchemy Achievement 7
  },
  {
    i18n: 'DiamondUpgrade4x3',
    stat: () => 1 + (20 * player.upgrades[38]) / 100 // Diamond Upgrade 4x3
  },
  {
    i18n: 'ParticleUpgrade3x5',
    stat: () => 1 + player.upgrades[75] * 2 * Math.min(1, Math.pow(player.maxobtainium / 30000000, 0.5)) // Particle Upgrade 3x5
  },
  {
    i18n: 'AutoOfferingShop',
    stat: () => 1 + (1 / 50) * player.shopUpgrades.offeringAuto // Auto Offering Shop
  },
  {
    i18n: 'OfferingEXShop',
    stat: () => 1 + (1 / 25) * player.shopUpgrades.offeringEX // Offering EX Shop
  },
  {
    i18n: 'CashGrab',
    stat: () => 1 + (1 / 100) * player.shopUpgrades.cashGrab // Cash Grab
  },
  {
    i18n: 'Research4x10',
    stat: () => 1 + (1 / 10000) * sumContents(player.challengecompletions) * player.researches[85] // Research 4x10
  },
  {
    i18n: 'AntUpgrade',
    stat: () => 1 + Math.pow(player.antUpgrades[6 - 1]! + G.bonusant6, 0.66) // Ant Upgrade
  },
  {
    i18n: 'Brutus',
    stat: () => G.cubeBonusMultiplier[3] // Brutus
  },
  {
    i18n: 'ConstantUpgrade3',
    stat: () => 1 + 0.02 * player.constantUpgrades[3] // Constant Upgrade 3
  },
  {
    i18n: 'ResearchTalismans',
    stat: () =>
      1 + 0.0003 * player.talismanLevels[3 - 1] * player.researches[149]
      + 0.0004 * player.talismanLevels[3 - 1] * player.researches[179] // Research 6x24,8x4
  },
  {
    i18n: 'TutorialBonus',
    stat: () => player.campaigns.tutorialBonus.offeringBonus // Tutorial Offering Bonus
  },
  {
    i18n: 'CampaignBonus',
    stat: () => player.campaigns.offeringBonus // Campaign Offering Bonus
  },
  {
    i18n: 'Challenge12',
    stat: () => 1 + 0.12 * CalcECC('ascension', player.challengecompletions[12]) // Challenge 12
  },
  {
    i18n: 'Research8x25',
    stat: () => 1 + (0.01 / 100) * player.researches[200] // Research 8x25
  },
  {
    i18n: 'AscensionAchievement',
    stat: () => 1 + Math.min(1, player.ascensionCount / 1e6) * player.achievements[187] // Ascension Count Achievement
  },
  {
    i18n: 'SunMoonAchievements',
    stat: () => 1 + 0.6 * player.achievements[250] + 1 * player.achievements[251] // Sun&Moon Achievements
  },
  {
    i18n: 'CubeUpgrade5x6',
    stat: () => 1 + 0.05 * player.cubeUpgrades[46] // Cube Upgrade 5x6
  },
  {
    i18n: 'CubeUpgrade5x10',
    stat: () => 1 + (0.02 / 100) * player.cubeUpgrades[50] // Cube Upgrade 5x10
  },
  {
    i18n: 'PlatonicALPHA',
    stat: () => 1 + player.platonicUpgrades[5] // Platonic ALPHA
  },
  {
    i18n: 'PlatonicBETA',
    stat: () => 1 + 2.5 * player.platonicUpgrades[10] // Platonic BETA
  },
  {
    i18n: 'PlatonicOMEGA',
    stat: () => 1 + 5 * player.platonicUpgrades[15] // Platonic OMEGA
  },
  {
    i18n: 'Challenge15',
    stat: () => G.challenge15Rewards.offering.value // C15 Reward
  },
  {
    i18n: 'SingularityDebuff',
    stat: () => 1 / calculateSingularityDebuff('Offering'), // Singularity Debuff
    color: 'red'
  },
  {
    i18n: 'StarterPack',
    stat: () => 1 + 5 * (player.singularityUpgrades.starterPack.getEffect().bonus ? 1 : 0) // Starter Pack Upgrade
  },
  {
    i18n: 'OfferingCharge',
    stat: () => +player.singularityUpgrades.singOfferings1.getEffect().bonus // Offering Charge GQ Upgrade
  },
  {
    i18n: 'OfferingStorm',
    stat: () => +player.singularityUpgrades.singOfferings2.getEffect().bonus // Offering Storm GQ Upgrade
  },
  {
    i18n: 'OfferingTempest',
    stat: () => +player.singularityUpgrades.singOfferings3.getEffect().bonus // Offering Tempest GQ Upgrade
  },
  {
    i18n: 'Citadel',
    stat: () => +player.singularityUpgrades.singCitadel.getEffect().bonus // Citadel GQ Upgrade
  },
  {
    i18n: 'Citadel2',
    stat: () => +player.singularityUpgrades.singCitadel2.getEffect().bonus // Citadel 2 GQ Upgrade
  },
  {
    i18n: 'CubeUpgradeCx4',
    stat: () => 1 + player.cubeUpgrades[54] / 100 // Cube upgrade 6x4 (Cx4)
  },
  {
    i18n: 'CubeUpgradeCx12',
    stat: () => (player.cubeUpgrades[62] > 0 && player.currentChallenge.ascension === 15) ? 8 : 1 // Cube upgrade 7x2 (Cx12)
  },
  {
    i18n: 'OcteractElectrolosis',
    stat: () => +player.octeractUpgrades.octeractOfferings1.getEffect().bonus // Offering Electrolosis OC Upgrade
  },
  {
    i18n: 'OcteractBonus',
    stat: () => calculateTotalOcteractOfferingBonus() // Octeract Bonus
  },
  {
    i18n: 'Ambrosia',
    stat: () => 1 + 0.001 * +player.blueberryUpgrades.ambrosiaOffering1.bonus.offeringMult // Ambrosia!!
  },
  {
    i18n: 'CubeUpgradeCx22',
    stat: () => Math.pow(1.04, player.cubeUpgrades[72] * sumContents(player.talismanRarity)) // Cube upgrade 8x2 (Cx22)
  },
  {
    i18n: 'EXALTBonus',
    stat: () => calculateEXALTBonusMult() // 20 Ascensions X20 Bonus [EXALT ONLY]
  },
  {
    i18n: 'CashGrab2',
    stat: () => 1 + (1 / 200) * player.shopUpgrades.cashGrab2 // Cash Grab 2
  },
  {
    i18n: 'OfferingEX2',
    stat: () => 1 + (1 / 100) * player.shopUpgrades.offeringEX2 * player.singularityCount // Offering EX 2
  },
  {
    i18n: 'OfferingINF',
    stat: () => Math.pow(1.02, player.shopUpgrades.offeringEX3) // Offering INF
  },
  {
    i18n: 'EXUltra',
    stat: () => calculateEXUltraOfferingBonus() // EX Ultra Shop Upgrade
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.Offering) // Event
  },
  {
    i18n: 'Exalt6Penalty',
    stat: () => calculateExalt6Penalty(player.singularityChallenges.limitedTime.completions, player.singChallengeTimer), // Singularity Speedrun Penalty
    color: 'red'
  }
]

export const allQuarkStats: StatLine[] = [
  {
    i18n: 'AchievementPoints',
    stat: () => 1 + player.achievementPoints / 50000
  },
  {
    i18n: 'Achievement250',
    stat: () => player.achievements[250] > 0 ? 1.05 : 1
  },
  {
    i18n: 'Achievement251',
    stat: () => player.achievements[251] > 0 ? 1.05 : 1
  },
  {
    i18n: 'Achievement266',
    stat: () => player.achievements[266] > 0 ? 1 + Math.min(0.1, player.ascensionCount / 1e16) : 1
  },
  {
    i18n: 'PlatonicALPHA',
    stat: () => player.platonicUpgrades[5] > 0 ? 1.05 : 1
  },
  {
    i18n: 'PlatonicBETA',
    stat: () => player.platonicUpgrades[10] > 0 ? 1.1 : 1
  },
  {
    i18n: 'PlatonicOMEGA',
    stat: () => player.platonicUpgrades[15] > 0 ? 1.15 : 1
  },
  {
    i18n: 'Challenge15',
    stat: () =>
      player.challenge15Exponent >= G.challenge15Rewards.quarks.requirement ? G.challenge15Rewards.quarks.value : 1
  },
  {
    i18n: 'CampaignBonus',
    stat: () => player.campaigns.quarkBonus
  },
  {
    i18n: 'InfiniteAscent',
    stat: () => isIARuneUnlocked() ? 1.1 + (5 / 1300) * calculateEffectiveIALevel() : 1
  },
  {
    i18n: 'QuarkHepteract',
    stat: () =>
      player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
        ? 1 + 5 / 10000 * hepteractEffective('quark')
        : 1
  },
  {
    i18n: 'Powder',
    stat: () => calculateQuarkMultFromPowder()
  },
  {
    i18n: 'SingularityCount',
    stat: () => 1 + player.singularityCount / 10
  },
  {
    i18n: 'CookieUpgrade3',
    stat: () => 1 + 0.001 * player.cubeUpgrades[53]
  },
  {
    i18n: 'CookieUpgrade18',
    stat: () => 1 + (1 / 10000) * player.cubeUpgrades[68] + 0.05 * Math.floor(player.cubeUpgrades[68] / 1000)
  },
  {
    i18n: 'SingularityMilestones',
    stat: () => calculateSingularityQuarkMilestoneMultiplier()
  },
  {
    i18n: 'OcteractQuarkBonus',
    stat: () => calculateTotalOcteractQuarkBonus()
  },
  {
    i18n: 'OcteractStarter',
    stat: () => +player.octeractUpgrades.octeractStarter.getEffect().bonus
  },
  {
    i18n: 'OcteractQuarkGain',
    stat: () => +player.octeractUpgrades.octeractQuarkGain.getEffect().bonus
  },
  {
    i18n: 'OcteractQuarkGain2',
    stat: () =>
      1
      + (1 / 10000) * Math.floor(player.octeractUpgrades.octeractQuarkGain.level / 111)
        * player.octeractUpgrades.octeractQuarkGain2.level
        * Math.floor(1 + Math.log10(Math.max(1, player.hepteractCrafts.quark.BAL)))
  },
  {
    i18n: 'SingularityPacks',
    stat: () =>
      1 + 0.02 * player.singularityUpgrades.intermediatePack.level
      + 0.04 * player.singularityUpgrades.advancedPack.level + 0.06 * player.singularityUpgrades.expertPack.level
      + 0.08 * player.singularityUpgrades.masterPack.level + 0.1 * player.singularityUpgrades.divinePack.level
  },
  {
    i18n: 'SingQuarkImprover1',
    stat: () => +player.singularityUpgrades.singQuarkImprover1.getEffect().bonus
  },
  {
    i18n: 'AmbrosiaQuarkMult',
    stat: () => calculateAmbrosiaQuarkMult()
  },
  {
    i18n: 'AmbrosiaTutorial',
    stat: () => +player.blueberryUpgrades.ambrosiaTutorial.bonus.quarks
  },
  {
    i18n: 'AmbrosiaQuarks1',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarks1.bonus.quarks
  },
  {
    i18n: 'AmbrosiaCubeQuark1',
    stat: () => +player.blueberryUpgrades.ambrosiaCubeQuark1.bonus.quarks
  },
  {
    i18n: 'AmbrosiaLuckQuark1',
    stat: () => +player.blueberryUpgrades.ambrosiaLuckQuark1.bonus.quarks
  },
  {
    i18n: 'AmbrosiaQuarks2',
    stat: () => +player.blueberryUpgrades.ambrosiaQuarks2.bonus.quarks
  },
  {
    i18n: 'CashGrabQuarkBonus',
    stat: () => calculateCashGrabQuarkBonus()
  },
  {
    i18n: 'LimitedTimeChallenge',
    stat: () => +player.singularityChallenges.limitedTime.rewards.quarkMult
  },
  {
    i18n: 'SadisticPrequel',
    stat: () => +player.singularityChallenges.sadisticPrequel.rewards.quarkMult
  },
  {
    i18n: 'FirstSingularityBonus',
    stat: () => player.highestSingularityCount === 0 ? 1.25 : 1,
    color: 'cyan'
  },
  {
    i18n: 'Event',
    stat: () => G.isEvent ? 1 + calculateEventBuff(BuffType.Quark) + calculateEventBuff(BuffType.OneMind) : 1,
    color: 'lime'
  },
  {
    i18n: 'PatreonBonus',
    stat: () => 1 + getQuarkBonus() / 100,
    acc: 3,
    color: 'gold'
  }
]

export const allBaseObtainiumStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => 1 // Absolute base value
  },
  {
    i18n: 'Achievement51',
    stat: () => (player.achievements[51] > 0) ? 4 : 0 // Achievement 51
  },
  {
    i18n: 'Research3x13',
    stat: () => player.researches[63] // Research 3x13
  },
  {
    i18n: 'Research3x14',
    stat: () => 2 * player.researches[64] // Research 3x14
  },
  {
    i18n: 'FirstSingularity',
    stat: () => (player.highestSingularityCount > 0) ? 3 : 0 // First Singularity Perk
  },
  {
    i18n: 'SingularityCount',
    stat: () => Math.floor(player.singularityCount / 10) // Singularity Count
  }
]

export const allObtainiumIgnoreDRCapStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => calculateBaseObtainium() // Absolute Base
  },
  {
    i18n: 'CubeUpgrade4x2',
    stat: () => 1 + (4 / 100) * player.cubeUpgrades[42] // Cube Upgrade 4x2
  },
  {
    i18n: 'CubeUpgrade4x3',
    stat: () => 1 + (3 / 100) * player.cubeUpgrades[43] // Cube Upgrade 4x3
  },
  {
    i18n: 'PlatonicALPHA',
    stat: () => 1 + player.platonicUpgrades[5] // Platonic ALPHA
  },
  {
    i18n: 'PlatonicUpgrade9',
    stat: () => 1 + 1.5 * player.platonicUpgrades[9] // 9th Platonic Upgrade
  },
  {
    i18n: 'PlatonicBETA',
    stat: () => 1 + 2.5 * player.platonicUpgrades[10] // Platonic BETA
  },
  {
    i18n: 'PlatonicOMEGA',
    stat: () => 1 + 5 * player.platonicUpgrades[15] // Platonic OMEGA
  },
  {
    i18n: 'CubeUpgradeCx5',
    stat: () => 1 + player.cubeUpgrades[55] / 100 // Cube Upgrade 6x5 (Cx5)
  },
  {
    i18n: 'CubeUpgradeCx12',
    stat: () => (player.cubeUpgrades[62] > 0 && player.currentChallenge.ascension === 15) ? 8 : 1, // Cube Upgrade 7x2 (Cx12)
    color: 'cyan'
  },
  {
    i18n: 'CubeUpgradeCx21',
    stat: () => Math.pow(1.04, player.cubeUpgrades[71] * sumContents(player.talismanRarity)) // Cube Upgrade 8x1
  },
  {
    i18n: 'EXALTBonus',
    stat: () => calculateEXALTBonusMult(), // EXALT Bonus Multiplier
    color: 'cyan'
  },
  {
    i18n: 'Exalt6Penalty',
    stat: () => calculateExalt6Penalty(player.singularityChallenges.limitedTime.completions, player.singChallengeTimer), // Singularity Challenge 6 Penalty
    color: 'red'
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.Obtainium) // Event Buff
  }
]

export const allObtainiumStats: StatLine[] = [
  {
    i18n: 'Base',
    stat: () => calculateBaseObtainium() // Base Obtainium
  },
  {
    i18n: 'TranscendShards',
    stat: () => Math.pow(Decimal.log(player.transcendShards.add(1), 10) / 300, 2) // Transcend Shards
  },
  {
    i18n: 'ReincarnationUpgrade9',
    stat: () =>
      (player.upgrades[69] > 0)
        ? Math.min(10, Decimal.pow(Decimal.log(G.reincarnationPointGain.add(10), 10), 0.5).toNumber())
        : 1 // Reincarnation Upgrade 9
  },
  {
    i18n: 'ReincarnationUpgrade12',
    stat: () =>
      (player.upgrades[72] > 0) ? Math.min(50, 1 + 2 * sumContents(player.challengecompletions.slice(6, 11))) : 1 // Reincarnation Upgrade 12
  },
  {
    i18n: 'ReincarnationUpgrade14',
    stat: () => (player.upgrades[74] > 0) ? 1 + 4 * Math.min(1, Math.pow(player.maxofferings / 100000, 0.5)) : 1 // Reincarnation Upgrade 14
  },
  {
    i18n: 'Research3x15',
    stat: () => 1 + player.researches[65] / 5 // Research 3x15
  },
  {
    i18n: 'Research4x1',
    stat: () => 1 + player.researches[76] / 10 // Research 4x1
  },
  {
    i18n: 'Research4x6',
    stat: () => 1 + player.researches[81] / 10 // Research 4x6
  },
  {
    i18n: 'ShopObtainiumAuto',
    stat: () => 1 + player.shopUpgrades.obtainiumAuto / 50 // Shop Upgrade Auto Obtainium
  },
  {
    i18n: 'ShopCashGrab',
    stat: () => 1 + player.shopUpgrades.cashGrab / 100 // Shop Upgrade Cash Grab
  },
  {
    i18n: 'ShopObtainiumEX',
    stat: () => 1 + player.shopUpgrades.obtainiumEX / 25 // Shop Upgrade Obtainium EX
  },
  {
    i18n: 'Rune5',
    stat: () =>
      1
      + (G.rune5level / 200) * G.effectiveLevelMult
        * (1
          + (player.researches[84] / 200)
            * (1 + G.effectiveRuneSpiritPower[5] * player.corruptions.used.totalCorruptionDifficultyMultiplier)) // Rune 5
  },
  {
    i18n: 'ChallengeAchievements',
    stat: () =>
      1 + 0.01 * player.achievements[84] + 0.03 * player.achievements[91] + 0.05 * player.achievements[98]
      + 0.07 * player.achievements[105] + 0.09 * player.achievements[112] + 0.11 * player.achievements[119]
      + 0.13 * player.achievements[126] + 0.15 * player.achievements[133] + 0.17 * player.achievements[140]
      + 0.19 * player.achievements[147] // Challenge Achievements
  },
  {
    i18n: 'Ant10',
    stat: () => 1 + 2 * Math.pow((player.antUpgrades[10 - 1]! + G.bonusant10) / 50, 2 / 3) // Ant 10
  },
  {
    i18n: 'Achievement53',
    stat: () => (player.achievements[53] > 0) ? 1 + G.runeSum / 800 : 1 // Achievement 53
  },
  {
    i18n: 'Achievement128',
    stat: () => (player.achievements[128] > 0) ? 1.5 : 1 // Achievement 128
  },
  {
    i18n: 'Achievement129',
    stat: () => (player.achievements[129] > 0) ? 1.25 : 1 // Achievement 129
  },
  {
    i18n: 'Achievement188',
    stat: () => (player.achievements[188] > 0) ? 1 + Math.min(2, player.ascensionCount / 5e6) : 1 // Achievement 188
  },
  {
    i18n: 'Achievement250_251',
    stat: () => 1 + 0.6 * player.achievements[250] + player.achievements[251] // Achievement 250, 251
  },
  {
    i18n: 'CubeBonus',
    stat: () => G.cubeBonusMultiplier[5] // Cube Bonus
  },
  {
    i18n: 'ConstantUpgrade4',
    stat: () => 1 + 0.04 * player.constantUpgrades[4] // Constant Upgrade
  },
  {
    i18n: 'CubeUpgrade1x3',
    stat: () => 1 + 0.1 * player.cubeUpgrades[3] // Cube Upgrade 1x3
  },
  {
    i18n: 'CubeUpgrade4x7',
    stat: () => 1 + 0.1 * player.cubeUpgrades[47] // Cube Upgrade 4x7
  },
  {
    i18n: 'TutorialBonus',
    stat: () => player.campaigns.tutorialBonus.obtainiumBonus // Campaign Tutorial Bonus
  },
  {
    i18n: 'CampaignBonus',
    stat: () => player.campaigns.obtainiumBonus // Campaign Obtainium Bonus
  },
  {
    i18n: 'Challenge12',
    stat: () => 1 + 0.5 * CalcECC('ascension', player.challengecompletions[12]) // Challenge 12
  },
  {
    i18n: 'SpiritPower',
    stat: () => 1 + player.corruptions.used.totalCorruptionDifficultyMultiplier * G.effectiveRuneSpiritPower[4] // 4th Spirit
  },
  {
    i18n: 'Research6x19',
    stat: () => 1 + ((0.03 * Math.log(player.uncommonFragments + 1)) / Math.log(4)) * player.researches[144] // Research 6x19
  },
  {
    i18n: 'PlatonicALPHA',
    stat: () => 1 + player.platonicUpgrades[5] // Platonic ALPHA
  },
  {
    i18n: 'PlatonicUpgrade9',
    stat: () => 1 + 1.5 * player.platonicUpgrades[9] // 9th Platonic Upgrade
  },
  {
    i18n: 'PlatonicBETA',
    stat: () => 1 + 2.5 * player.platonicUpgrades[10] // Platonic BETA
  },
  {
    i18n: 'PlatonicOMEGA',
    stat: () => 1 + 5 * player.platonicUpgrades[15] // Platonic OMEGA
  },
  {
    i18n: 'CubeUpgrade5x10',
    stat: () => 1 + 0.0002 * player.cubeUpgrades[50] // Cube Upgrade 5x10
  },
  {
    i18n: 'StarterPack',
    stat: () => 1 + 5 * (player.singularityUpgrades.starterPack.getEffect().bonus ? 1 : 0) // Starter Pack
  },
  {
    i18n: 'SingObtainium1',
    stat: () => +player.singularityUpgrades.singObtainium1.getEffect().bonus // Obtainium GQ Upgrade 1
  },
  {
    i18n: 'SingObtainium2',
    stat: () => +player.singularityUpgrades.singObtainium2.getEffect().bonus // Obtainium GQ Upgrade 2
  },
  {
    i18n: 'SingObtainium3',
    stat: () => +player.singularityUpgrades.singObtainium3.getEffect().bonus // Obtainium GQ Upgrade 3
  },
  {
    i18n: 'SingCitadel',
    stat: () => +player.singularityUpgrades.singCitadel.getEffect().bonus // Singularity Citadel 1
  },
  {
    i18n: 'SingCitadel2',
    stat: () => +player.singularityUpgrades.singCitadel2.getEffect().bonus // Singularity Citadel 2
  },
  {
    i18n: 'CubeUpgradeCx5',
    stat: () => 1 + player.cubeUpgrades[55] / 100 // Cube Upgrade 6x5 (Cx5)
  },
  {
    i18n: 'CubeUpgradeCx12',
    stat: () => (player.cubeUpgrades[62] > 0 && player.currentChallenge.ascension === 15) ? 8 : 1, // Cube Upgrade 7x2 (Cx12)
    color: 'cyan'
  },
  {
    i18n: 'CubeUpgradeCx21',
    stat: () => Math.pow(1.04, player.cubeUpgrades[71] * sumContents(player.talismanRarity)) // Cube Upgrade 8x1
  },
  {
    i18n: 'ShopCashGrab2',
    stat: () => 1 + (1 / 200) * player.shopUpgrades.cashGrab2 // Cash Grab 2 Shop Upgrade
  },
  {
    i18n: 'ShopObtainiumEX2',
    stat: () => 1 + (1 / 100) * player.shopUpgrades.obtainiumEX2 * player.singularityCount // Obtainium EX 2 Shop Upgrade
  },
  {
    i18n: 'ShopObtainiumEX3',
    stat: () => Math.pow(1.02, player.shopUpgrades.obtainiumEX3) // Obtainium EX 3 Shop Upgrade
  },
  {
    i18n: 'OcteractBonus',
    stat: () => calculateTotalOcteractObtainiumBonus() // Octeract Obtainium Bonus
  },
  {
    i18n: 'OcteractObtainium1',
    stat: () => +player.octeractUpgrades.octeractObtainium1.getEffect().bonus // Octeract Obtainium 1
  },
  {
    i18n: 'AmbrosiaObtainium1',
    stat: () => 1 + 0.001 * +player.blueberryUpgrades.ambrosiaObtainium1.bonus.obtainiumMult // Ambrosia Obtainium 1
  },
  {
    i18n: 'EXUltraObtainium',
    stat: () => calculateEXUltraObtainiumBonus() // EX Ultra Obtainium Bonus
  },
  {
    i18n: 'EXALTBonus',
    stat: () => calculateEXALTBonusMult(), // EXALT Bonus Multiplier
    color: 'cyan'
  },
  {
    i18n: 'Challenge14',
    stat: () => (player.currentChallenge.ascension === 14) ? 0 : 1, // Challenge 14: No Obtainium
    color: 'red'
  },
  {
    i18n: 'SingularityDebuff',
    stat: () => 1 / calculateSingularityDebuff('Obtainium'), // Singularity Debuff
    color: 'red'
  },
  {
    i18n: 'Exalt6Penalty',
    stat: () => calculateExalt6Penalty(player.singularityChallenges.limitedTime.completions, player.singChallengeTimer), // Singularity Challenge 6 Penalty
    color: 'red'
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.Obtainium), // Event Buff
    color: 'lime'
  }
]

// For use in displaying the second half of Obtainium Multiplier Stats
export const obtainiumDR: StatLine[] = [
  {
    i18n: 'ObtainiumDR',
    stat: () => player.corruptions.used.corruptionEffects('illiteracy'),
    color: 'orange'
  },
  {
    i18n: 'ImmaculateObtainium',
    stat: () => calculateObtainiumDRIgnoreCap()
  }
]

// Ditto (This is used in the display as well as the calculation for total Obtainium / Offerings. Append this to the end of obtainiumDR in displays)
export const offeringObtainiumTimeModifiers = (time: number, timeMultCheck: boolean): StatLine[] => {
  return [
    {
      i18n: 'ThresholdPenalty',
      stat: () => Math.min(1, Math.pow(time / resetTimeThreshold(), 2)),
      color: 'red'
    },
    {
      i18n: 'TimeMultiplier',
      stat: () => timeMultCheck ? Math.max(1, time / resetTimeThreshold()) : 1
    },
    {
      i18n: 'HalfMind',
      stat: () => (player.singularityUpgrades.halfMind.getEffect().bonus) ? calculateTimeAcceleration().mult / 10 : 1
    }
  ]
}

export const antSacrificeRewardStats: StatLine[] = [
  {
    i18n: 'AntUpgrade11',
    stat: () => 1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11 - 1]! + G.bonusant11) / 125))
  },
  {
    i18n: 'Research103',
    stat: () => 1 + player.researches[103] / 20
  },
  {
    i18n: 'Research104',
    stat: () => 1 + player.researches[104] / 20
  },
  {
    i18n: 'Achievement132',
    stat: () => player.achievements[132] === 1 ? 1.25 : 1
  },
  {
    i18n: 'Achievement137',
    stat: () => player.achievements[137] === 1 ? 1.25 : 1
  },
  {
    i18n: 'RuneBlessing',
    stat: () => 1 + (20 / 3) * G.effectiveRuneBlessingPower[3]
  },
  {
    i18n: 'Challenge10',
    stat: () => 1 + (1 / 50) * CalcECC('reincarnation', player.challengecompletions[10])
  },
  {
    i18n: 'Research122',
    stat: () => 1 + (1 / 50) * player.researches[122]
  },
  {
    i18n: 'Research133',
    stat: () => 1 + (3 / 100) * player.researches[133]
  },
  {
    i18n: 'Research163',
    stat: () => 1 + (2 / 100) * player.researches[163]
  },
  {
    i18n: 'Research193',
    stat: () => 1 + (1 / 100) * player.researches[193]
  },
  {
    i18n: 'ParticleUpgrade4x4',
    stat: () => 1 + (1 / 10) * player.upgrades[79]
  },
  {
    i18n: 'AcceleratorBoostUpgrade',
    stat: () => 1 + (1 / 4) * player.upgrades[40]
  },
  {
    i18n: 'CubeBlessingAres',
    stat: () => G.cubeBonusMultiplier[7]
  },
  {
    i18n: 'Event',
    stat: () => 1 + calculateEventBuff(BuffType.AntSacrifice)
  }
]

export const antSacrificeTimeStats = (time: number, timeMultCheck: boolean): StatLine[] => {
  return offeringObtainiumTimeModifiers(time, timeMultCheck).concat([
    {
      i18n: 'NoAchievement177',
      stat: () =>
        player.achievements[177] === 0
          ? Math.min(
            1000,
            Math.max(1, player.antSacrificeTimer / resetTimeThreshold())
          )
          : 1
    }
  ])
}

const LOADED_STATS_HTMLS = {
  challenge15: false
}

const associated = new Map<string, string>([
  ['kMisc', 'miscStats'],
  ['kFreeAccel', 'acceleratorStats'],
  ['kFreeMult', 'multiplierStats'],
  ['kBaseOffering', 'baseOfferingStats'],
  ['kOfferingMult', 'offeringMultiplierStats'],
  ['kBaseObtainium', 'baseObtainiumStats'],
  ['kObtIgnoreDR', 'obtainiumIgnoreDRCapStats'],
  ['kObtMult', 'obtainiumMultiplierStats'],
  ['kGlobalCubeMult', 'globalCubeMultiplierStats'],
  ['kAntSacrificeMult', 'antSacrificeMultStats'],
  ['kQuarkMult', 'globalQuarkMultiplierStats'],
  ['kGSpeedMult', 'globalSpeedMultiplierStats'],
  ['kCubeMult', 'cubeMultiplierStats'],
  ['kTessMult', 'tesseractMultiplierStats'],
  ['kHypercubeMult', 'hypercubeMultiplierStats'],
  ['kPlatMult', 'platonicMultiplierStats'],
  ['kHeptMult', 'hepteractMultiplierStats'],
  ['kOrbPowderMult', 'powderMultiplierStats'],
  ['kOctMult', 'octeractMultiplierStats'],
  ['kASCMult', 'ascensionSpeedMultiplierStats'],
  ['kGQMult', 'goldenQuarkMultiplierStats'],
  ['kAddStats', 'addCodeStats'],
  ['kAmbrosiaLuck', 'ambrosiaLuckStats'],
  ['kAmbrosiaGenMult', 'ambrosiaGenerationStats']
])

export const displayStats = (btn: HTMLElement) => {
  for (const e of Array.from(btn.parentElement!.children) as HTMLElement[]) {
    const statsEl = DOMCacheGetOrSet(associated.get(e.id)!)
    if (e.id !== btn.id) {
      e.style.backgroundColor = ''
      statsEl.style.display = 'none'
      statsEl.classList.remove('activeStats')
    } else {
      e.style.backgroundColor = 'crimson'
      statsEl.style.display = 'block'
      statsEl.classList.add('activeStats')
    }
  }
}

export const loadStatisticsUpdate = () => {
  const activeStats = document.getElementsByClassName(
    'activeStats'
  ) as HTMLCollectionOf<HTMLElement>
  for (let i = 0; i < activeStats.length; i++) {
    switch (activeStats[i].id) {
      case 'miscStats':
        loadStatisticsMiscellaneous()
        break
      case 'acceleratorStats':
        loadStatisticsAccelerator()
        break
      case 'multiplierStats':
        loadStatisticsMultiplier()
        break
      case 'baseOfferingStats':
        loadStatisticsOfferingBase()
        break
      case 'offeringMultiplierStats':
        loadStatisticsOfferingMultipliers()
        break
      case 'baseObtainiumStats':
        loadStatisticsObtainiumBase()
        break
      case 'obtainiumIgnoreDRCapStats':
        loadStatisticsObtainiumIgnoreDR()
        break
      case 'obtainiumMultiplierStats':
        loadStatisticsObtainiumMultipliers()
        break
      case 'globalQuarkMultiplierStats':
        loadQuarkMultiplier()
        break
      case 'globalSpeedMultiplierStats':
        loadGlobalSpeedMultiplier()
        break
      case 'antSacrificeMultStats':
        loadStatisticsAntSacrificeMult()
        break
      case 'powderMultiplierStats':
        loadPowderMultiplier()
        break
      case 'ascensionSpeedMultiplierStats':
        loadStatisticsAscensionSpeedMultipliers()
        break
      case 'goldenQuarkMultiplierStats':
        loadStatisticsGoldenQuarkMultipliers()
        break
      case 'addCodeStats':
        loadAddCodeModifiersAndEffects()
        break
      case 'ambrosiaLuckStats':
        loadStatisticsAmbrosiaLuck()
        break
      case 'ambrosiaGenerationStats':
        loadStatisticsAmbrosiaGeneration()
        break
      case 'globalCubeMultiplierStats':
        loadGlobalCubeMultiplierStats()
        break
      case 'cubeMultiplierStats':
        loadWowCubeMultiplierStats()
        break
      case 'tesseractMultiplierStats':
        loadTesseractMultiplierStats()
        break
      case 'hypercubeMultiplierStats':
        loadHypercubeMultiplierStats()
        break
      case 'platonicMultiplierStats':
        loadPlatonicMultiplierStats()
        break
      case 'hepteractMultiplierStats':
        loadHepteractMultiplierStats()
        break
      case 'octeractMultiplierStats':
        loadOcteractMultiplierStats()
        break
    }
  }
}

export const loadStatistics = (
  statsObj: StatLine[],
  parentDiv: string,
  statLinePrefix: string,
  specificClass: string,
  calcTotalFunc: () => number | Decimal,
  summativeName = 'Total'
) => {
  const parent = DOMCacheGetOrSet(parentDiv)
  const numStatLines = document.getElementsByClassName(specificClass).length

  for (const obj of statsObj) {
    const key = obj.i18n
    const statHTMLName = statLinePrefix + key
    const statNumHTMLName = `${statLinePrefix}N${key}`
    if (numStatLines === 0) {
      const statLine = document.createElement('p')
      statLine.id = statHTMLName
      statLine.className = 'statPortion'
      statLine.classList.add(specificClass)
      statLine.style.color = obj.color ?? 'white'
      statLine.textContent = i18next.t(`statistics.${parentDiv}.${key}`)

      const statNum = document.createElement('span')
      statNum.id = statNumHTMLName
      statNum.className = 'statNumber'

      statLine.appendChild(statNum)
      parent.appendChild(statLine)
    }

    const statNumber = DOMCacheGetOrSet(statNumHTMLName)

    const accuracy = obj.acc ?? 2
    const num = obj.stat()

    statNumber.textContent = `${format(num, accuracy, true)}`
  }

  const statTotalHTMLName = `${statLinePrefix}T`
  const statNumTotalHTMLName = `${statLinePrefix}NT`

  if (numStatLines === 0) {
    const statTotal = document.createElement('p')
    statTotal.id = statTotalHTMLName
    statTotal.className = 'statPortion'
    statTotal.classList.add('statTotal')
    statTotal.textContent = i18next.t(`statistics.${parentDiv}.${summativeName}`)

    const statTotalNum = document.createElement('span')
    statTotalNum.id = statNumTotalHTMLName
    statTotalNum.className = 'statNumber'

    statTotal.appendChild(statTotalNum)
    parent.appendChild(statTotal)
  }

  const statTotalNumber = DOMCacheGetOrSet(statNumTotalHTMLName)
  const total = calcTotalFunc()
  statTotalNumber.textContent = `${format(total, 3, true)}`
}

export const loadStatisticsMiscellaneous = () => {
  DOMCacheGetOrSet('sMisc1').textContent = format(
    player.prestigeCount,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc2').textContent = `${
    format(
      1000 * player.fastestprestige
    )
  }ms`
  DOMCacheGetOrSet('sMisc3').textContent = format(player.maxofferings)
  DOMCacheGetOrSet('sMisc4').textContent = format(G.runeSum)
  DOMCacheGetOrSet('sMisc5').textContent = format(
    player.transcendCount,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc6').textContent = `${
    format(
      1000 * player.fastesttranscend
    )
  }ms`
  DOMCacheGetOrSet('sMisc7').textContent = format(
    player.reincarnationCount,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc8').textContent = `${
    format(
      1000 * player.fastestreincarnate
    )
  }ms`
  DOMCacheGetOrSet('sMisc9').textContent = format(player.maxobtainium)
  DOMCacheGetOrSet('sMisc10').textContent = format(
    player.maxobtainiumpersecond,
    2,
    true
  )
  DOMCacheGetOrSet('sMisc11').textContent = format(
    player.obtainiumpersecond,
    2,
    true
  )
  DOMCacheGetOrSet('sMisc12').textContent = format(
    player.ascensionCount,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc13').textContent = format(
    player.quarksThisSingularity,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc14').textContent = format(
    player.totalQuarksEver + player.quarksThisSingularity,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc15').textContent = `${
    formatTimeShort(
      player.quarkstimer
    )
  } / ${formatTimeShort(90000 + 18000 * player.researches[195])}`
  DOMCacheGetOrSet('sMisc16').textContent = synergismStage(0)
}

export const loadStatisticsAccelerator = () => {
  DOMCacheGetOrSet('sA1').textContent = `+${
    format(
      G.freeUpgradeAccelerator,
      0,
      false
    )
  }`
  DOMCacheGetOrSet('sA2').textContent = `+${
    format(
      G.totalAcceleratorBoost
        * (4
          + 2 * player.researches[18]
          + 2 * player.researches[19]
          + 3 * player.researches[20]
          + G.cubeBonusMultiplier[1]),
      0,
      false
    )
  }`
  DOMCacheGetOrSet('sA3').textContent = `+${
    format(
      Math.floor(Math.pow((G.rune1level * G.effectiveLevelMult) / 10, 1.1)),
      0,
      true
    )
  }`
  DOMCacheGetOrSet('sA4').textContent = `x${
    format(
      1 + ((G.rune1level * 1) / 200) * G.effectiveLevelMult,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA5').textContent = `x${
    format(
      Math.pow(
        1.01,
        player.upgrades[21]
          + player.upgrades[22]
          + player.upgrades[23]
          + player.upgrades[24]
          + player.upgrades[25]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA6').textContent = `x${
    format(
      Math.pow(
        1.01,
        player.achievements[60]
          + player.achievements[61]
          + player.achievements[62]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA7').textContent = `x${
    format(
      1 + (1 / 5) * player.researches[1],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA8').textContent = `x${
    format(
      1
        + (1 / 20) * player.researches[6]
        + (1 / 25) * player.researches[7]
        + (1 / 40) * player.researches[8]
        + (3 / 200) * player.researches[9]
        + (1 / 200) * player.researches[10],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA9').textContent = `x${
    format(
      1 + (1 / 20) * player.researches[86],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA10').textContent = `x${
    format(
      (player.currentChallenge.transcension !== 0
          || player.currentChallenge.reincarnation !== 0)
        && player.upgrades[50] > 0.5
        ? 1.25
        : 1,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA11').textContent = `^${
    format(
      Math.min(
        1,
        (1 + player.platonicUpgrades[6] / 30)
          * G.viscosityPower[player.corruptions.used.viscosity]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA12').textContent = format(G.freeAccelerator, 0, true)
}

export const loadStatisticsMultiplier = () => {
  DOMCacheGetOrSet('sM1').textContent = `+${
    format(
      G.freeUpgradeMultiplier,
      0,
      true
    )
  }`
  DOMCacheGetOrSet('sM2').textContent = `+${
    format(
      (Math.floor(
        (Math.floor((G.rune2level / 10) * G.effectiveLevelMult)
          * Math.floor(10 + (G.rune2level / 10) * G.effectiveLevelMult))
          / 2
      )
        * 100)
        / 100,
      0,
      true
    )
  }`
  DOMCacheGetOrSet('sM3').textContent = `x${
    format(
      1 + (G.rune2level / 200) * G.effectiveLevelMult,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM4').textContent = `x${
    format(
      Math.pow(
        1.01,
        player.upgrades[21]
          + player.upgrades[22]
          + player.upgrades[23]
          + player.upgrades[24]
          + player.upgrades[25]
      )
        * (1 + (player.upgrades[34] * 3) / 100)
        * (1 + player.upgrades[34] * (2 / 103)),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM5').textContent = `x${
    format(
      Math.pow(
        1.01,
        player.achievements[57]
          + player.achievements[58]
          + player.achievements[59]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM6').textContent = `x${
    format(
      1 + (1 / 5) * player.researches[2],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM7').textContent = `x${
    format(
      1
        + (1 / 20) * player.researches[11]
        + (1 / 25) * player.researches[12]
        + (1 / 40) * player.researches[13]
        + (3 / 200) * player.researches[14]
        + (1 / 200) * player.researches[15],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM8').textContent = `x${
    format(
      1 + (1 / 20) * player.researches[87],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM9').textContent = `x${
    format(
      calculateSigmoidExponential(
        40,
        (((player.antUpgrades[4]! + G.bonusant5) / 1000) * 40) / 39
      ),
      2,
      true
    )
  }`
  DOMCacheGetOrSet('sM10').textContent = `x${
    format(
      G.cubeBonusMultiplier[2],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM11').textContent = `x${
    format(
      (player.currentChallenge.transcension !== 0
          || player.currentChallenge.reincarnation !== 0)
        && player.upgrades[50] > 0.5
        ? 1.25
        : 1,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM12').textContent = `^${
    format(
      Math.min(
        1,
        (1 + player.platonicUpgrades[6] / 30)
          * G.viscosityPower[player.corruptions.used.viscosity]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM13').textContent = format(G.freeMultiplier, 3, true)
}

export const loadQuarkMultiplier = () => {
  loadStatistics(allQuarkStats, 'globalQuarkMultiplierStats', 'sGQM', 'quarkStats', calculateQuarkMultiplier)
}

export const loadGlobalSpeedMultiplier = () => {
  const globalSpeedStats = calculateTimeAcceleration()

  const preDRlist = globalSpeedStats.preList
  for (let i = 0; i < preDRlist.length; i++) {
    DOMCacheGetOrSet(`sGSMa${i + 1}`).textContent = `x${
      format(
        preDRlist[i],
        3,
        true
      )
    }`
  }

  const drList = globalSpeedStats.drList
  for (let i = 0; i < drList.length; i++) {
    DOMCacheGetOrSet(`sGSMb${i + 1}`).textContent = `x${
      format(
        drList[i],
        3,
        true
      )
    }`
  }

  const postDRlist = globalSpeedStats.postList
  for (let i = 0; i < postDRlist.length; i++) {
    DOMCacheGetOrSet(`sGSMc${i + 1}`).textContent = `x${
      format(
        postDRlist[i],
        3,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sGSMT').textContent = format(globalSpeedStats.mult, 3)
}

export const loadGlobalCubeMultiplierStats = () => {
  loadStatistics(allCubeStats, 'globalCubeMultiplierStats', 'statGCM', 'GlobalCubeStat', calculateAllCubeMultiplier)
}

export const loadWowCubeMultiplierStats = () => {
  loadStatistics(allWowCubeStats, 'cubeMultiplierStats', 'statCM', 'WowCubeStat', calculateCubeMultiplier)
}

export const loadTesseractMultiplierStats = () => {
  loadStatistics(
    allTesseractStats,
    'tesseractMultiplierStats',
    'statTeM',
    'TesseractStat',
    calculateTesseractMultiplier
  )
}

export const loadHypercubeMultiplierStats = () => {
  loadStatistics(
    allHypercubeStats,
    'hypercubeMultiplierStats',
    'statHyM',
    'HypercubeStat',
    calculateHypercubeMultiplier
  )
}

export const loadPlatonicMultiplierStats = () => {
  loadStatistics(
    allPlatonicCubeStats,
    'platonicMultiplierStats',
    'statPlM',
    'PlatonicStat',
    calculatePlatonicMultiplier
  )
}

export const loadHepteractMultiplierStats = () => {
  loadStatistics(
    allHepteractCubeStats,
    'hepteractMultiplierStats',
    'statHeM',
    'HepteractCubeStat',
    calculateHepteractMultiplier
  )
}

export const loadOcteractMultiplierStats = () => {
  loadStatistics(
    allOcteractCubeStats,
    'octeractMultiplierStats',
    'statOcM',
    'OcteractCubeStat',
    calculateOcteractMultiplier
  )
}

export const loadStatisticsOfferingBase = () => {
  loadStatistics(allBaseOfferingStats, 'baseOfferingStats', 'statOffB', 'OfferingBaseStat', calculateBaseOfferings)
}

export const loadStatisticsOfferingMultipliers = () => {
  loadStatistics(allOfferingStats, 'offeringMultiplierStats', 'statOff', 'OfferingStat', calculateOfferingsDecimal)
  loadStatistics(
    offeringObtainiumTimeModifiers(player.prestigecounter, player.prestigeCount > 0),
    'offeringMultiplierStats',
    'statOff2',
    'OfferingStat2',
    calculateOfferings,
    'Total2'
  )
}

export const loadStatisticsObtainiumBase = () => {
  loadStatistics(allBaseObtainiumStats, 'baseObtainiumStats', 'statObtB', 'ObtainiumBaseStat', calculateBaseObtainium)
}

export const loadStatisticsObtainiumIgnoreDR = () => {
  loadStatistics(
    allObtainiumIgnoreDRCapStats,
    'obtainiumIgnoreDRCapStats',
    'statObtDR',
    'ObtainiumDRStat',
    calculateObtainiumDRIgnoreCap
  )
}

export const loadStatisticsObtainiumMultipliers = () => {
  loadStatistics(allObtainiumStats, 'obtainiumMultiplierStats', 'statObt', 'ObtainiumStat', calculateObtainiumDecimal)
  loadStatistics(
    obtainiumDR.concat(offeringObtainiumTimeModifiers(player.reincarnationcounter, player.reincarnationCount >= 5)),
    'obtainiumMultiplierStats',
    'statObt2',
    'ObtainiumStat2',
    calculateObtainium,
    'Total2'
  )
}

export const loadStatisticsAntSacrificeMult = () => {
  loadStatistics(
    antSacrificeRewardStats,
    'antSacrificeMultStats',
    'statASM',
    'AntSacrificeStat',
    calculateAntSacrificeMultipliers
  )
}

export const loadPowderMultiplier = () => {
  const arr0 = calculatePowderConversion().list
  const map0: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Base:' },
    2: { acc: 2, desc: 'Challenge 15 Bonus:' },
    3: { acc: 2, desc: 'Powder EX:' },
    4: { acc: 2, desc: 'Achievement 256:' },
    5: { acc: 2, desc: 'Achievement 257:' },
    6: { acc: 2, desc: 'Platonic Upgrade 16 [4x1]:' },
    7: { acc: 2, desc: 'Event:' }
  }
  for (let i = 0; i < arr0.length; i++) {
    const statGCMi = DOMCacheGetOrSet(`statPoM${i + 1}`)
    statGCMi.childNodes[0].textContent = map0[i + 1].desc
    DOMCacheGetOrSet(`sPoM${i + 1}`).textContent = `x${
      format(
        arr0[i],
        map0[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sPoMT').textContent = `x${
    format(
      calculatePowderConversion().mult,
      3
    )
  }`
}

export const loadStatisticsAscensionSpeedMultipliers = () => {
  const arr = calculateAscensionSpeedMultiplier()
  const map7: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Chronometer:' },
    2: { acc: 2, desc: 'Chronometer 2:' },
    3: { acc: 2, desc: 'Chronometer 3:' },
    4: { acc: 2, desc: 'Chronos Hepteract:' },
    5: { acc: 2, desc: 'Achievement 262 Bonus:' },
    6: { acc: 2, desc: 'Achievement 263 Bonus:' },
    7: { acc: 2, desc: 'Platonic Omega:' },
    8: { acc: 2, desc: 'Challenge 15 Reward:' },
    9: { acc: 2, desc: 'Cookie Upgrade 9:' },
    10: { acc: 2, desc: 'Intermediate Pack:' },
    11: { acc: 2, desc: 'Chronometer Z:' },
    12: { acc: 2, desc: 'Abstract Photokinetics:' },
    13: { acc: 2, desc: 'Abstract Exokinetics:' },
    14: { acc: 2, desc: 'Event:' },
    15: { acc: 2, desc: 'Ascension Speedup 2 [GQ]:' },
    16: { acc: 2, desc: 'Chronometer INF:' },
    17: { acc: 2, desc: 'Limited Ascensions Penalty:' },
    18: { acc: 2, desc: 'Limited Ascensions Reward:' },
    19: { acc: 2, desc: 'Ascension Speedup [GQ]:' },
    20: { acc: 2, desc: 'Singularity Penalty:' },
    21: { acc: 2, desc: 'EXALT 6: The Great Singularity Speedrun:' },
    22: { acc: 2, desc: 'Shop Chronometer S:' }
  }
  for (let i = 0; i < arr.list.length; i++) {
    const statASMi = DOMCacheGetOrSet(`statASM${i + 1}`)
    statASMi.childNodes[0].textContent = map7[i + 1].desc
    DOMCacheGetOrSet(`sASM${i + 1}`).textContent = `x${
      format(
        arr.list[i],
        map7[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sASMT').textContent = `x${format(arr.mult, 3)}`
}

export const loadStatisticsGoldenQuarkMultipliers = () => {
  const arr = calculateGoldenQuarkMultiplier()
  const map: Record<number, { acc: number; desc: string; color?: string }> = {
    1: { acc: 2, desc: 'PseudoCoin Bonus:', color: 'gold' },
    2: { acc: 3, desc: 'Campaign: Golden Quark Bonus:' },
    3: { acc: 2, desc: 'Challenge 15 Exponent:' },
    4: { acc: 2, desc: 'Patreon Bonus:' },
    5: { acc: 2, desc: 'Golden Quarks I:' },
    6: { acc: 2, desc: 'Cookie Upgrade 19:' },
    7: { acc: 2, desc: 'No Singularity Upgrades:' },
    8: { acc: 2, desc: 'Event:' },
    9: { acc: 2, desc: 'Singularity Fast Forwards:' },
    10: { acc: 2, desc: 'Golden Revolution II:' },
    11: { acc: 2, desc: 'Immaculate Alchemy:' },
    12: { acc: 2, desc: 'Total Quarks Coefficient:' }
  }
  for (let i = 0; i < arr.list.length; i++) {
    const statGQMi = DOMCacheGetOrSet(`statGQMS${i + 1}`)
    if (map[i + 1].color) {
      statGQMi.style.color = map[i + 1].color ?? 'white'
    }
    statGQMi.childNodes[0].textContent = map[i + 1].desc
    DOMCacheGetOrSet(`sGQMS${i + 1}`).textContent = `x${
      format(
        arr.list[i],
        map[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sGQMST').textContent = `x${format(arr.mult, 3)}`
}

export const loadAddCodeModifiersAndEffects = () => {
  const intervalStats = addCodeInterval()
  const capacityStats = addCodeMaxUses()
  const availableCount = addCodeAvailableUses()
  const timeToNext = addCodeTimeToNextUse()

  // Add interval stats
  const intervalMap: Record<number, { acc: number; desc: string }> = {
    1: { acc: 0, desc: 'Base:' },
    2: { acc: 2, desc: 'PL-AT δ calculator:' },
    3: { acc: 2, desc: 'PL-AT Σ sing perk:' },
    4: { acc: 2, desc: 'Ascension of Ant God:' },
    5: { acc: 2, desc: 'Singularity factor:' }
  }
  intervalStats.list[0] /= 1000 // is originally in milliseconds, but players will expect it in seconds.

  for (let i = 0; i < intervalStats.list.length; i++) {
    const statAddIntervalI = DOMCacheGetOrSet(`stat+time${i + 1}`)
    statAddIntervalI.childNodes[0].textContent = intervalMap[i + 1].desc
    if (i === 0) {
      DOMCacheGetOrSet(`s+time${i + 1}`).textContent = `${
        format(
          intervalStats.list[i],
          intervalMap[i + 1].acc,
          true
        )
      } sec`
    } else {
      DOMCacheGetOrSet(`s+time${i + 1}`).textContent = `x${
        format(
          intervalStats.list[i],
          intervalMap[i + 1].acc,
          true
        )
      }`
    }
  }

  DOMCacheGetOrSet('s+timeT').textContent = `${
    format(
      intervalStats.time / 1000,
      1
    )
  } sec`
  if (availableCount !== capacityStats.total) {
    DOMCacheGetOrSet('s+next').textContent = `+1 in ${
      format(
        timeToNext,
        1
      )
    } sec` // is already in sec.
  } else {
    DOMCacheGetOrSet('s+next').textContent = ''
  }

  // Add capacity stats
  const capacityMap: Record<number, { acc: number; desc: string; color?: string }> = {
    1: { acc: 0, desc: 'Base:' },
    2: { acc: 0, desc: 'PL-AT X:' },
    3: { acc: 0, desc: 'PL-AT δ:' },
    4: { acc: 0, desc: 'PL-AT Γ:' },
    5: { acc: 0, desc: 'PL-AT _:' },
    6: { acc: 0, desc: 'PL-AT ΩΩ' },
    7: { acc: 3, desc: 'Singularity factor:' },
    8: { acc: 0, desc: 'Plat-P:', color: 'gold' }
  }

  for (let i = 0; i < capacityStats.list.length; i++) {
    const statAddIntervalI = DOMCacheGetOrSet(`stat+cap${i + 1}`)
    if (capacityMap[i + 1].color) {
      statAddIntervalI.style.color = capacityMap[i + 1].color ?? 'white'
    }
    statAddIntervalI.childNodes[0].textContent = capacityMap[i + 1].desc
    const prefix = i === 0 ? '' : (i === 5 || i === 7) ? 'x' : '+'
    DOMCacheGetOrSet(`s+cap${i + 1}`).textContent = `${prefix}${
      format(
        capacityStats.list[i],
        capacityMap[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('s+capT').textContent = `${
    format(
      availableCount,
      0
    )
  } / ${format(capacityStats.total, 0)}`

  // TODO:  we also want to report on the effects of each add.
  const addEffectStats = addCodeBonuses()

  // Quark Bonus Rate; the bonus is typically applied when actually given to the player, rather than calculated before.
  const qbr = player.worlds.applyBonus(1)

  DOMCacheGetOrSet('stat+eff1').childNodes[0].textContent = 'Quarks: '
  if (Math.abs(addEffectStats.maxQuarks - addEffectStats.minQuarks) >= 0.5) {
    // b/c floating-point errors
    DOMCacheGetOrSet('s+eff1').textContent = `+${
      format(
        qbr * addEffectStats.minQuarks,
        3
      )
    } ~ ${format(qbr * addEffectStats.maxQuarks, 3)}`
  } else {
    DOMCacheGetOrSet('s+eff1').textContent = `+${
      format(
        qbr * addEffectStats.quarks,
        3
      )
    }`
  }

  DOMCacheGetOrSet('stat+eff2').childNodes[0].textContent = 'PL-AT X - bonus ascension time: '
  DOMCacheGetOrSet('s+eff2').textContent = `+${
    format(
      addEffectStats.ascensionTimer,
      2
    )
  } sec`

  DOMCacheGetOrSet('stat+eff3').childNodes[0].textContent = 'PL-AT Γ - bonus GQ export time: '
  DOMCacheGetOrSet('s+eff3').textContent = `+${
    format(
      addEffectStats.gqTimer,
      2
    )
  } sec` // does it need a / 1000?

  DOMCacheGetOrSet('stat+eff4').childNodes[0].textContent = 'PL-AT _ - bonus octeract time: '
  DOMCacheGetOrSet('s+eff4').textContent = `+${
    format(
      addEffectStats.octeractTime,
      2
    )
  } sec` // does it need a / 1000?
  // Might be worth converting to raw octeracts awarded.  I don't have the calculator needed to test it, though.
}

export const loadStatisticsAmbrosiaLuck = () => {
  const stats = calculateAmbrosiaLuck()
  const arr = stats.array
  const map: Record<number, { acc: number; desc: string; color?: string }> = {
    1: { acc: 0, desc: 'Base Value' },
    2: { acc: 0, desc: 'PseudoCoin Upgrade', color: 'gold' },
    3: { acc: 2, desc: 'Campaign Bonus: Ambrosia Luck' },
    4: { acc: 0, desc: 'Irish Ants Singularity Perk' },
    5: { acc: 1, desc: 'Shop Upgrade Bonus' },
    6: { acc: 0, desc: 'Singularity Ambrosia Luck Upgrades' },
    7: { acc: 0, desc: 'Octeract Ambrosia Luck Upgrades' },
    8: { acc: 0, desc: 'Ambrosia Luck Module I' },
    9: { acc: 1, desc: 'Ambrosia Luck Module II' },
    10: { acc: 2, desc: 'Ambrosia Cube-Luck Hybrid Module I' },
    11: { acc: 2, desc: 'Ambrosia Quark-Luck Hybrid Module I' },
    12: { acc: 0, desc: 'Primal Power: One Hundred Thirty One!' },
    13: { acc: 0, desc: 'Primal Power: Two Hundred Sixty Nine!' },
    14: { acc: 0, desc: 'Shop: Octeract-Based Ambrosia Luck' },
    15: { acc: 0, desc: 'No Ambrosia Upgrades EXALT' },
    16: { acc: 0, desc: 'Cube Upgrade Cx27' },
    17: { acc: 0, desc: 'Red Bar Fills with Cx29' },
    18: { acc: 0, desc: 'ULTRA Upgrade: Ambrosia Exalter' }
  }
  for (let i = 0; i < arr.length - 1; i++) {
    const statALuckMi = DOMCacheGetOrSet(`statALuckM${i + 1}`)
    statALuckMi.childNodes[0].textContent = map[i + 1].desc
    if (map[i + 1].color) {
      statALuckMi.style.color = map[i + 1].color ?? 'white'
    }
    DOMCacheGetOrSet(`sALuckM${i + 1}`).textContent = `+${
      format(
        arr[i],
        map[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sALuckMult').textContent = `x${format(arr[arr.length - 1], 3, true)}`

  const totalVal = Math.floor(stats.value)
  DOMCacheGetOrSet('sALuckMT').innerHTML = `&#9752 ${format(totalVal, 0)}`
}

export const loadStatisticsAmbrosiaGeneration = () => {
  const stats = calculateAmbrosiaGenerationSpeed()
  const arr = stats.array
  const map: Record<number, { acc: number; desc: string; color?: string }> = {
    1: { acc: 4, desc: 'Visited Ambrosia Subtab' },
    2: { acc: 4, desc: 'PseudoCoin Upgrade', color: 'gold' },
    3: { acc: 4, desc: 'Campaign Bonus: Ambrosia Generation' },
    4: { acc: 4, desc: 'Number of Blueberries' },
    5: { acc: 4, desc: 'Shop Upgrade Bonus' },
    6: { acc: 4, desc: 'Singularity Ambrosia Generation Upgrades' },
    7: { acc: 4, desc: 'Octeract Ambrosia Generation Upgrades' },
    8: { acc: 4, desc: 'Patreon Bonus' },
    9: { acc: 4, desc: 'One Ascension Challenge EXALT' },
    10: { acc: 4, desc: 'No Ambrosia Upgrades EXALT' },
    11: { acc: 4, desc: 'Cube Upgrade Cx26' },
    12: { acc: 4, desc: 'Cash-Grab ULTIMATE' },
    13: { acc: 4, desc: 'Event Bonus' }
  }
  for (let i = 0; i < arr.length; i++) {
    const statAGenMi = DOMCacheGetOrSet(`statAGenM${i + 1}`)
    statAGenMi.childNodes[0].textContent = map[i + 1].desc
    if (map[i + 1].color) {
      statAGenMi.style.color = map[i + 1].color ?? 'white'
    }
    DOMCacheGetOrSet(`sAGenM${i + 1}`).textContent = `x${format(arr[i], map[i + 1].acc, true)}`
  }

  const totalVal = stats.value
  DOMCacheGetOrSet('sAGenMT').textContent = `${format(totalVal, 3, true)}`
}

export const c15RewardUpdate = () => {
  type Key = keyof GlobalVariables['challenge15Rewards']
  const e = player.challenge15Exponent

  for (const [k, v] of Object.entries(G.challenge15Rewards)) {
    const key = k as Key
    // Reset values
    v.value = v.baseValue

    if (e >= v.requirement) {
      v.value = G.c15RewardFormulae[key](e)
    }
  }

  if (G.challenge15Rewards.challengeHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.challenge.unlock('the Hepteract of Challenge')
  }
  if (G.challenge15Rewards.abyssHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.abyss.unlock('the Hepteract of the Abyss')
  }
  if (G.challenge15Rewards.acceleratorHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.accelerator.unlock('the Hepteract of Way Too Many Accelerators')
  }
  if (G.challenge15Rewards.acceleratorBoostHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.acceleratorBoost.unlock('the Hepteract of Way Too Many Accelerator Boosts')
  }
  if (G.challenge15Rewards.multiplierHepteractUnlocked.value > 0) {
    void player.hepteractCrafts.multiplier.unlock('the Hepteract of Way Too Many Multipliers')
  }

  updateDisplayC15Rewards()
}

const updateDisplayC15Rewards = () => {
  DOMCacheGetOrSet('c15Reward0').innerHTML = i18next.t('wowCubes.platonicUpgrades.c15Rewards.0', {
    exponent: format(player.challenge15Exponent, 3, true)
  })
  DOMCacheGetOrSet('c15RequiredExponent').innerHTML = i18next.t(
    'wowCubes.platonicUpgrades.c15Rewards.requiredExponent',
    {
      coins: format(Decimal.pow(10, player.challenge15Exponent / challenge15ScoreMultiplier()), 0, true)
    }
  )

  const rewardDiv = DOMCacheGetOrSet('c15Rewards')
  let lowestMissingExponent = Number.MAX_VALUE
  for (const [k, v] of Object.entries(G.challenge15Rewards)) {
    const key = k as Challenge15Rewards
    const value = v.value
    const requirement = v.requirement

    if (!LOADED_STATS_HTMLS.challenge15) {
      const elm = document.createElement('p')
      elm.id = `c15Reward${key}`
      elm.className = 'challengePortion'

      if (v.HTMLColor !== undefined) {
        elm.style.color = v.HTMLColor
      }

      rewardDiv.appendChild(elm)
    }

    const elm = DOMCacheGetOrSet(`c15Reward${key}`)
    if (player.challenge15Exponent >= requirement) {
      elm.style.display = player.challenge15Exponent >= requirement ? 'block' : 'none'
      if (typeof value === 'number') {
        elm.innerHTML = i18next.t(`wowCubes.platonicUpgrades.c15Rewards.${key}`, {
          amount: formatAsPercentIncrease(value, 2)
        })
      } else {
        // Do not pass boolean value (all texts will say 'Unlocked' as you cannot see rewards not yet earned)
        elm.textContent = i18next.t(`wowCubes.platonicUpgrades.c15Rewards.${key}`)
      }
    } else {
      elm.style.display = 'none'
      if (requirement < lowestMissingExponent) {
        lowestMissingExponent = requirement
      }
    }
  }

  if (lowestMissingExponent < Number.MAX_VALUE) {
    DOMCacheGetOrSet('c15NextReward').innerHTML = i18next.t(
      'wowCubes.platonicUpgrades.c15Rewards.nextReward',
      { exponent: format(lowestMissingExponent, 0, true) }
    )
  } else {
    DOMCacheGetOrSet('c15NextReward').innerHTML = i18next.t('wowCubes.platonicUpgrades.c15Rewards.allUnlocked')
  }
  LOADED_STATS_HTMLS.challenge15 = true
}

interface Stage {
  stage: number
  tier: number
  name: string
  unlocked: boolean
  reset: boolean
}

export const gameStages = (): Stage[] => {
  const stages: Stage[] = [
    { stage: 0, tier: 1, name: 'start', unlocked: true, reset: true },
    {
      stage: 1,
      tier: 1,
      name: 'start-prestige',
      unlocked: player.unlocks.prestige,
      reset: player.unlocks.prestige
    },
    {
      stage: 2,
      tier: 2,
      name: 'prestige-transcend',
      unlocked: player.unlocks.transcend,
      reset: player.unlocks.transcend
    },
    {
      stage: 3,
      tier: 3,
      name: 'transcend-reincarnate',
      unlocked: player.unlocks.reincarnate,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 4,
      tier: 4,
      name: 'reincarnate-ant',
      unlocked: player.firstOwnedAnts !== 0,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 5,
      tier: 4,
      name: 'ant-sacrifice',
      unlocked: player.achievements[173] === 1,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 6,
      tier: 4,
      name: 'sacrifice-ascension',
      unlocked: player.achievements[183] === 1,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 7,
      tier: 5,
      name: 'ascension-challenge10',
      unlocked: player.ascensionCount > 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 8,
      tier: 5,
      name: 'challenge10-challenge11',
      unlocked: player.achievements[197] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 9,
      tier: 5,
      name: 'challenge11-challenge12',
      unlocked: player.achievements[204] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 10,
      tier: 5,
      name: 'challenge12-challenge13',
      unlocked: player.achievements[211] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 11,
      tier: 5,
      name: 'challenge13-challenge14',
      unlocked: player.achievements[218] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 12,
      tier: 5,
      name: 'challenge14-w5x10max',
      unlocked: player.cubeUpgrades[50] >= 100000,
      reset: player.achievements[183] === 1
    },
    {
      stage: 13,
      tier: 5,
      name: 'w5x10max-alpha',
      unlocked: player.platonicUpgrades[5] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 14,
      tier: 5,
      name: 'alpha-p2x1x10',
      unlocked: player.platonicUpgrades[6] >= 10,
      reset: player.achievements[183] === 1
    },
    {
      stage: 15,
      tier: 5,
      name: 'p2x1x10-p3x1',
      unlocked: player.platonicUpgrades[11] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 16,
      tier: 5,
      name: 'p3x1-beta',
      unlocked: player.platonicUpgrades[10] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 17,
      tier: 5,
      name: 'beta-1e15-expo',
      unlocked: player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement,
      reset: player.achievements[183] === 1
    },
    {
      stage: 18,
      tier: 5,
      name: '1e15-expo-omega',
      unlocked: player.platonicUpgrades[15] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 19,
      tier: 5,
      name: 'omega-singularity',
      unlocked: player.singularityCount > 0 && player.runelevels[6] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 20,
      tier: 6,
      name: 'singularity-exalt1x1',
      unlocked: player.singularityChallenges.noSingularityUpgrades.completions > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 21,
      tier: 6,
      name: 'exalt1x1-onemind',
      unlocked: player.singularityUpgrades.oneMind.level > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 22,
      tier: 6,
      name: 'onemind-end',
      unlocked: player.singularityUpgrades.offeringAutomatic.level > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 23,
      tier: 6,
      name: 'end-pen',
      unlocked: player.singularityUpgrades.ultimatePen.level > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 24,
      tier: 6,
      name: 'pen',
      unlocked: false,
      reset: player.highestSingularityCount > 0
    }
  ]
  return stages
}

// Calculate which progress in the game you are playing
// The progress displayed is based on Progression Chat and Questions
// This will be used to determine the behavior of the profile of the autopilot function in the future
export const synergismStage = (
  skipTier = player.singularityCount > 0 ? 5 : 0
): string => {
  const stages = gameStages()
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i]
    if (skipTier < stage.tier && (!stage.reset || !stage.unlocked)) {
      return stage.name
    }
  }
  const stagesZero = stages[0]
  return stagesZero.name
}
