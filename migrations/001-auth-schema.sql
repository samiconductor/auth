-- Up
create table domains (
  id integer primary key,
  domain varchar(100) unique not null
);

create table sites (
  id integer primary key,
  domain_id integer not null references domains (id),
  subdomain varchar(100) not null,
  name varchar(50) not null
);

create table users (
  id integer primary key,
  username varchar(100) unique not null,
  password varchar(60) not null
);

create table user_sites (
  id integer primary key,
  user_id integer not null references users (id),
  site_id integer not null references sites (id),
  unique (user_id, site_id)
);

create table privs (
  id integer primary key,
  name varchar(50) unique not null,
  description varchar(200) default null
);

create table user_privs (
  id integer primary key,
  user_id integer not null references users (id),
  priv_id integer not null references privs (id),
  unique (user_id, priv_id)
);

create table sessions (
  id varchar(36) unique not null,
  user_id integer not null references users (id),
  start_timestamp integer default (strftime('%s', 'now')),
  end_timestamp integer default null,
  expired boolean default 0,
  terminated boolean default 0
);

insert into privs (name, description) values
('Admin', 'Allowed to manage the auth server.'),
('Sites', 'Access to all sites.');

-- Down
drop table user_sites;
drop table user_privs;
drop table sessions;
drop table sites;
drop table domains;
drop table users;
drop table privs;
