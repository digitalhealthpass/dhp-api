#!/bin/bash

TAG=aon3
GITHUB_SSH_KEY=$(cat ~/.ssh/id_rsa_gh | base64 | tr -d \\n)
IC_API_KEY=
IC_ACC_ID=

# login to cloud 
ibmcloud login -a https://cloud.ibm.com -r us-east --apikey $IC_API_KEY -c $IC_ACCOUNT_ID
ibmcloud cr login

# primary registry is located in us-south
ibmcloud target -r us-south

# docker agent login 
echo -n $IC_API_KEY |docker login us.icr.io --username iamapikey --password-stdin

# build and push
docker build --build-arg GITHUB_SSH_KEY="${GITHUB_SSH_KEY}" -t us.icr.io/dev-hpass-rns/credential-issuer-api:${TAG} .
docker push us.icr.io/dev-hpass-rns/credential-issuer-api:${TAG}
