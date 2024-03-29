import { ArgumentParser, SUPPRESS } from 'argparse'
import { Types, API } from 'codeforces-sdk'
import Table from 'cli-table'
import clc from 'cli-color'

export const multipleStandings = async (options: Omit<API.contest.StandingsOptions, 'contestId'>, ...contestIds: Array<string>) => {
    for (const contestId of contestIds) {
        const {s, table} = await standings({...options, contestId: contestId as unknown as Types.ContestId})
        console.log(s.contest.toString())
        console.log(table.toString())
        console.log(s.contest.getLink())
    }
}

export const standings = async (options: API.contest.StandingsOptions) => {
    const s = await API.contest.standings(options)
    const table = new Table({
        head: ['№', 'Handle', 'Pnlt', '#'].concat(...s.problems.map(p => p.toString())),
        colAligns: ['left', 'left', 'middle', 'middle', ...s.problems.map(p => 'middle')],
    })
    const handles = s.rows.flatMap(row => row.party.members.flatMap(member => member.handle))
    const users = await API.user.info({handles})
    const mp: Record<Types.Handle, Types.User> = {}
    users.forEach(user => mp[user.handle] = user)

    for (const row of s.rows) {
        table.push([
            row.rank,
            row.party.toString({withColor: true, userInfo: mp, noTeamName: true}),
            row.penalty,
            row.points,
            ...row.problemResults.map(p => p.toString({withTime: true, withColor: true}))
        ])
    }
    return {
        s, 
        table,
    }
}

export const standingsParser = (parser: ArgumentParser) => {
    parser.add_argument('contestIds', { help: 'Contest ids', nargs: '+' })
    parser.add_argument('-r', '--room', { type: 'int', default: SUPPRESS })
    parser.add_argument('-f', '--from', { type: 'int', default: SUPPRESS })
    parser.add_argument('-c', '--count', { type: 'int', default: SUPPRESS })
    parser.add_argument('-s', '--showUnofficial', { action: 'store_true', default: SUPPRESS })
    return async (args) => {
        const contestIds = args.contestIds
        delete args.contestIds
        multipleStandings(args, contestIds)
    }
}
