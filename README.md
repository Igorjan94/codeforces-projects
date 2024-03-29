## Usage

* `npm i`
* implement your own script in `src/<script>.ts`
    * it's easier to copy some file like `standings.ts` and modify it
    * your script should export `<script>Parser` function
~~~~~ts
export const <script>Parser = (parser: ArgumentParser) => {
    // Add parser options
    return async (args) => {
        // Actual script
    }
}
~~~~~
* add your script in `src/index.ts`
    * import it: `import {<script>Parser} from './<script>.ts'`
    * add it in `available` array
* `npm run build`
* `node out/cjs/src/index.js <script> <arguments>` in package folder 
    * e.g.: `node out/cjs/src/index.js standings 1878 -c 10 -s`

You can install these scripts into system npm (after build):
* `sudo npm i -g .`
* `npx codeforces <script> <arguments>` in ANY folder 
    * e.g.: `npx codeforces standings 1878 -c 10 -s`

## Authentication
You can just add `.env` file into project root or source it with `source .env`

~~~~~
CODEFORCES_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CODEFORCES_SECRET=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
~~~~~
