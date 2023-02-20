import { v4 as uuidv4 } from 'uuid'
import { prisma, UserClicks as UserClicksModel } from '../prisma.js'

export interface Click {
  timestamp: number
}

export interface ClicksValidation {
  valid: boolean
  reason?: string
}

export interface ClickLeader {
  username: string
  clickCount: number
}

export type LeaderChangeListener = (leaders: ClickLeader[]) => void

const leaderChangeListeners: LeaderChangeListener[] = []

export class UserClicks {
  static registerLeaderChangeListener(listener: LeaderChangeListener): void {
    leaderChangeListeners.push(listener)
  }

  static async leaderChange(clickCount?: number) {
    // calling this on every click update is expensive,
    // look into making this more efficient
    const leaders = await UserClicks.getLeaders()

    if (clickCount && leaders.length > 0 && clickCount >= leaders[leaders.length - 1].clickCount) {
      leaderChangeListeners.forEach((listener) => {
        listener(leaders)
      })
    }
  }

  static async getLeaders(): Promise<ClickLeader[]> {
    const leaders = await prisma.userClicks.findMany({
      orderBy: {
        clickCount: 'desc',
      },
      where: {
        user: {
          is: {
            isDeleted: false,
          },
        },
      },
      include: {
        user: true,
      },
      take: 10,
    })

    return leaders.map((leader) => ({
      username: leader.user.username,
      clickCount: leader.clickCount,
    }))
  }

  static async exists(userId: string): Promise<boolean> {
    const existingUserClicks = await UserClicks.findByUserId(userId)

    return !!existingUserClicks
  }

  static async getOrCreate(userId: string): Promise<UserClicks> {
    const existingUserClicks = await UserClicks.findByUserId(userId)

    if (existingUserClicks) {
      return existingUserClicks
    }

    return new UserClicks(
      await prisma.userClicks.create({
        data: {
          userId,
          clickCount: 0,
          // start with an empty string for nextToken, because the first click
          // submission will not have a token
          nextToken: '',
        },
      })
    )
  }

  static async findByUserId(userId: string): Promise<UserClicks | void> {
    const userClicks = await prisma.userClicks.findUnique({
      where: {
        userId,
      },
    })

    if (!userClicks) {
      return
    }

    return new UserClicks(userClicks)
  }

  static areClicksValid(clicks: Click[]): ClicksValidation {
    if (clicks.length === 0) {
      return {
        valid: false,
        reason: 'no clicks',
      }
    }

    if (clicks.length === 1) {
      return {
        valid: true,
      }
    }

    const startTimestamp = clicks[0].timestamp as number
    const endTimestamp = clicks[clicks.length - 1].timestamp as number
    const timeRange = endTimestamp - startTimestamp
    const clicksPerTenSeconds = (clicks.length / (timeRange / 1000)) * 10

    // more than 500 clicks in 10 seconds is probably a script
    if (clicksPerTenSeconds > 500) {
      return {
        valid: false,
        reason: 'too many',
      }
    }

    let previousTimestamp = startTimestamp
    const timeDiffs = new Set()

    for (let i = 1; i < clicks.length; i++) {
      const currentTimestamp = clicks[i].timestamp as number
      // clicks aren't in ascending order
      if (currentTimestamp < previousTimestamp) {
        return {
          valid: false,
          reason: 'out of order',
        }
      }
      const timeDiff = currentTimestamp - previousTimestamp
      // clicking too fast
      if (timeDiff < 50) {
        return {
          valid: false,
          reason: 'too fast',
        }
      }
      timeDiffs.add(timeDiff)
      previousTimestamp = currentTimestamp
    }

    // if more than 70% of the clicks have the same time diff
    // then it's probably a script
    if (timeDiffs.size / clicks.length < 0.3) {
      return {
        valid: false,
        reason: 'too regular',
      }
    }

    return { valid: true }
  }

  constructor(public model: UserClicksModel) {}

  async addClicks(clicks: Click[], token: string): Promise<ClicksValidation> {
    if (this.model.nextToken !== token) {
      return {
        valid: false,
        reason: 'token mismatch',
      }
    }

    const validation = UserClicks.areClicksValid(clicks)

    if (!validation.valid) {
      return validation
    }

    const newClickCount = this.model.clickCount + clicks.length

    this.model = await prisma.userClicks.update({
      where: {
        userId: this.model.userId,
      },
      data: {
        clickCount: newClickCount,
        nextToken: uuidv4(),
      },
    })

    UserClicks.leaderChange(newClickCount)

    return validation
  }
}

export default UserClicks
