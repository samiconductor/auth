-- Up
create table roles (
  id integer primary key,
  name varchar(50) unique not null,
  description varchar(200) default null
);

create table users (
  id integer primary key,
  username varchar(100) unique not null,
  password varchar(60) not null,
  role_id integer not null references roles (id)
);

create table sessions (
  id varchar(36) unique not null,
  user_id integer not null references users (id),
  start_timestamp integer default (strftime('%s', 'now')),
  end_timestamp integer default null,
  expired boolean default 0,
  terminated boolean default 0
);

create table sites (
  id integer primary key,
  name varchar(50) not null,
  domain varchar(100) unique not null
);

create table user_sites (
  id integer primary key,
  user_id integer not null references users (id),
  site_id integer not null references sites (id),
  unique (user_id, site_id)
);

insert into roles (name, description) values
('Admin', 'Access to all sites and auth server management.'),
('User', 'Access to some sites.');

-- Down
drop table user_sites;
drop table sessions;
drop table sites;
drop table users;
drop table roles;
