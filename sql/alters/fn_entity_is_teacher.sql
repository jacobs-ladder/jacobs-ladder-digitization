CREATE OR REPLACE FUNCTION fn_entity_is_teacher
(
    my_entity INTEGER
)
RETURNS BOOLEAN AS

-- returning TRUE if the role of the input entity is that of a teacher
-- returning FALSE otherwise

$_$
    SELECT r.label = 'teacher'
      FROM tb_entity e
      JOIN tb_role r
        ON e.role = r.role
     WHERE e.entity = my_entity;
$_$
LANGUAGE 'sql';

