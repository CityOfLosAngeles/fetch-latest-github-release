import * as core from '@actions/core'
import { getOctokit } from '@actions/github'
import * as fs from 'fs/promises'
import * as crypto from 'crypto'

const EOF = crypto.randomBytes(16).toString('hex') // see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#multiline-strings
process.env.INPUT_GITHUB_TOKEN =
  process.env.NODE_ENV === 'test'
    ? 'ghp_PersonalAccessToken01245678900000000'
    : process.env.INPUT_GITHUB_TOKEN
process.env.INPUT_GITHUB_REPOSITORY =
  process.env.NODE_ENV === 'test'
    ? 'hiimbex/testing-things'
    : process.env.INPUT_GITHUB_REPOSITORY
const GITHUB_ACTION_OUTPUT =
  process.env.GITHUB_OUTPUT || './__tests__/github_output_test.txt' // see more information here https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#example-of-setting-an-output-parameter

const customRepo = (repoPath: string) => {
  const segments = repoPath.split('/', 2)

  if (segments.length < 2) {
    core.info('Please provide a repository in the format `owner/repo`.')
  }

  return segments
}

const repoInput = core.getInput('repo_path')

const [owner, repo] = repoInput
  ? customRepo(repoInput)
  : (process.env.INPUT_GITHUB_REPOSITORY as string).split('/', 2)

// const octokit = new github.GitHub(
//   core.getInput('github_token', { required: true })
// )
// const octokit = new GitHub({
//   auth: core.getInput('github_token', { required: true })
// });

const octokit = getOctokit(core.getInput('github_token'))

async function appendGHOutputfile(content: string) {
  try {
    if (GITHUB_ACTION_OUTPUT) {
      await fs.appendFile(GITHUB_ACTION_OUTPUT, content)
    } else {
      core.info('GITHUB_ACTION_OUTPUT is not defined. Skipping file append.')
    }
  } catch (error) {
    core.info('Could not write to the GITHUB_OUTPUT environment file.')
    core.setFailed(`Action failed with error ${error}`)
  }
}

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    let latestRelease

    core.info(`Fetching the latest release for \`${owner}/${repo}\``)

    try {
      latestRelease = await octokit.rest.repos.getLatestRelease({
        owner,
        repo
      })
    } catch (error) {
      core.info('Could not fetch the latest release. Have you made one yet?')
      core.setFailed(`Action failed with error ${error}`)
    }

    if (!latestRelease) {
      core.setFailed('Failed to fetch the latest release. Exiting.')
      return
    }
    const { data } = latestRelease

    const releaseAttributes = [
      'url',
      'assets_url',
      'upload_url',
      'html_url',
      'id',
      'node_id',
      'tag_name',
      'target_commitish',
      'name',
      'body',
      'draft',
      'prerelease',
      'author_id',
      'author_node_id',
      'author_url',
      'author_login',
      'author_html_url',
      'author_type',
      'author_site_admin'
    ]

    let github_output = ''
    let tempData = ''
    let tempAuthorAttribute = ''
    for (let i = 0; i < releaseAttributes.length; i++) {
      switch (true) {
        case releaseAttributes[i] == 'author_id': // ex. author_id > data.author.id.toString()
          tempData = data.author.id.toString()
          github_output =
            releaseAttributes[i] + '=' + tempData + '\n' + github_output
          break
        case releaseAttributes[i].includes('author'): // ex. author_url > data.author.url
          tempAuthorAttribute = releaseAttributes[i]
          tempAuthorAttribute = tempAuthorAttribute.replace('author_', '')
          github_output =
            releaseAttributes[i] +
            '=' +
            data.author[tempAuthorAttribute as keyof typeof data.author] +
            '\n' +
            github_output
          break
        case releaseAttributes[i] == 'id': // ex. id > data.id.toString()
          // eslint-disable-next-line
          tempData = (data as any)[releaseAttributes[i]].toString()
          github_output =
            releaseAttributes[i] + '=' + tempData + '\n' + github_output
          break
        case releaseAttributes[i] == 'body':
          // see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#multiline-strings
          github_output =
            releaseAttributes[i] +
            '<<' +
            EOF +
            '\n' + // eslint-disable-next-line
            (data as Record<string, any>)[releaseAttributes[i]] +
            '\n' +
            EOF +
            '\n' +
            github_output
          break
        default: // ex. assets_url > data.assets_url
          github_output =
            releaseAttributes[i] +
            '=' + // eslint-disable-next-line
            (data as Record<string, any>)[releaseAttributes[i]] +
            '\n' +
            github_output
      }
      await appendGHOutputfile(github_output)
    }
    // const ms: string = core.getInput('milliseconds')

    // // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    // core.debug(`Waiting ${ms} milliseconds ...`)

    // // Log the current timestamp, wait, then log the new timestamp
    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // // Set outputs for other workflow steps to use
    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export { EOF, GITHUB_ACTION_OUTPUT }
