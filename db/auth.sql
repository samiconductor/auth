create table if not exists users (
  id integer primary key,
  username varchar(100) unique not null,
  password varchar(60) not null
);

create table if not exists scopes (
  id integer primary key,
  name varchar(50) not null,
  description varchar(200) default null,
  admin boolean default false,
  super boolean default false
);

create table if not exists user_scopes (
  id integer primary key,
  user_id integer not null references users (id),
  scope_id integer not null references scopes (id),
  unique (user_id, scope_id)
);

create table if not exists sessions (
  id varchar(36) unique not null,
  user_id integer not null references users (id),
  start_timestamp integer default (strftime('%s', 'now')),
  end_timestamp integer default null
);

insert into users (username, password) values (
  'test', '$2a$10$1Jw23nukt5GcUGDRT.S.xejsxYr6jEhagdtYahco1YUGd9qQxT3dG'
);
