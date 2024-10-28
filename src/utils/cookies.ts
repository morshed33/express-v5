import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env"
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date"

export const REFRESH_PATH = "/auth/refresh"
const secure = NODE_ENV !== "development"

const defaults: CookieOptions = {
  sameSite: secure ? "none" : "strict", 
  httpOnly: true,
  secure,
}

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
})

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH,
})

interface Params {
  res: Response
  accessToken: string
  refreshToken: string
}
export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", { path: REFRESH_PATH }); // Ensure same path for clearing
