-- Up
create table users (
  id integer primary key,
  username varchar(100) unique not null,
  password blob not null
);

-- Down
drop table if exists users;
