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
const fs = require('fs')
const path = require('path')

/**
 * Get package.json contents as json
 *
 * @param {string} filePath the file path to the package.json file
 * @returns {object} the package.json contents as json
 */
function getPackageJson (filePath) {
  const npath = path.normalize(filePath)
  const foptions = { encoding: 'utf-8' }

  const contents = fs.readFileSync(npath, foptions)
  return JSON.parse(contents)
}

/**
 * Write the object to the package.json file
 *
 * @param {string} filePath the file path to the package.json file
 * @param {string} data the data to write to the file
 */
function writePackageJson (filePath, data) {
  const npath = path.normalize(filePath)
  const foptions = { encoding: 'utf-8' }

  fs.writeFileSync(npath, data, foptions)
}

/**
 * Parses the semantic version.
 *
 * @param {string} semanticVersion the semantic version
 * @returns {Array} tuple of major, minor, patch version numbers
 */
function parseSemanticVersion (semanticVersion) {
  const sv = semverParse(semanticVersion, { includePrerelease: true })
  return [sv.major, sv.minor, sv.patch]
}

/**
 * Gets today's UTC date string.
 *
 * @returns {string} today's UTC date in  YYYYMMDD format
 */
function getTodaysUTCDate () {
  return new Date().toISOString().split('T')[0]
}

/**
 * Generate a prerelease version based on the semantic version, a prerelease tag, and the current date.
 *
 * Example: if the version is 1.2.3, and the prerelease tag is nightly, and the date is 20220420,
 * the return value is 1.2.3-nightly.20220420
 *
 * @param {string} semanticVersion the semantic version
 * @param {string} prereleaseTag the tag to use for the prerelease version
 * @param {string} shaHash the git repo shaHash for the pre-release version
 * @param {string} [utcDate=today's utc date] the UTC date (YYYYMMDD)
 * @returns {string} the new prerelease version
 */
function generatePrereleaseVersion (semanticVersion, prereleaseTag, shaHash, utcDate = getTodaysUTCDate()) {
  const [majorVersion, minorVersion, patchVersion] = parseSemanticVersion(semanticVersion)
  const truncatedShaHash = shaHash.substring(0, 8)

  return `${majorVersion}.${minorVersion}.${patchVersion}-${prereleaseTag}.${utcDate}.${truncatedShaHash}`
}

module.exports = {
  parseSemanticVersion,
  generatePrereleaseVersion,
  getTodaysUTCDate,
  getPackageJson,
  writePackageJson
}
