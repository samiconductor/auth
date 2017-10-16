create table if not exists users (
  id serial primary key,
  username varchar(100) unique not null,
  password varchar(60) not null
);

create table if not exists scopes (
  id serial primary key,
  name varchar(50) unique not null,
  description varchar(200) default null
);

create table if not exists user_scopes (
  id serial primary key,
  user_id integer not null references users (id),
  scope_id integer not null references scopes (id),
  unique (user_id, scope_id)
);

create table if not exists sessions (
  id varchar(36) unique not null,
  user_id integer not null references users (id),
  start_timestamp integer default extract(epoch from current_timestamp),
  end_timestamp integer default null
);
