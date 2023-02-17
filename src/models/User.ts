import { prisma, User as UserModel } from '../prisma.js'
import { ExistingUserError } from '../errors.js'
import { hashPassword, comparePassword } from '../services/encryption.js'

export default class User {
  static exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    for (const key of keys) {
      delete user[key]
    }
    return user
  }

  static async usernameExists(username: string): Promise<boolean> {
    const existingIdentity = await prisma.identityAspect.findUnique({
      where: {
        type_value: { type: 'username', value: username },
      },
    })

    if (existingIdentity) {
      return true
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (existingUser) {
      return true
    }

    return false
  }

  static async create(username: string, password: string): Promise<User> {
    if (await User.usernameExists(username)) {
      throw new ExistingUserError(username)
    }

    const hash = await hashPassword(password)

    return new User(
      await prisma.user.create({
        data: {
          username,
          password: hash,
          identity: {
            create: {
              aspects: {
                create: {
                  type: 'username',
                  value: username,
                },
              },
            },
          },
        },
      })
    )
  }

  constructor(public model: UserModel) {}

  async checkPassword(password: string): Promise<boolean> {
    return await comparePassword(this.model.password, password)
  }
}
