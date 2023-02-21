import { Types, API, init } from 'codeforces-sdk'
import { multipleStandings } from './standings'
import { userInfo } from './userInfo'
import { maxWrongTest } from './maxWrongTest'

const args = process.argv.slice(2)
//multipleStandings({from: 1, count: 40, showUnofficial: true}, ...args)
//userInfo(args[0] as Types.Handle)
maxWrongTest(args[0] as Types.Handle)
