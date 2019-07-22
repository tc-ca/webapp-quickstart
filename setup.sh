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
rm -r ./ssl/
mkdir ssl
cd ssl
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout domain.key -out domain.crt -subj "$subj"
cd ../../..

# Setup idp
rm -r ./03-idp/shibboleth-idp/credentials/
mkdir ./03-idp/shibboleth-idp/credentials/
openssl req -x509 -sha256 -nodes -days 256 -newkey rsa:2048 -keyout ./secrets/idp/idp-backchannel.p12 -out ./03-idp/shibboleth-idp/credentials/idp-backchannel.crt -subj "$subj"
openssl req -x509 -sha256 -nodes -days 256 -newkey rsa:2048 -keyout ./secrets/idp/idp-encryption.p12 -out ./03-idp/shibboleth-idp/credentials/idp-encryption.crt -subj "$subj"
openssl req -x509 -sha256 -nodes -days 256 -newkey rsa:2048 -keyout ./secrets/idp/idp-signing.p12 -out ./03-idp/shibboleth-idp/credentials/idp-signing.crt -subj "$subj"
openssl req -x509 -sha256 -nodes -days 256 -newkey rsa:2048 -keyout ./secrets/idp/idp-browser.p12 -subj "$subj"
openssl req -x509 -sha256 -nodes -days 256 -newkey rsa:2048 -keyout ./secrets/idp/sealer.jks -out ./03-idp/shibboleth-idp/credentials/sealer.kver -subj "$subj"
cd ./03-idp/shibboleth-idp/
rm ./metadata/idp-metadata.xml
rm ./metadata/sp-metadata.xml
rm ./metadata/ssp-metadata.xml
cp ./metadata/idp-metadata.xml.example ./metadata/idp-metadata.xml
cp ./metadata/sp-metadata.xml.example ./metadata/sp-metadata.xml
cp ./metadata/ssp-metadata.xml.example ./metadata/ssp-metadata.xml
# awk 'BEGIN{getline l < "./credentials/idp-backchannel.crt"}/@BACKCHANNEL@/{gsub("@BACKCHANNEL@",l)}1' ./metadata/idp-metadata.xml
sed -i -e '/@BACKCHANNEL@/{r ./credentials/idp-backchannel.crt' -e 'd}' ./metadata/idp-metadata.xml
sed -i -e '/@IDPSIGNING@/{r ./credentials/idp-signing.crt' -e 'd}' ./metadata/idp-metadata.xml
sed -i -e '/@IDPENCRYPTION@/{r ./credentials/idp-encryption.crt' -e 'd}' ./metadata/idp-metadata.xml
cd ../..

# Setup sp
rm ./04-sp/etc-shibboleth/sp-cert.pem
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout ./secrets/sp/sp-key.pem -out ./04-sp/etc-shibboleth/sp-cert.pem -subj "$subj"
sed -i -e '/@SPCERT@/{r ./04-sp/etc-shibboleth/sp-cert.pem' -e 'd}' ./03-idp/shibboleth-idp/metadata/sp-metadata.xml

