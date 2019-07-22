#!/bin/bash
export MSYS_NO_PATHCONV=1
subj="/C=Ca/L=Ottawa/O=Transport Canada/CN=app"

# Setup registry
cd ./00-registry/
rm -r certs
mkdir certs
cd certs
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout domain.key -out domain.crt -subj "$subj"
cd ..
cp .env.example .env
cd ..


