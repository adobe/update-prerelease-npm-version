/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const core = require('@actions/core')
const { getPackageJson, writePackageJson, generatePrereleaseVersion } = require('../src/utils')

jest.mock('@actions/core')
jest.mock('../src/utils')

const PRE_RELEASE_VERSION = '1.0.0-pre.abc'
const GITHUB_SHA = 'abc123'

const createPackageJson = () => {
  return {
    version: '1.0.0',
    dependencies: {
      a: '^1.0.0',
      b: '2.0.0'
    }
  }
}

jest.mock('@actions/github', () => ({
  context: {
    sha: GITHUB_SHA
  }
}))

beforeEach(() => {
  getPackageJson.mockClear()
  core.getInput.mockClear()
  core.error.mockClear()
  core.setOutput.mockClear()
  core.info.mockClear()

  getPackageJson.mockReturnValue(createPackageJson())
  generatePrereleaseVersion.mockReturnValue(PRE_RELEASE_VERSION)
})

test('update deps, version, sha, package name', () => {
  const actionValues = {
    'dependencies-to-update': 'a,b',
    'package-json-path': './package.json',
    'dependencies-to-update-version-tag': 'next',
    'package-name': 'foo-cli'
  }
  core.getInput.mockImplementation((key) => {
    return actionValues[key]
  })

  jest.isolateModules(() => {
    require('../src/index') // run the action
    const originalPackageJson = createPackageJson()
    expect(writePackageJson).toHaveBeenCalledWith(
      actionValues['package-json-path'],
      JSON.stringify({
        ...originalPackageJson,
        dependencies: {
          a: actionValues['dependencies-to-update-version-tag'],
          b: actionValues['dependencies-to-update-version-tag']
        },
        version: PRE_RELEASE_VERSION,
        prereleaseSha: GITHUB_SHA,
        name: actionValues['package-name']
      }, null, 2)
    )

    expect(core.setOutput).toHaveBeenCalledWith('pre-release-version', PRE_RELEASE_VERSION)
  })
})

test('update deps, version, sha (unknown dep, coverage)', () => {
  const actionValues = {
    'dependencies-to-update': 'a,b,c', // c is unknown
    'package-json-path': './package.json',
    'dependencies-to-update-version-tag': 'next'
  }
  core.getInput.mockImplementation((key) => {
    return actionValues[key]
  })

  jest.isolateModules(() => {
    require('../src/index') // run the action
    const originalPackageJson = createPackageJson()
    expect(writePackageJson).toHaveBeenCalledWith(
      actionValues['package-json-path'],
      JSON.stringify({
        ...originalPackageJson,
        dependencies: {
          a: actionValues['dependencies-to-update-version-tag'],
          b: actionValues['dependencies-to-update-version-tag']
        },
        version: PRE_RELEASE_VERSION,
        prereleaseSha: GITHUB_SHA,
        name: actionValues['package-name']
      }, null, 2)
    )

    expect(core.error).toHaveBeenCalledWith('dependency c was not found in the package.json file.')
    expect(core.setOutput).toHaveBeenCalledWith('pre-release-version', PRE_RELEASE_VERSION)
  })
})

test('update version, sha (no deps update)', () => {
  const actionValues = {
    'dependencies-to-update': '', // empty deps string
    'package-json-path': './package.json',
    'dependencies-to-update-version-tag': 'next'
  }
  core.getInput.mockImplementation((key) => {
    return actionValues[key]
  })

  jest.isolateModules(() => {
    require('../src/index') // run the action
    const originalPackageJson = createPackageJson()
    expect(writePackageJson).toHaveBeenCalledWith(
      actionValues['package-json-path'],
      JSON.stringify({
        ...originalPackageJson, // original deps
        version: PRE_RELEASE_VERSION,
        prereleaseSha: GITHUB_SHA
      }, null, 2)
    )

    expect(core.setOutput).toHaveBeenCalledWith('pre-release-version', PRE_RELEASE_VERSION)
  })
})

test('update version, sha (skip deps update via input boolean)', () => {
  const actionValues = {
    'dependencies-to-update': 'a, b',
    'skip-dependencies-to-update': true,
    'package-json-path': './package.json',
    'dependencies-to-update-version-tag': 'next'
  }
  core.getInput.mockImplementation((key) => {
    return actionValues[key]
  })

  jest.isolateModules(() => {
    require('../src/index') // run the action
    const originalPackageJson = createPackageJson()
    expect(writePackageJson).toHaveBeenCalledWith(
      actionValues['package-json-path'],
      JSON.stringify({
        ...originalPackageJson, // original deps
        version: PRE_RELEASE_VERSION,
        prereleaseSha: GITHUB_SHA
      }, null, 2)
    )

    expect(core.setOutput).toHaveBeenCalledWith('pre-release-version', PRE_RELEASE_VERSION)
  })
})
