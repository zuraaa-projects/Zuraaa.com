import 'express'

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}