@echo off
::########################################################################
::
:: Creation of a SQLServer DB from official Microsoft image
::
:: Requirements:
::	- Docker installed
::	- Account created in Docker Hub
::
:: Documentation:
::	- https://docs.microsoft.com/es-es/sql/linux/tutorial-restore-backup-in-sql-server-container?view=sql-server-ver16
::	
::########################################################################
::
:: -----------------------------------------------------------------------
:: Variables
:: -----------------------------------------------------------------------
:: Environment
set ENVIRONMENT=DESA
:: SQLServer Image Version
set VERSION_SQLSERVER=2019-latest
:: SA Password
set MSSQL_SA_PASSWORD=YourStrong!Passw0rd
:: New SA Password
set NEW_MSSQL_SA_PASSWORD=MGK4yr0s08!
:: Volumen
set VOLUMEN_MSQL=%ENVIRONMENT%_ecommerceB2B_MSQL_Data
:: Server Name
set NAME_SERVER=%ENVIRONMENT%_ecommerceB2B_MSQL_Server
::
:: -----------------------------------------------------------------------
:: Jobs
:: -----------------------------------------------------------------------
echo -----------------------------------------------------------
echo 1.- Docker image extraction
echo -----------------------------------------------------------
::
docker pull mcr.microsoft.com/mssql/server:%VERSION_SQLSERVER%
::
echo -----------------------------------------------------------
echo 2.- Activation and configuration Docker image
echo -----------------------------------------------------------
:: 
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=%MSSQL_SA_PASSWORD%" --name "%NAME_SERVER%" -p 1402:1433 -v %VOLUMEN_MSQL%:/var/opt/mssql -d mcr.microsoft.com/mssql/server:%VERSION_SQLSERVER%
:: 
echo -----------------------------------------------------------
echo 3.- Slow down the process
echo -----------------------------------------------------------
timeout /t 10
:: 
echo -----------------------------------------------------------
echo 4.- Change password SA
echo -----------------------------------------------------------
:: 
docker exec -it "%NAME_SERVER%" /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "%MSSQL_SA_PASSWORD%" -Q "ALTER LOGIN SA WITH PASSWORD='%NEW_MSSQL_SA_PASSWORD%'"
echo Successfull!
echo -----------------------------------------------------------
echo Data summary - %ENVIRONMENT%
echo -----------------------------------------------------------
echo - SQLServer Image Version : %VERSION_SQLSERVER%
echo - Name Server             : %NAME_SERVER%
echo - TCP/IP                  : 1402:1433 
echo - Volumen                 : %VOLUMEN_MSQL%
echo - SA Password             : %NEW_MSSQL_SA_PASSWORD%
echo.