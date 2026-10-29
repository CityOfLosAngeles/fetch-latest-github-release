import type * as core from '@actions/core'
import { jest } from '@jest/globals'

export const debug = jest.fn<typeof core.debug>()
export const error = jest.fn<typeof core.error>()
export const info = jest.fn<typeof core.info>()
export const getInput = jest.fn<typeof core.getInput>((name: string) => {
  // Mock implementation that returns appropriate values for the test
  switch (name) {
    case 'github_token':
      return 'ghp_TestToken1234567890abcdef'
    case 'repo_path':
      return '' // Empty string means use default repo from env
    default:
      return ''
  }
})
export const setOutput = jest.fn<typeof core.setOutput>()
export const setFailed = jest.fn<typeof core.setFailed>()
export const warning = jest.fn<typeof core.warning>()
