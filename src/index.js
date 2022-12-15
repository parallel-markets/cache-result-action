const core = require('@actions/core')
const github = require('@actions/github')
const cache = require('@actions/cache')
const fs = require('fs')

const RESULT_PATH = '/tmp/prev-result'

const run = async () => {
  const sha = github.context.sha
  core.info(`Running for current SHA ${sha}`)
  
  try {
    // inputResult will be 'unknown' if we're in "restore only" mode.
    const inputResult = core.getInput('result')
    const cacheGroup = core.getInput('cache-group')
    const keyPrefix = `cache-result-action-${cacheGroup}-${sha}`
    const key = keyPrefix + '-' + Math.floor(Date.now() / 1000)

    await cache.restoreCache([RESULT_PATH], key, [keyPrefix])

    let actualResult = inputResult

    // True if we have a previous result already.
    const cacheHit = !!fs.existsSync(RESULT_PATH)

    let cacheOutcome = cacheHit ? 'hit' : 'miss'

    // If the result is 'unknown' then we won't save it to the cache; we're in "restore only" mode.
    if (inputResult !== 'unknown') {
      fs.writeFileSync(RESULT_PATH, inputResult)
      await cache.saveCache([RESULT_PATH], key)
      cacheOutcome = 'write'
    } else if (cacheHit) {
      actualResult = fs.readFileSync(RESULT_PATH, { encoding: 'utf8' })
    }

    core.setOutput('result', actualResult)

    await core.summary
      .addTable([
        [{data: 'Output', header: true}, {data: 'Result', header: true}],
        ['result', actualResult],
        ['cache_key', key],
        ['cache_outcome', cacheOutcome],
      ])
      .write()
  } catch(error) {
    core.setFailed(error.message)
  }
}

run()
