CREATE SEQUENCE sq_pk_entity;

CREATE TABLE tb_entity
(
    entity        INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_entity'),
    username      VARCHAR UNIQUE NOT NULL,
    password      VARCHAR NOT NULL,
    first_name    VARCHAR NOT NULL,
    last_name     VARCHAR NOT NULL,
    email_address VARCHAR NOT NULL
);
