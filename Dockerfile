FROM mcr.microsoft.com/mssql/server:2017-latest

ARG SA_PASSWORD
ENV SA_PASSWORD=${SA_PASSWORD}
ARG DB_NAME
ENV DB_NAME=${DB_NAME}
ENV ACCEPT_EULA=Y

RUN mkdir /app
COPY ./app/ /app/
RUN chmod +x -R /app/*.sh

#RUN /bin/bash -c "/opt/mssql/bin/sqlservr & /app/provision.sh"

EXPOSE 1433

CMD /bin/bash -c "/app/patch.sh & /opt/mssql/bin/sqlservr"