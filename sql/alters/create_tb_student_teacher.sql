CREATE SEQUENCE sq_pk_student_teacher;

CREATE TABLE tb_student_teacher
(
    student_teacher INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_student_teacher'),
    student         INTEGER NOT NULL REFERENCES tb_student,
    teacher         INTEGER NOT NULL REFERENCES tb_entity CHECK (fn_entity_is_teacher(teacher)),
    UNIQUE (student, teacher)
);
