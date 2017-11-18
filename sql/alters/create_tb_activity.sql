CREATE SEQUENCE sq_pk_activity;

CREATE TABLE tb_activity
(
    activity      INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_activity'),
    title         VARCHAR UNIQUE NOT NULL,
    description   VARCHAR NOT NULL
    -- the activity_type column will be added in the alter that adds tb_activity_type
);
