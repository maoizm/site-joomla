SETLOCAL
SET _host=localhost
SET _port=3306
SET _database=somedatabase
SET _user=someuser

gzip -d < %1 | mysql -h%_host% -P%_port% -u%_user% -p --database=%_database%
