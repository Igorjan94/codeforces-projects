#!/usr/bin/env node

import { Types, API, init } from 'codeforces-sdk'
import { standingsParser } from './standings'
import { userInfoParser } from './userInfo'
import { maxWrongTestParser } from './maxWrongTest'
import { thanksParser } from './thanks'
import argparse, { ArgumentParser } from 'argparse'
import * as dotenv from 'dotenv'
dotenv.config()

const {version} = require('../../../package.json')

const parser = new ArgumentParser({
    description: 'Codeforces scripts',
})

parser.add_argument('-v', '--version', { action: 'version', version })
const subparsers = parser.add_subparsers()

const available = [
    standingsParser,
    userInfoParser,
    maxWrongTestParser,
    thanksParser,
    // Add your script here. 
    // If you export it with `export const <name>Parser = (parser: ArgumentParser) => {}`,
    // then it'll be available by <name>
] as const

for (const script of available) {
    const name = script.name.replace(/Parser$/, '')
    const subparser = subparsers.add_parser(name)
    const run = script(subparser)
    subparser.set_defaults({run})
}

const args = parser.parse_args()
if ('run' in args) {
    const run = args.run
    delete args.run
    run(args).catch(e => {
        console.error(e)
    })
} else {
    console.warn('No command selected, exit')
}
