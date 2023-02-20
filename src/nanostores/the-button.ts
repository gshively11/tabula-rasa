import { atom } from 'nanostores'

export interface Click {
  timestamp: number
}

export interface Leader {
  clickCount: number
  username: string
}

export const userScore = atom<number>(0)

export const clicks = atom<Click[]>([])

export const isAdmin = atom<boolean>(false)

export const leaders = atom<Leader[]>([])

export const loggedIn = atom<boolean>(false)
