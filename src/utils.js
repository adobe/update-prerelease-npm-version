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

const semverParse = require('semver/functions/parse')

/**
 * Parses the semantic version.
 *
 * @param {string} semanticVersion the semantic version
 * @returns {Array} tuple of major, minor, patch version numbers
 */
function parseSemanticVersion (semanticVersion) {
  const sv = semverParse(semanticVersion)
  return [sv.major, sv.minor, sv.patch]
}

/**
 * Generate a prerelease version based on the semantic version, a prerelease tag, and the current date.
 *
 * Example: if the version is 1.2.3, and the prerelease tag is nightly, and the date is 20220420,
 * the return value is 1.2.3-nightly.20220420
 *
 * @param {string} semanticVersion the semantic version
 * @param {string} prereleaseTag the tag to use for the prerelease version
 * @returns {string} the new prerelease version
 */
function generatePrereleaseVersion (semanticVersion, prereleaseTag) {
  const [majorVersion, minorVersion, patchVersion] = parseSemanticVersion(semanticVersion)

  // YYYYMMDD
  const utcDate = new Date().toISOString().split('T')[0]

  return `${majorVersion}.${minorVersion}.${patchVersion}-${prereleaseTag}.${utcDate}`
}

module.exports = {
  parseSemanticVersion,
  generatePrereleaseVersion
}
