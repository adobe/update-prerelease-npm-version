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

# update-nightly-npm-version

A Github Action to create and publish your node module as a nightly version.

This action provides the following functionality for GitHub Actions users:

- appends a pre-release tag with the current date in YYYYMMDD
  - for example if your current version is 1.2.3, the pre-release tag is "nightly" and the date is 2022-04-25 (April 25th, 2022) the pre-release version will be 1.2.3-nightly.20220425
- publishes

# Usage

See [action.yml](action.yml)

**Basic:**

```yaml
steps:
- uses: adobe/update-nightly-npm-version@v1
  with:
    pre-release-tag: nightly
    package-json-path: package.json
- run: npm publish --tag next
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.