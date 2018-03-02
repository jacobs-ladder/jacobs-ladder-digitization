INSERT INTO tb_student_activity
(
    student,
    activity
)
VALUES
(
    1,
    1
);

INSERT INTO tb_activity_cell
(
    student_activity,
    activity_row,
    activity_column,
    data
)
VALUES
(
    1,
    1,
    1,
    '0'
),
(
    1,
    1,
    2,
    'this is a string'
),
(
    1,
    2,
    1,
    '1.123'
),
(
    1,
    2,
    2,
    'another string!'
);
