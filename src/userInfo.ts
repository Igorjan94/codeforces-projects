import { Types, API, init } from 'codeforces-sdk'

export const userInfo = async (handle: Types.Handle) => {
    const users = await API.user.info({handles: [handle]})
    const user = users[0]
    console.log(user.getLink())
    console.log(user.getStyledLink())

    Object.keys(user).forEach(key =>
        console.log(key, user[key])
    )
}
