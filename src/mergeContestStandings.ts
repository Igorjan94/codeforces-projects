// Import Types and API from sdk
import { Types, API } from 'codeforces-sdk'

/** 
This function returns users who took part in ALL contestsIds
and solved at least one problem in each contest ordered by sum of taken places
*/

// Declare function with one array parameter of ContestId --- alias to number
const mergeContestStandings = async (contestIds: Array<Types.ContestId>) => {

    // Initialize empty map from user's handle to some stat object
    const contestants: Record<Types.Handle, {off: number, unoff: number, both: number, place: number}> = {}

    // Range-based for like in c++
    for (const contestId of contestIds) {

        // Query API method 'contest.standing' with query params
        const contest = await API.contest.standings({contestId, from: 1, showUnofficial: true})

        contest.rows
            // Filter participants who didn't solve any problem
            .filter(row => row.points > 0)
            // And for each other participant
            .forEach(row => {
                // Take participant's handle
                // Codeforces returns participants in array of 1..3 objects
                // Typescript allows you to access 0-th element, because we are sure,
                //   that there is at least one participant, so handle's type will be deduced as `Handle`
                //   Participant [1] and [2] are optional, so row.party.members[1].handle won't compile,
                //   because type of row.party.members[1] is `Member | undefined`
                //   If you are sure, that you some contest always had at least 2 participants,
                //   use `!`: `row.party.members[1]!.handle`
                const handle = row.party.members[0].handle

                // If our map doesn't have handle as key, initialize it with empty value.
                // Unlike c++ empty value in map is `undefined`
                if (!(handle in contestants))
                    contestants[handle] = {
                        both: 0,
                        off: 0,
                        place: 0,
                        // I like trailing comma to minimize git diff and simplify adding new elements
                        unoff: 0,
                    }

                // Now we are sure, than this object exists
                // C++: auto& contestant = contestants[handle]
                //          ^------ note that contestant is reference!
                const contestant = contestants[handle]

                // ParticipantType is enum with string values
                const isOff = row.party.participantType == Types.ParticipantType.CONTESTANT
                const isUnoff = row.party.participantType == Types.ParticipantType.OUT_OF_COMPETITION

                // Update stat
                if (isOff) ++contestant.off
                if (isUnoff) ++contestant.unoff
                if (isOff || isUnoff) {
                    ++contestant.both
                    contestant.place += row.rank
                }
            })
    }

    // Object entries is Array<[key, value]>
    const items = Object.entries(contestants)
        // Filter participants which took part in all contests
        .filter(([_, v]) => v.both == contestIds.length)
        // Extend stat with user's handle
        .map(([k, v]) => ({
            ...v,
            handle: k,
        }))

    // Sort them by place
    // Note that typescript comparator returns negative number when first one is greater, positive when less and zero if equal
    items.sort((a, b) => a.place - b.place)

    // Header line
    console.log('Handle place off unoff')
    // Just output all items
    // `${valiable}` is python's f-string: f'{variable}`
    console.log(items.map(v => `${v.handle} ${v.place} ${v.off} ${v.unoff}`).join('\n'))
}

