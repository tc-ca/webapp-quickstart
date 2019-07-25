FROM mcr.microsoft.com/mssql/server:2017-latest

ARG SA_PASSWORD
ENV SA_PASSWORD=${SA_PASSWORD}
ENV ACCEPT_EULA=Y

COPY . /app

RUN chmod +x /app/provision.sh
RUN /bin/sh -c "/opt/mssql/bin/sqlservr & /app/provision.sh"

EXPOSE 1433
