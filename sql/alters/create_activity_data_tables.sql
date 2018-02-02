CREATE SEQUENCE sq_pk_student_activity;

CREATE TABLE tb_student_activity -- an activity page in a student's binder
(
    student_activity INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_student_activity'),
    student          INTEGER REFERENCES tb_student  NOT NULL,
    activity         INTEGER REFERENCES tb_activity NOT NULL,
    UNIQUE(student, activity)
);


CREATE SEQUENCE sq_pk_activity_row;

CREATE TABLE tb_activity_row -- a row on an activity page
(
    activity_row     INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_activity_row'),
    student_activity INTEGER REFERENCES tb_student_activity NOT NULL,
    title            VARCHAR NOT NULL, -- the text in the left hand column of this row
    number           INTEGER NOT NULL  -- the number of this row in the grid. Top row of cells is 0
);


CREATE SEQUENCE sq_pk_activity_column;

CREATE TABLE tb_activity_column
(
    activity_column  INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_activity_column'),
    student_activity INTEGER REFERENCES tb_student_activity NOT NULL,
    title            VARCHAR NOT NULL, -- the text in the top row of this row
    number           INTEGER NOT NULL, -- the number of this column in the grid. Left column of cells is 0
    data_type        INTEGER REFERENCES tb_data_type NOT NULL -- tells us how to interpret the string thats in the data column
);


CREATE SEQUENCE sq_pk_activity_cell;

CREATE TABLE tb_activity_cell
(
    activity_cell   INTEGER PRIMARY KEY DEFAULT nextval('sq_pk_activity_cell'),
    -- these two columns help us identify where in the table this cell should be
    activity_row    INTEGER REFERENCES tb_activity_row NOT NULL,
    activity_column INTEGER REFERENCES tb_activity_column NOT NULL,
    -- the data itself, stored in string form because we could have multiple data types
    data            VARCHAR,
    UNIQUE(activity_row, activity_column)
);