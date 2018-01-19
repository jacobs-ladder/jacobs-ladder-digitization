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

INSERT INTO tb_activity_row
(
    student_activity,
    title,
    number
)
VALUES
(
    1,
    'row one',
    0
),
(
    1,
    'row two',
    1
),
(
    1,
    'row three',
    2
);

INSERT INTO tb_activity_column
(
    student_activity,
    title,
    number,
    data_type
)
VALUES
(
    1,
    'column one (numeric)',
    0,
    1
),
(
    1,
    'column two (string)',
    1,
    2
),
(
    1,
    'column three (timestamp)',
    2,
    3
),
(
    1,
    'column four (boolean)',
    3,
    4
);

INSERT INTO tb_activity_cell
(
    activity_row,
    activity_column,
    data
)
VALUES
(
    1,
    1,
    '0'
),
(
    1,
    2,
    'this is a string'
),
(
    1,
    3,
    '2017-12-25 12:00:30'
),
(
    1,
    4,
    'True'
),
(
    2,
    1,
    '1.123'
),
(
    2,
    2,
    'another string!'
),
(
    2,
    3,
    '1941-12-7 06:01:37'
),
(
    2,
    4,
    'False'
),
(
    3,
    1,
    '777'
),
(
    3,
    2,
    'last string for this test data$%^&*()'
),
(
    3,
    3,
    '1996-06-15 03:12:12'
),
(
    3,
    4,
    'False'
);
