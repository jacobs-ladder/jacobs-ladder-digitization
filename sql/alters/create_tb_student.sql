CREATE SEQUENCE sq_pk_student;

CREATE TABLE tb_student
(
    student       INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_student'),
    first_name    VARCHAR NOT NULL,
    last_name     VARCHAR NOT NULL
    -- columns related to medical profile will be added in a separate alter
);
