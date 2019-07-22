#!/bin/bash
export MSYS_NO_PATHCONV=1
subj="/C=Ca/L=Ottawa/O=Transport Canada/CN=app"
rm -r ./secrets/
mkdir ./secrets/
mkdir ./secrets/idp
mkdir ./secrets/sp

# Setup registry
echo "Setting up registry"
cd ./00-registry/
rm -r certs
mkdir certs
cd certs
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout domain.key -out domain.crt -subj "$subj"
cd ..
cp .env.example .env
cd ..

# Setup httpd 
echo "Setting up httpd"
cd 01-httpd/etc-httpd/
rm -r ssl
mkdir ssl
cd ssl
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout domain.key -out domain.crt -subj "$subj"
cd ../../..

# Setup idp


# Setup sp
rm ./04-sp/etc-shibboleth/sp-cert.pem
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout ./secrets/sp/sp-key.pem -out ./04-sp/etc-shibboleth/sp-cert.pem -subj "$subj"

