#!/usr/bin/env bash

pgpass=`tail --lines=1 .pgpass | cut --delimiter=: --fields=5`

dropdb --if-exists auth
dropuser --if-exists authserver

createdb auth
createuser authserver

psql --no-password --dbname auth \
  --command "alter user authserver with encrypted password '$pgpass'" \
  --file sql/tables.sql \
  --file sql/grants.sql
