#!/bin/bash
echo "This will delete existing credentials and metadata!"
echo "Windows users: make sure this is running in winpty"
echo "Linux users: this might need to be run as root since the folders the docker process creates aren't managed by the normal user"
read -p "Press enter to continue"

# Breaks on windows unless this is set
export MSYS_NO_PATHCONV=1
# Autofill value for openssh subjects
subj="/CN=webapp"

rm -rf ./out/ || true
rm -rf ./secrets/ || true
mkdir ./secrets/
mkdir ./secrets/idp
mkdir ./secrets/sp
mkdir ./out/




#
# Setup registry
#
printf "\n\nSetting up registry\n"
cd ./00-registry/
rm -r certs || true
mkdir certs
cd certs
# TLS cert
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout domain.key -out domain.crt -subj "$subj" 
cd ..
cp .env.example .env
cd ..




#
# Setup httpd 
#
printf "\n\nSetting up httpd\n"
cd 01-httpd/etc-httpd/
rm -r ./ssl/ || true
mkdir ssl
cd ssl
# TLS cert
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout domain.key -out domain.crt -subj "$subj" 
cd ../../..




#
# Setup idp
#
printf "\n\nSetting up IdP\n"
rm -r ./03-idp/shibboleth-idp/credentials/ || true
mkdir ./03-idp/shibboleth-idp/credentials/

# Run unicon setup script
echo "Running unicon setup."
echo "Expected domain: webapp"
docker run -it -v $(pwd)/out:/ext-mount --rm unicon/shibboleth-idp init-idp.sh
	# Copy results to proper locations
mkdir ./03-idp/shibboleth-idp/credentials/
mkdir ./03-idp/shibboleth-idp/metadata/
mv ./out/customized-shibboleth-idp/credentials/{idp-backchannel.crt,idp-encryption.crt,idp-signing.crt,sealer.kver} ./03-idp/shibboleth-idp/credentials/
mv ./out/customized-shibboleth-idp/credentials/* ./secrets/idp/
mv ./out/customized-shibboleth-idp/metadata/idp-metadata.xml ./03-idp/shibboleth-idp/metadata/idp-metadata.xml
	# Remove validUntil from idp metadata
sed -ie 's/validUntil="[^"]*" //' 03-idp/shibboleth-idp/metadata/idp-metadata.xml
read -s -p "Re-enter backchannel password for compose:" backchannel
printf "\n"

# Create idp browser keystore
cd ./secrets/idp/
openssl req -x509 -sha256 -nodes -days 256 -newkey rsa:2048 -keyout idp-browser.pem -out idp-browser.crt -subj "$subj" 
read -s -p "Enter browser keystore password: " browser
printf "\n"
openssl pkcs12 -inkey idp-browser.pem -in idp-browser.crt -export -out idp-browser.p12 -passout pass:${browser} 
cd ../..

# Add store passwords to compose
sed -i "s/JETTY_BROWSER_SSL_KEYSTORE_PASSWORD: .*/JETTY_BROWSER_SSL_KEYSTORE_PASSWORD: ${browser}/" docker-compose.yml
sed -i "s/JETTY_BACKCHANNEL_SSL_KEYSTORE_PASSWORD: .*/JETTY_BACKCHANNEL_SSL_KEYSTORE_PASSWORD: ${backchannel}/" docker-compose.yml


# Transfer idp.properties
sed -i "s/idp.scope=.*/idp.scope= $( \
	 grep -Eow "idp.scope=(.*)" \
		./out/customized-shibboleth-idp/conf/idp.properties \
		| sed 's/idp.scope=//' \
	)/" ./03-idp/shibboleth-idp/conf/idp.properties 
sed -i "s/idp.sealer.storePassword=.*/idp.sealer.storePassword= $( \
	 grep -Eow "idp.sealer.storePassword=(.*)" \
		./out/customized-shibboleth-idp/conf/idp.properties \
		| sed 's/idp.sealer.storePassword=//' \
	)/" ./03-idp/shibboleth-idp/conf/idp.properties 
sed -i "s/idp.sealer.keyPassword=.*/idp.sealer.keyPassword= $( \
	 grep -Eow "idp.sealer.keyPassword=(.*)" \
		./out/customized-shibboleth-idp/conf/idp.properties \
		| sed 's/idp.sealer.keyPassword=//' \
	)/" ./03-idp/shibboleth-idp/conf/idp.properties 




#
# Setup sp
#
printf "\n\nSetting up SP\n"
rm ./04-sp/etc-shibboleth/sp-cert.pem

# SP key
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout ./secrets/sp/sp-key.pem -out ./04-sp/etc-shibboleth/sp-cert.pem -subj "$subj" 
chown :docker ./secrets/sp/sp-key.pem
chmod o+r ./secrets/sp/sp-key.pem

# Fetch new metadata
echo "Retrieving SP metadata, expecting availability on localhost"
	( rm ./03-idp/shibboleth-idp/metadata/sp-metadata.xml  || true ) \
&& 	docker-compose up -d --build sp \
&& 	bash -c 'while [[ "$(curl --insecure -s -o /dev/null -w ''%{http_code}'' https://localhost/Shibboleth.sso/Metadata)" != "200" ]]; do sleep 5; done' \
&&	curl -o ./03-idp/shibboleth-idp/metadata/sp-metadata.xml https://localhost/Shibboleth.sso/Metadata --insecure \
&&  docker-compose stop sp




#
# Cleanup
#
echo "Cleanup"
# rm -r ./out/




#
# Finish
#
echo "Secrets have been regenerated!"
echo "Remember to rebuild next compose"