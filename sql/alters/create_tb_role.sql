CREATE TABLE tb_role
(
    role  INTEGER PRIMARY KEY,
    label VARCHAR UNIQUE NOT NULL
);

INSERT INTO tb_role
(
    role,
    label
)
VALUES
(
    1,
    'administrator'
),
(
    2,
    'evaluator'
),
(
    3,
    'teacher'
);

-- an entity can have 1 role so we'll add a role column to tb_entity
ALTER TABLE tb_entity ADD COLUMN role INTEGER REFERENCES tb_role;

-- fill in the existing rows with the role "teacher" (since it has the lowest level of permissions)
UPDATE tb_entity
   SET role = (SELECT role FROM tb_role WHERE label = 'teacher');

-- make the column not null once we've filled in the existing rows
ALTER TABLE tb_entity ALTER COLUMN role SET NOT NULL;
