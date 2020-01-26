/opt/mssql-tools/bin/sqlcmd -l 30 -S localhost,1433 -h-1 -V1 -U sa -P $SA_PASSWORD -Q "
SET NOCOUNT ON
USE [$DB_NAME]
GO

IF OBJECT_ID('PATCH_HISTORY') IS NULL BEGIN
	RAISERROR ('Patch history is missing!',1,1)
END
" > /dev/null
