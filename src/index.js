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
const github = require('@actions/github')
const { getPackageJson, writePackageJson, generatePrereleaseVersion } = require('./utils')

const preReleaseTag = core.getInput('pre-release-tag')
const packageJsonPath = core.getInput('package-json-path')
let dependenciesToUpdate = core.getInput('dependencies-to-update')
const dependenciesToUpdateVersionTag = core.getInput('dependencies-to-update-version-tag')
const packageName = core.getInput('package-name')
const skipDependenciesToUpdate = core.getInput('skip-dependencies-to-update')
const shaHash = github.context.sha

if (dependenciesToUpdate) {
  dependenciesToUpdate = dependenciesToUpdate.trim().split(',').filter(d => d) // filter empty strings
}

core.info(`pre-release-tag - ${preReleaseTag}`)
core.info(`package-json-path - ${packageJsonPath}`)
core.info(`dependencies-to-update - ${dependenciesToUpdate}`)
core.info(`dependencies-to-update (length)- ${dependenciesToUpdate ? dependenciesToUpdate.length : 0}`)
core.info(`dependencies-to-update-version-tag - ${dependenciesToUpdateVersionTag}`)
core.info(`package-name - ${packageName}`)
core.info(`skip-dependencies-to-update - ${skipDependenciesToUpdate}`)
core.info(`shaHash - ${shaHash}`)

const packageJson = getPackageJson(packageJsonPath)
const preReleaseVersion = generatePrereleaseVersion(packageJson.version, preReleaseTag, shaHash)

// update package.json with:
// 1. pre-release version
// 2. last git commit sha
// 3. package name (if set)
packageJson.version = preReleaseVersion
packageJson.prereleaseSha = shaHash

if (packageName && packageName.trim().length > 0) {
  packageJson.name = packageName
}

// if there are dependencies to update, update with the dependencies version tag
if (skipDependenciesToUpdate || dependenciesToUpdate.length === 0) {
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
