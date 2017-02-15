#!/bin/bash
_host=localhost
_port=3306
_database=somedatabase
_user=someuser
#_excludetablenames="_admintools_|_ak_|_akeeba_|_ark_|_wf_|_j2xml_"
_excludetablenames=

mysql -h$_host -P$_port -u$_user -p -e "show tables;" $_database | \
grep -Ev "Tables_in|$_excludetablenames" | \
xargs mysqldump -u$_user -p --no-create-db $_database  | \
gzip > ".$(date +%Y%m%d_%H%M).sql.gz"
