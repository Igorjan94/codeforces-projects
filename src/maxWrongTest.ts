import {Types, API, init} from 'codeforces-sdk'

export const maxWrongTest = async (handle: Types.Handle) => {
    let ret: Array<Types.Submission> = []
    let from = 1
    let count = 1000
    let i = 0
    while (true)
    {
        const submissions = await API.user.status({from, handle, count})
        for (const s of submissions)
            if (s.verdict != Types.SubmissionVerdict.OK && s.verdict != Types.SubmissionVerdict.PARTIAL)
                ret.push(s)
        if (submissions.length != count)
            break
        if (i++ % 100 == 0) {
            ret = ret.sort((a, b) => b.passedTestCount - a.passedTestCount).slice(0, 20)
        }
        from += count
    }
    ret = ret.sort((a, b) => b.passedTestCount - a.passedTestCount).slice(0, 20)
    for (const s of ret)
        console.log(s.passedTestCount, s.getLink())
}
