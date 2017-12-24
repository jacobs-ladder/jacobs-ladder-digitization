CREATE TABLE tb_data_type -- a data type that we store in the database
(
    data_type INTEGER PRIMARY KEY,
    label     VARCHAR UNIQUE NOT NULL
);

INSERT INTO tb_data_type
(
    data_type,
    label
)
VALUES
(
    1,
    'numeric'
),
(
    2,
    'string'
),
(
    3,
    'timestamp'
),
(
    4,
    'boolean'
);
