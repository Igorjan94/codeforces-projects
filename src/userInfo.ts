import { ArgumentParser } from 'argparse'
import { Types, API } from 'codeforces-sdk'

export const userInfo = async (handle: Types.Handle) => {
    const users = await API.user.info({handles: [handle]})
    const user = users[0]
    console.log(user.getLink())
    console.log(user.getStyledLink())

    Object.keys(user).forEach(key =>
        console.log(key, user[key])
    )
}

export const userInfoParser = (parser: ArgumentParser) => {
    parser.add_argument('handle', { nargs: 1 })
    return async (args) => userInfo(args.handle)
}
