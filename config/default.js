module.exports = {
    // see more information here https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables
    "GH_REPOSITORY": process.env.GITHUB_REPOSITORY,
    // see more information here https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#example-of-setting-an-output-parameter
    "GITHUB_OUTPUT": process.env.GITHUB_OUTPUT
}