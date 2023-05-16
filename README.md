# fetch-latest-github-release

A tiny GitHub action to fetch the latest GitHub Release for a given repository. Originally forked from https://github.com/gregziegan/fetch-latest-release on 2023/04/27.

[![Development Example Test Runs & CI Tests](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/example-runs.yml/badge.svg?branch=development)](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/example-runs.yml)

[![Production Example Test Runs & CI Tests](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/example-runs.yml/badge.svg?branch=production)](https://github.com/CityOfLosAngeles/fetch-latest-github-release/actions/workflows/example-runs.yml)

## Inputs

| Parameter           | Description                                                                                | Required | Default      |
| ------------------- | ------------------------------------------------------------------------------------------ | -------- | ------------ |
| `github_token`      | A Github token, usually `${{ github.token }}`.                                             | N        | `${{ github.token }}`  |
| `repo_path`         | Provide a "owner/repo" string for fetching from a different repo.                          | N        | The current repo       |

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

```yaml
steps:
  - id: fetch-latest-github-release
    uses: cityoflosangeles/fetch-latest-github-release@{latest-release} # ex. v1, v2, v3 etc. See https://github.com/CityOfLosAngeles/fetch-latest-github-release/releases
    with:
      github_token: ${{ github.token }}
```

## CI / Unit Tests

To run the tests locally, run `npm test`.
