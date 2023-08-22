# fetch-latest-github-release

A tiny GitHub action to fetch the latest GitHub Release for a given repository. Originally forked from https://github.com/gregziegan/fetch-latest-release on 2023/04/27.

[![Development Example Test Runs](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/example-runs.yml/badge.svg?branch=development)](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/example-runs.yml) [![Production Example Test Runs](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/example-runs.yml/badge.svg?branch=production)](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/example-runs.yml) [![Development Jest Tests & Coverage](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/test-coverage.yml/badge.svg?branch=development)](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/test-coverage.yml) [![Production Jest Tests & Coverage](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/test-coverage.yml/badge.svg?branch=production)](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/test-coverage.yml) [![codecov](https://codecov.io/gh/CityOfLosAngeles/fetch-latest-github-release/graph/badge.svg?token=TDK6PE2M0T)](https://codecov.io/gh/CityOfLosAngeles/fetch-latest-github-release)

## Inputs

| Parameter           | Description                                                                                | Required | Default      |
| ------------------- | ------------------------------------------------------------------------------------------ | -------- | ------------ |
| `github_token`      | A Github token, usually `${{ github.token }}`.                                             | N        | `${{ github.token }}`  |
| `repo_path`         | Provide a "owner/repo" string for fetching from a different repo. If not provided the repository the composite action is ran in will be used.                          | N        | The current repo       |

## Output

- `url` The HTTP URL for this release
- `assets_url`: The REST API HTTP URL for this release's assets
- `upload_url`: The REST API HTTP URL for uploading to this release
- `html_url`: The REST API HTTP URL for this release
- `id`: ''
- `node_id`: The unique identifier for accessing this release in the GraphQL API
- `tag_name`: The name of the release's Git tag
- `target_commitish`: ''
- `name`: The title of the release
- `body`: The description of the release
- `draft`: Whether or not the release is a draft
- `prerelease`: Whether or not the release is a prerelease
- `author_id`: ''
- `author_node_id`: The unique identifier for accessing this release's author in the GraphQL API
- `author_url`: The REST API HTTP URL for this release's author
- `author_login`: The username used to login.
- `author_html_url`: The HTTP URL for this release's author
- `author_type`: ''
- `author_site_admin`: Whether or not this user is a site administrator

## Usage

**Example 1:** Fetch the latest release from the repository this composite action was ran from.
```yaml
steps:
  - id: fetch-latest-github-release
    uses: cityoflosangeles/fetch-latest-github-release@{latest-release} # ex. v1, v2, v3 etc. See https://github.com/CityOfLosAngeles/fetch-latest-github-release/releases
```

**Example 2:** Fetch the latest release from another repository. Make sure the generated token passed in has the appropriate permissions.

```yaml
steps:
  - id: fetch-latest-github-release
    uses: cityoflosangeles/fetch-latest-github-release@{latest-release} # ex. v1, v2, v3 etc. See https://github.com/CityOfLosAngeles/fetch-latest-github-release/releases
    with:
      github_token: ${{ github.token }}
      repo_path: "user/repo-name"
```

You will retrieve the output from subsequent GitHub Actions steps like:

```yaml
- name: "Obtain Latest Tag Name & Run a Cool Process Against It"
  uses: "hiimbex/some-cool-action@v1"
  with:
    version: ${{ steps.fetch-latest-github-release.outputs.tag_name }}
```

`steps.fetch-latest-github-release.outputs.tag_name` is important, you can fetch other outputs
that are defined in `action.yml`.

## CI / Unit Tests

To run the tests locally, run `npm test`.
