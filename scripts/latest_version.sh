#!/bin/bash
# Copyright © 2022 sealos.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

fetchURL="https://raw.githubusercontent.com/labring/sealos/refs/heads/main/.tagpr.json"

PRE_VERSION=$(curl -s ${fetchURL} | jq -r '".pre-version"')
TAG=$(curl -s ${fetchURL} | jq -r '.version')

## check version is release version
if [[ ${TAG} =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "!!!!! is release version, will update docs"
    sed -i "s#${PRE_VERSION}#${TAG}#g" content/docs/self-hosting/install.zh-cn.mdx
else
    echo "!!!!! is not release version, will skip update docs"
fi