echo "Waiting for MS SQL to be available ⏳"
/opt/mssql-tools/bin/sqlcmd -l 30 -S localhost,1433 -h-1 -V1 -U sa -P $SA_PASSWORD -Q "SET NOCOUNT ON SELECT @@servername" > /dev/null
is_up=$?
while [ $is_up -ne 0 ] ; do 
	echo "Waiting for MS SQL to be available ⏳"
	sleep 5 
	/opt/mssql-tools/bin/sqlcmd -l 30 -S localhost,1433 -h-1 -V1 -U sa -P $SA_PASSWORD -Q "SET NOCOUNT ON SELECT @@servername" > /dev/null
	is_up=$?
done

/opt/mssql-tools/bin/sqlcmd -l 30 -S localhost,1433 -h-1 -V1 -U sa -P $SA_PASSWORD -Q "
IF DB_ID('app') IS NOT NULL BEGIN
	RAISERROR ('CDP Database already provisioned!',1,1)
	rollback transaction
END" > /dev/null

if [ $? -ne 0 ] ; then
	echo "Server is already provisioned!" >&1 | tee provision.log
else 
	echo "Server is up!"
	# /opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U SA -P $SA_PASSWORD -l 30 -e -i /app/asd.sql -o /app/asd.log
	/opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U SA -P $SA_PASSWORD -l 30 -e -i /app/scripts/*.sql
	echo "Server is provisioned!"
fi
