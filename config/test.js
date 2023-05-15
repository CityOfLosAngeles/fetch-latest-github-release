module.exports = {
    // set to the GITHUB_REPOSITORY environment variable if it exists by the GH runner, otherwise default to "hiimbex/testing-things" for testing
    "GH_REPOSITORY": process.env.GITHUB_REPOSITORY || "hiimbex/testing-things",
    // set to GITHUB_OUTPUT with the path from the Actions Runner, otherwise default to "./test/github_output_test.txt" for testing
    // see more information here https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#example-of-setting-an-output-parameter
    "GITHUB_OUTPUT": process.env.GITHUB_OUTPUT || "./test/github_output_test.txt"
}