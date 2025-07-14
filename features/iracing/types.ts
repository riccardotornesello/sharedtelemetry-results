import { Timestamp } from "firebase-admin/firestore"

export interface IRacingSessionDocument {
  parsed: boolean

  leagueId: number
  seasonId: number
  launchAt: Timestamp

  simsessions: IRacingSimSession[]
}

export interface IRacingSimSession {
  simsessionNumber: number
  simsessionType: number
  simsessionName: string

  participants: IRacingParticipant[]
}

export interface IRacingParticipant {
  custId: number
  carId: number

  laps: IRacingLap[]
}

export interface IRacingLap {
  lapEvents: string[]
  incident: boolean
  lapTime: number
  lapNumber: number
}
