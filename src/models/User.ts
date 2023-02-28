import { prisma, User as UserModel } from '../prisma.js'
import type { PrismaTypes } from '../prisma.js'
import { ExistingUserError } from '../errors.js'
import { hashPassword, comparePassword } from '../services/encryption.js'

export class User {
  static async exists(username: string): Promise<boolean> {
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
    if (await User.exists(username)) {
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

  static async findByUsername(
    username: string,
    relations?: PrismaTypes.UserInclude
  ): Promise<User | void> {
    const query: PrismaTypes.UserFindUniqueArgs = {
      where: {
        username,
        isDeleted: false,
      },
    }
    if (relations) {
      query.include = relations
    }
    const user = await prisma.user.findUnique(query)

    if (!user) {
      return
    }

    return new User(user)
  }

  static async findById(id: string, relations?: PrismaTypes.UserInclude): Promise<User | void> {
    const query: PrismaTypes.UserFindUniqueArgs = {
      where: {
        id,
        isDeleted: false,
      },
    }
    if (relations) {
      query.include = relations
    }
    const user = await prisma.user.findUnique(query)

    if (!user) {
      return
    }

    return new User(user)
  }

  static async deleteByUsername(username: string): Promise<void> {
    await prisma.user.update({
      where: {
        username,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      },
    })
  }

  constructor(public model: UserModel) {}

  async checkPassword(password: string): Promise<boolean> {
    return await comparePassword(password, this.model.password)
  }
}

export default User
