import type { Response, NextFunction } from 'express'
import { expressjwt } from 'express-jwt'
import type { Request } from 'express-jwt'
import jwt from 'jsonwebtoken'
import type { Algorithm } from 'jsonwebtoken'
import cookie from 'cookie'
import type { TokenGetter } from 'express-jwt'
import { User } from '../models/User.js'
import type { Socket } from 'socket.io'

export type AuthenticatedRequest = Request<jwt.JwtPayload> & { user?: User }

const sevenDays = 1000 * 60 * 60 * 24 * 7
const jwtCookie = 'tr_jwt'
const usernameCookie = 'tr_un'

let JWT_SECRET: string

if (process.env.JWT_SECRET === undefined) {
  throw new Error('JWT_SECRET env var must be set')
} else {
  JWT_SECRET = process.env.JWT_SECRET
}

const audience = 'https://ihopethis.works/api'
const issuer = 'https://ihopethis.works'
const algorithms: Algorithm[] = ['HS256']

const getToken: TokenGetter = (req: Request) => {
  return req.cookies[jwtCookie]
}

function signJwt(subject: string): string {
  return jwt.sign({}, JWT_SECRET, {
    subject,
    audience,
    issuer,
    expiresIn: '7d',
  })
}

export const authentication = expressjwt({
  getToken: getToken,
  secret: process.env.JWT_SECRET,
  audience,
  issuer,
  algorithms,
})

export const ioAuthentication = async (socket: Socket, next: (err?: Error) => void) => {
  if (!socket?.handshake?.headers?.cookie) {
    return next()
  }

  const cookies = cookie.parse(socket.handshake.headers.cookie)
  const token = cookies[jwtCookie]

  if (!token) {
    return next()
  }

  if (!process.env.JWT_SECRET) {
    return next()
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, { algorithms, audience, issuer })

    if (!decodedToken) {
      return next()
    }

    socket.data.userId = decodedToken.sub
    next()
  } catch (err) {
    return next()
  }
}

export const userContext = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.auth) {
    return next()
  }

  const user = await User.findById(req.auth.payload.sub)

  if (!user) {
    return next()
  }

  req.user = user
  next()
}

export const login = async (res: Response, user: User, password: string): Promise<boolean> => {
  const match = await user.checkPassword(password)
  // if the passwords do not match, do not login the user
  if (!match) {
    return false
  }

  // the jwt cookie should not be accessible by js
  res.cookie(jwtCookie, signJwt(user.model.id), {
    maxAge: sevenDays,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })
  // the username cookie should be accessible by js
  res.cookie(usernameCookie, user.model.username, {
    maxAge: sevenDays,
    secure: true,
  })

  return true
}
