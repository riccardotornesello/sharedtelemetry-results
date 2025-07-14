import { IRacingLap } from "./types"

/**
 * This function extracts the average lap time from a list of laps about a single driver in a single session.
 * @param laps
 * @returns
 */
export function extractAverageLapTime(
  laps: IRacingLap[],
  stintLength: number
): number | null {
  let validLaps = 0
  let totalLapTime = 0

  for (const lap of laps) {
    if (isLapPitted(lap)) {
      // If the driver already started a stint, end it
      if (validLaps > 0) {
        return null
      } else {
        continue
      }
    }

    if (!isLapValid(lap)) {
      return null
    }

    validLaps++
    totalLapTime += lap.lapTime

    if (validLaps == stintLength) {
      return totalLapTime / stintLength / 10
    }
  }

  return null
}

export function isLapPitted(lap: IRacingLap): boolean {
  return lap.lapEvents.includes("pitted")
}

export function isLapValid(lap: IRacingLap): boolean {
  if (lap.lapNumber <= 0) {
    return false
  }

  if (lap.lapTime <= 0) {
    return false
  }

  if (lap.incident) {
    return false
  }

  if (lap.lapEvents.length > 0) {
    return false
  }

  return true
}
