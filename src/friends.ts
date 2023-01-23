import {Types, API, init} from 'codeforces-sdk'

const friendList = async () => {
    init.readDefaultOptionsFromFile('<path>')
    init.setDefaultOptions({
        key: 'key',
        secret: 'secret',
        lang: 'en',
    })
    const handles = await API.user.friends()
    console.log(handles)
}

