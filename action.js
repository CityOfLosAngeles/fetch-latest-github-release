const core = require('@actions/core');
const github = require('@actions/github');
const process = require('process');
const fs = require('fs/promises');
const config = require('config');

const customRepo = (repoPath) => {
  const segments = repoPath.split('/', 2);

  if (segments.length < 2) {
    core.info('Please provide a repository in the format `owner/repo`.')
  }

  return segments;
}

const repoInput = core.getInput('repo_path');

const [owner, repo] = repoInput
  ? customRepo(repoInput)
  : config.get('GH_REPOSITORY').split('/', 2);

const octokit = new github.GitHub(
  core.getInput('github_token', { required: true })
)

async function appendGHOutputfile(content) {
  try {
    await fs.appendFile(config.get('GITHUB_OUTPUT'), content);
  } catch (error) {
      core.info('Could not write to the GITHUB_OUTPUT environment file.');
      core.setFailed(`Action failed with error ${error}`);
  }
}

async function run() {
  let latestRelease

  core.info(`Fetching the latest release for \`${owner}/${repo}\``)

  try {
    latestRelease = await octokit.repos.getLatestRelease({
      owner,
      repo,
    })
  } catch (error) {
      core.info('Could not fetch the latest release. Have you made one yet?');
      core.setFailed(`Action failed with error ${error}`);
  }

  const { data } = latestRelease;

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
  ];

  let github_output = "";
  for (i=0; i < releaseAttributes.length; i++) {
    switch(true) {
      case (releaseAttributes[i] == "author_id"): // ex. author_id > data.author.id.toString()
        tempData = data.author.id.toString();
        github_output = releaseAttributes[i] + '=' + tempData + "\n" + github_output;
        break;
      case (releaseAttributes[i].includes("author")): // ex. author_url > data.author.url
        tempAuthorAttribute = releaseAttributes[i];
        tempAuthorAttribute = tempAuthorAttribute.replace("author_", "");
        github_output = releaseAttributes[i] + '=' + data.author[tempAuthorAttribute] + "\n" + github_output;
        break;
      case (releaseAttributes[i] == "id"): // ex. id > data.id.toString()
        tempData = data[releaseAttributes[i]].toString();
        github_output = releaseAttributes[i] + '=' + tempData + "\n" + github_output;
        break;
      case (releaseAttributes[i] == "body"):
        github_output = releaseAttributes[i] + '<<EOF' + '\n' + data[releaseAttributes[i]] + '\n' + 'EOF' + "\n" + github_output;
        break;
      default: // ex. assets_url > data.assets_url
        github_output = releaseAttributes[i] + '=' + data[releaseAttributes[i]] + "\n" + github_output;
    }
  }

  try {
    await appendGHOutputfile(github_output);
  } catch (error) {
      core.setFailed(`Action failed with error ${error}`);
  }
}

try {
  if(process.env.NODE_ENV != "test") { // don't execute run when jest tests are running as run is exported for jest testing
    run();
  }
} catch (error) {
    core.setFailed(`Action failed with error ${error}`);
}

module.exports.run = run;
