/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { generatePrereleaseVersion, parseSemanticVersion, getTodaysUTCDate } = require('../src/utils')

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

test('generatePrereleaseVersion', () => {
  const semanticVersion = '1.2.3'
  const prereleaseTag = 'alpha'
  const someDate = '20220101'
  let result

  result = generatePrereleaseVersion(semanticVersion, prereleaseTag)
  expect(result).toEqual(`${semanticVersion}-${prereleaseTag}.${getTodaysUTCDate()}`)

  result = generatePrereleaseVersion(semanticVersion, prereleaseTag, someDate)
  expect(result).toEqual(`${semanticVersion}-${prereleaseTag}.${someDate}`)
})
