#  (c) Copyright Merative US L.P. and others 2020, 2022
#
#   SPDX-License-Identifer: Apache 2.0
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

# base image built using server/deploy/baseimage/Dockerfile
# must specify correct Docker registry
FROM centos/nodejs-12-centos7:latest AS base

# passed as build-agr
ARG GITHUB_SSH_KEY

### setup ssh key, which is needed to pull private healthpass dependencies
#   1. start ssh-agent
# 2-5. setup GITHUB_SSH_KEY arg as identity file
#   6. add github.com as a known host
RUN eval "$(ssh-agent -s)" && \
   mkdir -p -m 0700 ~/.ssh && \
   echo $GITHUB_SSH_KEY | base64 -d > ~/.ssh/id_rsa && \
   chmod 600 ~/.ssh/id_rsa && \
   ssh-add ~/.ssh/id_rsa && \
   ssh -o StrictHostKeyChecking=no git@github.com || true

COPY config ./config
COPY controllers ./controllers
COPY helpers ./helpers
COPY middleware ./middleware
COPY nosql-db ./nosql-db
COPY routes ./routes
COPY utils ./utils
COPY key-store ./key-store
COPY app.js .
COPY package.json .
COPY package-lock.json .
COPY swagger.json .
# local dev/test only - don't embed .env in container! 
COPY .env .

RUN npm install

VOLUME ["/run"]

ENTRYPOINT [ "npm", "run", "-d", "start" ]
