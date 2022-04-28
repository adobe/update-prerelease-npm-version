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

const core = require('@actions/core')
const github = require('@actions/github')
const { getPackageJson, writePackageJson, generatePrereleaseVersion } = require('./utils')

const preReleaseTag = core.getInput('pre-release-tag')
const packageJsonPath = core.getInput('package-json-path')
const dependenciesToUpdate = core.getInput('dependencies-to-update').trim().split(',')
const dependenciesToUpdateVersionTag = core.getInput('dependencies-to-update-version-tag')
const shaHash = github.context.sha

core.debug('pre-release-tag', dependenciesToUpdate)
core.debug('package-json-path', dependenciesToUpdate)
core.debug('dependencies-to-update', dependenciesToUpdate)
core.debug('dependencies-to-update-version-tag', dependenciesToUpdateVersionTag)
core.debug('shaHash', shaHash)

const packageJson = getPackageJson(packageJsonPath)
const preReleaseVersion = generatePrereleaseVersion(packageJson.version, preReleaseTag, shaHash)

// update package.json with pre-release version, last git commit sha
packageJson.version = preReleaseVersion
packageJson.prereleaseSha = shaHash

// if there are dependencies to update, update with the dependencies version tag
if (dependenciesToUpdate.length === 0) {
  core.info('no dependencies to update')
} else {
  dependenciesToUpdate.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      core.info(`updating dependency '${dep}' version to '${dependenciesToUpdateVersionTag}'`)
      packageJson.dependencies[dep] = dependenciesToUpdateVersionTag
    } else {
      core.error(`dependency ${dep} was not found in the package.json file.`)
    }
  })
}

// write the modified package.json
writePackageJson(packageJsonPath, JSON.stringify(packageJson, null, 2))

core.setOutput('pre-release-version', preReleaseVersion)
