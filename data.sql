
CREATE EXTENSION "uuid-ossp";


CREATE TABLE users (
  id         uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  username   text NOT NULL UNIQUE,
  favorites  integer NOT NULL DEFAULT 0,
  followers  integer NOT NULL DEFAULT 0,
  following  integer NOT NULL DEFAULT 0,
  mentions   integer NOT NULL DEFAULT 0,
  tweets     integer NOT NULL DEFAULT 0,
  created    timestamptz NOT NULL DEFAULT current_timestamp,
  updated    timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE tweets (
  id         uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL,
  post       text NOT NULL,
  favorites  integer NOT NULL DEFAULT 0,
  replies    integer NOT NULL DEFAULT 0,
  retweets   integer NOT NULL DEFAULT 0,
  mentions   text[] NOT NULL DEFAULT '{}',
  tags       text[] NOT NULL DEFAULT '{}',
  created    timestamptz NOT NULL DEFAULT current_timestamp,
  updated    timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE replies (
  tweet_id  uuid NOT NULL,
  reply_id  uuid NOT NULL,
  PRIMARY KEY(tweet_id, reply_id)
);

ALTER TABLE replies
  ADD CONSTRAINT tweet_fk FOREIGN KEY (tweet_id) REFERENCES tweets (id)
  MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE tweets
  ADD CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users(id)
  MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE replies
  ADD CONSTRAINT reply_fk FOREIGN KEY (reply_id) REFERENCES tweets (id)
  MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;



CREATE FUNCTION parse_tokens(content text, prefix text)
  RETURNS text[] AS $$
    DECLARE
      regex text;
      matches text;
      subquery text;
      captures text;
      tokens text[];
    BEGIN
      regex := prefix || '(\S+)';
      matches := 'regexp_matches($1, $2, $3) as captures';
      subquery := '(SELECT ' || matches || ' ORDER BY captures) as matches';
      captures := 'array_agg(matches.captures[1])';

      EXECUTE 'SELECT ' || captures || ' FROM ' || subquery
      INTO tokens
      USING LOWER(content), regex, 'g';

      IF tokens IS NULL THEN
        tokens = '{}';
      END IF;

      RETURN tokens;
    END;
  $$ LANGUAGE plpgsql STABLE;

CREATE FUNCTION parse_tags_from_post()
RETURNS trigger AS $$
  BEGIN
    NEW.tags = parse_tokens(NEW.post, '#');
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER parse_taggings
BEFORE INSERT OR UPDATE ON tweets
FOR EACH ROW EXECUTE PROCEDURE parse_tags_from_post();


CREATE TABLE songappusers(
  id uuid primary key default uuid_generate_v4(),
  username text not null unique,
  first_name text not null,
  last_name text not null,
  email text not null ,
  from text not null,
  avatar text not null,
  username text not null
)

CREATE TABLE songs(
  id uuid primary key default uuid_generate_v4(),
  songname text not null,
  userid text not null,
  trackid text not null,
  tags  text[] NOT NULL DEFAULT '{}',
  duration text not null,
  cover_image_url text

);

ALTER TABLE songs
  ADD CONSTRAINT songs_fk FOREIGN KEY (userid) REFERENCES songappusers(username)
  MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;

create index on songs(songname);
create index on songs(userid);
create index on songappusers(username);
create index on songappusers(first_name);
create index on songappusers(last_name);