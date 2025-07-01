/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { promises as fs } from 'fs'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// Mock the @actions/github module
jest.unstable_mockModule('@actions/github', () => ({
  getOctokit: jest.fn(() => ({
    rest: {
      repos: {
        getLatestRelease: jest.fn(() =>
          Promise.resolve({
            data: latestRelease()
          })
        )
      }
    }
  }))
}))

// Import the module after mocking is set up
const action = await import('../src/main.js')
const EOF = action.EOF
const GITHUB_ACTION_OUTPUT = action.GITHUB_ACTION_OUTPUT

// jest.mock('config', () => ({
//   get: jest.fn((key: 'GITHUB_OUTPUT' | 'GH_REPOSITORY') => {
//     const mockConfig = {
//       GITHUB_OUTPUT: './test/github_output_test.txt',
//       GH_REPOSITORY: 'hiimbex/testing-things'
//     }
//     return mockConfig[key]
//   })
// }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.

// return mock response with an object with the latest release info
// view https://docs.github.com/en/rest/reference/repos#get-the-latest-release
function latestRelease() {
  return {
    url: 'https://api.github.com/repos/hiimbex/testing-things/releases/1',
    html_url: 'https://github.com/hiimbex/testing-things/releases/v1.0.0',
    assets_url:
      'https://api.github.com/repos/hiimbex/testing-things/releases/1/assets',
    upload_url:
      'https://uploads.github.com/repos/hiimbex/testing-things/releases/1/assets{?name,label}',
    tarball_url:
      'https://api.github.com/repos/hiimbex/testing-things/tarball/v1.0.0',
    zipball_url:
      'https://api.github.com/repos/hiimbex/testing-things/zipball/v1.0.0',
    discussion_url: 'https://github.com/hiimbex/testing-things/discussions/90',
    id: 1,
    node_id: 'MDQ6VXNlcjE=',
    tag_name: '1.2.3',
    target_commitish: 'production',
    name: 'v1.2.3',
    body: 'Description of the release',
    draft: false,
    prerelease: false,
    author: {
      login: 'octocat',
      id: 1,
      node_id: 'MDQ6VXNlcjE=',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      gravatar_id: '',
      url: 'https://github.com/hiimbex/testing-things',
      html_url: 'https://github.com/hiimbex',
      followers_url: 'https://github.com/hiimbex/testing-things/followers',
      following_url:
        'https://github.com/hiimbex/testing-things/following{/other_user}',
      gists_url: 'https://github.com/hiimbex/testing-things/gists{/gist_id}',
      starred_url:
        'https://github.com/hiimbex/testing-things/starred{/owner}{/repo}',
      subscriptions_url:
        'https://github.com/hiimbex/testing-things/subscriptions',
      organizations_url: 'https://github.com/hiimbex/testing-things/orgs',
      repos_url: 'https://github.com/hiimbex/testing-things/repos',
      events_url: 'https://github.com/hiimbex/testing-things/events{/privacy}',
      received_events_url:
        'https://github.com/hiimbex/testing-things/received_events',
      type: 'User',
      site_admin: false
    }
  }
}

async function initializeGithubOutputFile() {
  try {
    // create the file if it doesn't exist, if it already exists it will replace the contents of the file.
    if (GITHUB_ACTION_OUTPUT) {
      await fs.writeFile(GITHUB_ACTION_OUTPUT, '')
    } else {
      throw new Error('GITHUB_ACTION_OUTPUT is not defined')
    }
  } catch (error) {
    console.log(
      'Could not write the GitHub output file for testing. Error is: ' + error
    )
  }
}

async function readGithubOutputFile() {
  try {
    if (!GITHUB_ACTION_OUTPUT) {
      throw new Error('GITHUB_ACTION_OUTPUT is not defined')
    }
    const fileData = await fs.readFile(GITHUB_ACTION_OUTPUT, {
      encoding: 'utf8'
    })
    return fileData
  } catch (error) {
    console.log(
      'Could not read the GitHub output file for testing. Error is: ' + error
    )
  }
}

describe('run', () => {
  beforeEach(async () => {
    // Initialize output file first
    await initializeGithubOutputFile()
  })

  test('should fetch the latest release details', async () => {
    // Reset mock calls
    core.setFailed.mockClear()
    core.info.mockClear()

    await action.run()

    const data = await readGithubOutputFile()

    // GitHub expects the output to be in the format of key=value, see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-output-parameter
    expect(data).toContain(
      'url=https://api.github.com/repos/hiimbex/testing-things/releases/1'
    )
    expect(data).toContain(
      'assets_url=https://api.github.com/repos/hiimbex/testing-things/releases/1/assets'
    )
    expect(data).toContain(
      'upload_url=https://uploads.github.com/repos/hiimbex/testing-things/releases/1/assets{?name,label}'
    )
    expect(data).toContain(
      'html_url=https://github.com/hiimbex/testing-things/releases/v1.0.0'
    )
    expect(data).toContain('id=1')
    expect(data).toContain('node_id=MDQ6VXNlcjE=')
    expect(data).toContain('tag_name=1.2.3')
    expect(data).toContain('target_commitish=production')
    expect(data).toContain('name=v1.2.3')
    // see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#multiline-strings
    expect(data).toContain(
      'body<<' + EOF + '\n' + 'Description of the release' + '\n' + EOF + '\n'
    )
    expect(data).toContain('draft=false')
    expect(data).toContain('prerelease=false')
    expect(data).toContain('author_id=1')
    expect(data).toContain('author_node_id=MDQ6VXNlcjE=')
    expect(data).toContain(
      'author_url=https://github.com/hiimbex/testing-things'
    )
    expect(data).toContain('author_login=octocat')
    expect(data).toContain('author_html_url=https://github.com/hiimbex')
    expect(data).toContain('author_type=User')
    expect(data).toContain('author_site_admin=false')

    // Verify no errors occurred
    expect(core.setFailed).not.toHaveBeenCalled()
  })
})
