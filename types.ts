import { Router } from 'express'
import ZuraaaApi from './modules/api'

export type RouteFunction = (modules: {
  api: ZuraaaApi
}) => Router

export const colors = [
  'red',
  'darkorange',
  'orange',
  'yellow',
  'yellowgreen',
  'green',
  'seagreen',
  'dodgerblue',
  'blue',
  'indigo',
  'purple',
  'darkmagenta',
  'darkviolet',
  'violet',
  'pink'
] as const
