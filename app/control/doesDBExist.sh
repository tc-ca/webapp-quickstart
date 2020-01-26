export name=$1
/opt/mssql-tools/bin/sqlcmd -l 30 -S localhost,1433 -h-1 -V1 -U sa -P $SA_PASSWORD -Q "
SET NOCOUNT ON
IF DB_ID('$DB_NAME') IS NULL BEGIN
	RAISERROR ('db doesn''t exist!',1,1)
END
" > /dev/null
