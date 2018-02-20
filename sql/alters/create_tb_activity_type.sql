CREATE SEQUENCE sq_pk_activity_type;

CREATE TABLE tb_activity_type
(
    activity_type INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_activity_type'),
    label         VARCHAR UNIQUE NOT NULL
);

ALTER TABLE tb_activity ADD COLUMN activity_type INTEGER NOT NULL REFERENCES tb_activity_type;
