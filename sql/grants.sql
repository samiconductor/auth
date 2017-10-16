grant connect on database auth to authserver;
grant usage on schema public to authserver;
grant select on all tables in schema public to authserver;
grant select, insert on sessions to authserver;
