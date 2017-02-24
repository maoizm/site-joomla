SETLOCAL
SET _host=localhost
SET _port=3306
SET _database=somedatabase
SET _user=someuser
REM SET _excludetablenames="_admintools_|_ak_|_akeeba_|_ark_|_wf_|_j2xml_"
SET _excludetablenames=

@REM backslash-terminated or empty if mqsql.exe is already in the PATH
@REM eg.: SET _mysqlpath=D:\mysql5.5.9\
SET _mysqlpath=

@ECHO OFF
FOR /F "delims=" %%i IN ('date /t') DO set _date=%%i
FOR /F "delims=" %%i IN ('time /t') DO set _time=%%i
SET "_timestamp=%_date:~6,4%%_date:~3,2%%_date:~0,2%_%_time::=%"
@ECHO ON

%_mysqlpath%mysql -h%_host% -P%_port% -u%_user% -pdev -e "show tables;" %_database%  | ^
grep -Ev "Tables_in|%_excludetablenames:~1,-1%"                                      | ^
xargs %_mysqlpath%mysqldump -P%_port% -u%_user% -pdev --no-create-db %_database%     | ^
gzip > ".%_timestamp%.sql.gz"
