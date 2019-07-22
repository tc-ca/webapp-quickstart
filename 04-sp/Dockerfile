FROM dom-registry:50000/cdp/idp:prod as idp-stage

FROM unicon/shibboleth-sp

RUN yum -y update \
    && yum -y install php mod_ssl   

COPY etc-shibboleth /etc/shibboleth/
COPY etc-httpd/ /etc/httpd/
COPY var-www-html/ /var/www/html/
COPY --from=idp-stage /opt/shibboleth-idp/metadata/idp-metadata.xml /etc/shibboleth/idp-metadata.xml
