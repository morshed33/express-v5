/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken"
import Audience from "../constants/audience"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env"
import { UserDocument } from "../app/models/user.model"
import { SessionDocument } from "../app/models/session.model"

export interface RefreshTokenPayload {
  sessionId: SessionDocument["_id"]
}

export interface AccessTokenPayload {
  userId: UserDocument["_id"]
  sessionId: SessionDocument["_id"]
}

type SignOptionsAndSecret = SignOptions & {
  secret: string
}

const defaults: SignOptions = {
  audience: [Audience.User],
}

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
}

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
}

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret,
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  })
}

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & {
    secret?: string
  },
): { payload?: TPayload; error?: string } => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {}
  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    }) as TPayload
    return {
      payload,
    }
  } catch (error: any) {
    return {
      error: error.message,
    }
  }
}