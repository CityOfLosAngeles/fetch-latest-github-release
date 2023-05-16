const action = require('../action');
const nock = require('nock');
const fs = require('fs/promises');
const config = require('config');

// return mock response with an object with the latest release info
// view https://docs.github.com/en/rest/reference/repos#get-the-latest-release
function latestRelease() {
    return {
        "url": "https://api.github.com/repos/hiimbex/testing-things/releases/1",
        "html_url": "https://github.com/hiimbex/testing-things/releases/v1.0.0",
        "assets_url": "https://api.github.com/repos/hiimbex/testing-things/releases/1/assets",
        "upload_url": "https://uploads.github.com/repos/hiimbex/testing-things/releases/1/assets{?name,label}",
        "tarball_url": "https://api.github.com/repos/hiimbex/testing-things/tarball/v1.0.0",
        "zipball_url": "https://api.github.com/repos/hiimbex/testing-things/zipball/v1.0.0",
        "discussion_url": "https://github.com/hiimbex/testing-things/discussions/90",
        "id": 1,
        "node_id": "MDQ6VXNlcjE=",
        "tag_name": "1.2.3",
        "target_commitish": "production",
        "name": "v1.2.3",
        "body": "Description of the release",
        "draft": false,
        "prerelease": false,
        "author": {
            "login": "octocat",
            "id": 1,
            "node_id": "MDQ6VXNlcjE=",
            "avatar_url": "https://github.com/images/error/octocat_happy.gif",
            "gravatar_id": "",
            "url": "https://github.com/hiimbex/testing-things",
            "html_url": "https://github.com/hiimbex",
            "followers_url": "https://github.com/hiimbex/testing-things/followers",
            "following_url": "https://github.com/hiimbex/testing-things/following{/other_user}",
            "gists_url": "https://github.com/hiimbex/testing-things/gists{/gist_id}",
            "starred_url": "https://github.com/hiimbex/testing-things/starred{/owner}{/repo}",
            "subscriptions_url": "https://github.com/hiimbex/testing-things/subscriptions",
            "organizations_url": "https://github.com/hiimbex/testing-things/orgs",
            "repos_url": "https://github.com/hiimbex/testing-things/repos",
            "events_url": "https://github.com/hiimbex/testing-things/events{/privacy}",
            "received_events_url": "https://github.com/hiimbex/testing-things/received_events",
            "type": "User",
            "site_admin": false
          }
      }
}

async function intitializeGithubOutputFile() {
    try {
        // create the file if it doesn't exist, if it already exists it will replace the contents of the file.
        await fs.writeFile(config.get('GITHUB_OUTPUT'), "");
    } catch (error) {
        console.log('Could not write the GitHub output file for testing. Error is: ' + error);
    }
}

async function readGithubOutputFile() {
    try {
        const fileData = await fs.readFile(config.get('GITHUB_OUTPUT'), {encoding: 'utf8'});
        return fileData;
    } catch (error) {
        console.log('Could not read the GitHub output file for testing. Error is: ' + error);
    }
}

describe('run', () => {

    beforeEach(() => {
        intitializeGithubOutputFile().then(() => {
            nock.disableNetConnect();
        })
        .catch((error) => {
            console.log(error);
        });
        
    });
  
    test('should fetch the latest release details', async () => {
        const mock = nock('https://api.github.com')
        .get('/repos/hiimbex/testing-things/releases/latest')
        .reply(200, latestRelease())

        await action.run();
        const data = await readGithubOutputFile();

        // GitHub expects the output to be in the format of key=value, see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-output-parameter
        expect(data).toContain('url=https://api.github.com/repos/hiimbex/testing-things/releases/1');
        expect(data).toContain('assets_url=https://api.github.com/repos/hiimbex/testing-things/releases/1/assets');
        expect(data).toContain('upload_url=https://uploads.github.com/repos/hiimbex/testing-things/releases/1/assets{?name,label}');
        expect(data).toContain('html_url=https://github.com/hiimbex/testing-things/releases/v1.0.0');
        expect(data).toContain('id=1');
        expect(data).toContain('node_id=MDQ6VXNlcjE=');
        expect(data).toContain('tag_name=1.2.3');
        expect(data).toContain('target_commitish=production');
        expect(data).toContain('name=v1.2.3');
        //expect(data).toContain('body<<EOFDescription of the releaseEOF');
        expect(data).toContain('draft=false');
        expect(data).toContain('prerelease=false');
        expect(data).toContain('author_id=1');
        expect(data).toContain('author_node_id=MDQ6VXNlcjE=');
        expect(data).toContain('author_url=https://github.com/hiimbex/testing-things');
        expect(data).toContain('author_login=octocat');
        expect(data).toContain('author_html_url=https://github.com/hiimbex');
        expect(data).toContain('author_type=User');
        expect(data).toContain('author_site_admin=false');

        expect(mock.pendingMocks()).toStrictEqual([]);
    });

    afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});