<!-- 
Copyright 2022 Adobe. All rights reserved.
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

- generates a pre-release version string with the current date in YYYYMMDD, and the `sha` hash of the latest commit
  - for example if your current version is `1.2.3`, the pre-release tag is `pre`,the date is `2022-04-25` (April 25th, 2022), and the `sha` commit (first 8 characters) is `abcde123` the pre-release version will be `1.2.3-pre.20220425.abcde123`
- modifies your `package.json` **version** property with this generated pre-release version string
- adds a **prereleaseSha** property to your `package.json`. This contains the latest SHA commit of the repo prior to publishing
- outputs the generated pre-release version string as `pre-release-version`

# Usage

See [action.yml](action.yml)

**Basic:**

```yaml
steps:
- uses: adobe/update-prerelease-npm-version@v1.0.0
  with:
    pre-release-tag: pre
    package-json-path: package.json
# then you publish your package with this pre-release version, under a tag (say 'next' here)
- run: npm publish --tag next
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
