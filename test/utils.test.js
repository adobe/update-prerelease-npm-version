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

const {
  getPackageJson,
  writePackageJson,
  generatePrereleaseVersion,
  parseSemanticVersion,
  getTodaysUTCDate
} = require('../src/utils')
const fs = require('fs')
const semverValid = require('semver/functions/valid')

jest.mock('fs')

/* eslint jest/expect-expect: [
  "error",
  {
    "assertFunctionNames": [
        "expect", "doTest"
    ]
  }
]
*/

test('exists', () => {
  expect(generatePrereleaseVersion).toBeDefined()
  expect(parseSemanticVersion).toBeDefined()
})

test('parseSemanticVersion', () => {
  let sv = []

  sv = parseSemanticVersion('1.2.3')
  expect(sv[0]).toEqual(1)
  expect(sv[1]).toEqual(2)
  expect(sv[2]).toEqual(3)

  sv = parseSemanticVersion('3.2.1-pre.0')
  expect(sv[0]).toEqual(3)
  expect(sv[1]).toEqual(2)
  expect(sv[2]).toEqual(1)
})

test('getPackageJson', () => {
  const packageJson = { version: '1.2.3' }
  fs.readFileSync.mockReturnValue(JSON.stringify(packageJson))

  const retVal = getPackageJson('my-path')

  expect(fs.readFileSync).toBeCalledTimes(1)
  expect(retVal).toEqual(packageJson)
})

test('writePackageJson', () => {
  const packageJson = { version: '2.3.4' }
  const data = JSON.stringify(packageJson)

  writePackageJson('my-path', data)

  expect(fs.writeFileSync).toBeCalledTimes(1)
})

describe('generatePrereleaseVersion', () => {
  /** @private */
  function doTest (semanticVersion, prereleaseTag, shaHash, someDate) {
    const truncatedShaHash = shaHash.substring(0, 8)
    let result

    result = generatePrereleaseVersion(semanticVersion, prereleaseTag, shaHash)
    expect(result).toEqual(`${semanticVersion}-${prereleaseTag}.${getTodaysUTCDate()}.sha-${truncatedShaHash}`)
    expect(semverValid(result)).toBeTruthy()

    result = generatePrereleaseVersion(semanticVersion, prereleaseTag, shaHash, someDate)
    expect(result).toEqual(`${semanticVersion}-${prereleaseTag}.${someDate}.sha-${truncatedShaHash}`)
    expect(semverValid(result)).toBeTruthy()
  }

  test('alphanumeric hash - no leading zero', () => {
    const semanticVersion = '1.2.3'
    const prereleaseTag = 'alpha'
    const someDate = '2022-01-01'
    const shaHash = 'abcde1234567890'

    doTest(semanticVersion, prereleaseTag, shaHash, someDate)
  })

  test('alphanumeric hash - leading zero', () => {
    const semanticVersion = '1.2.3'
    const prereleaseTag = 'alpha'
    const someDate = '2022-01-01'
    const shaHash = '0a12b34567890'

    doTest(semanticVersion, prereleaseTag, shaHash, someDate)
  })

  test('all digits hash - leading zero', () => {
    const semanticVersion = '1.2.3'
    const prereleaseTag = 'alpha'
    const someDate = '2022-01-01'
    const shaHash = '01234567890'

    doTest(semanticVersion, prereleaseTag, shaHash, someDate)
  })

  test('all digits hash - no leading zero', () => {
    const semanticVersion = '1.2.3'
    const prereleaseTag = 'alpha'
    const someDate = '2022-01-01'
    const shaHash = '1234567890'

    doTest(semanticVersion, prereleaseTag, shaHash, someDate)
  })

  test('all digits hash - just one zero', () => {
    const semanticVersion = '1.2.3'
    const prereleaseTag = 'alpha'
    const someDate = '2022-01-01'
    const shaHash = '0'

    doTest(semanticVersion, prereleaseTag, shaHash, someDate)
  })
})
