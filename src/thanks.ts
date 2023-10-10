import { ArgumentParser } from 'argparse'
import { Types, API } from 'codeforces-sdk'
import fs from 'fs'

type Color = ReturnType<Types.User['getColor']>
type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
}
const ruColors: Record<Color, string> = {
    black: 'чёрное',
    blue: 'синее',
    cyan: 'бирюзовое',
    gray: 'серое',
    green: 'зелёное',
    orange: 'жёлтое',
    red: 'красное',
    violet: 'фиолетовое',
    legendary: 'красно-чёрное'
}
const enColors: PartialRecord<Color, string> = {
    violet: 'purple',
    legendary: 'red-black',
}

const colorOrder: Array<Color> = [ 'black', 'gray', 'cyan', 'green', 'blue', 'violet', 'orange', 'red', 'legendary' ]
colorOrder.reverse()

export const generateThanks = async (contestIds: Array<string>) => {
    const participants: Set<Types.Handle> = new Set()
    for (const contestId of contestIds) {
        const contest = await API.contest.standings({
            contestId: contestId as unknown as Types.ContestId,
            showUnofficial: true,
        })
        for (const party of contest.rows)
            for (const member of party.party.members)
                participants.add(member.handle)
    }
    console.log(`${participants.size} testers: ${Array.from(participants).join(', ')}`)
    const byColor: PartialRecord<Color, Array<Types.User>> = {}
    const userInfo = await API.user.info({handles: Array.from(participants)})
    for (const user of userInfo) {
        const color = user.getColor()
        byColor[color] ??= []
        byColor[color]!.push(user)
    }
    const ruText: Array<string> = []
    const enText: Array<string> = []
    for (const color of colorOrder) {
        if (!(color in byColor))
            continue
        const users = byColor[color]!.map(user => `[user: ${user.handle}]`).join(', ')
        ruText.push(`${users} за ${ruColors[color]} тестирование раунда`)
        enText.push(`${users} for ${enColors[color] ?? color} testing`)
    }
    fs.writeFileSync('ru.txt', ruText.join('\n'))
    fs.writeFileSync('en.txt', enText.join('\n'))
}

export const thanksParser = (parser: ArgumentParser) => {
    parser.add_argument('contestIds', { nargs: '+' })
    return async (args) => generateThanks(args.contestIds)
}
