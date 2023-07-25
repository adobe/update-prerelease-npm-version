<!-- 
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->

# update-prerelease-npm-version

A Github Action to update your node module version with a prerelease version.

This action provides the following functionality for GitHub Actions users:

- generates a pre-release version string with a tag, the current date in YYYY-MM-DD, and the `sha` hash of the latest commit
  - for example if your current version is `1.2.3`, the pre-release tag is `pre`,the date is `2022-04-25` (April 25th, 2022 UTC), and the `sha` commit (first 8 characters) is `abcde123` the pre-release version will be `1.2.3-pre.2022-04-25.sha-abcde123`
- modifies your `package.json` **version** property with this generated pre-release version string
- adds a **prereleaseSha** property to your `package.json`. This contains the latest SHA commit of the repo prior to publishing
- outputs the generated pre-release version string into the `pre-release-version` output variable

## Usage

See [action.yml](action.yml)

**Basic:**

```yaml
steps:
- name: Update your package.json with an npm pre-release version
  id: pre-release-version
  uses: adobe/update-prerelease-npm-version@v1.0.0
  with:
    # if not specified, use the default "pre" (optional)
    pre-release-tag: 'mytag' 
    # if not specified, use the default "package.json" (optional)
    package-json-path: 'some/path/package.json'
    # if specified, it will find the dependencies in package.json and update with the dependencies-to-update-version-tag
    dependencies-to-update: semver,to-camel-case
    # the version tag to update the dependencies-to-update list with
    dependencies-to-update-version-tag: next
    # the package name to publish to (optional)
    package-name: @adobe/my-cli-next
    # the package name to publish to (optional)
    skip-dependencies-to-update: false

# your package.json version should be transformed after the previous step
- run: cat package.json
# access the pre-release version output. output variable is "pre-release-version"
- run: echo ${{ steps.pre-release-version.outputs.pre-release-version }} 
# then you publish your package with this pre-release version, under a tag (say 'next' here)
- run: npm publish --tag next
```

## Development

- Don't forget to run `npm run package` to generate package your new code for use, before publishing.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
