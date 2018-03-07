CREATE SEQUENCE sq_pk_activity;

CREATE TABLE tb_activity
(
    activity      INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_activity'),
    title         VARCHAR UNIQUE NOT NULL,
    instructions  VARCHAR NOT NULL,
    disabled      BOOLEAN NOT NULL DEFAULT FALSE
    -- the activity_type column will be added in the alter that adds tb_activity_type
);
