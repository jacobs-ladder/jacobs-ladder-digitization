CREATE OR REPLACE FUNCTION fn_create_activity
(
    my_title               VARCHAR,
    my_instructions        VARCHAR,
    my_activity_type_label VARCHAR
)
RETURNS INTEGER AS

$_$
    DECLARE

        my_returned_activity INTEGER;
        my_activity_type     INTEGER;

    BEGIN

        -- look up the pk of the role
        SELECT a.activity_type
          INTO my_activity_type
          FROM tb_activity_type a
         WHERE a.label = my_activity_type_label;

        INSERT INTO tb_activity
        (
            title,
            instructions,
            activity_type
        )
        VALUES
        (
            my_title,
            my_instructions,
            my_activity_type
        )
        RETURNING activity INTO my_returned_activity;

        RETURN my_returned_activity;

    END;
$_$
LANGUAGE 'plpgsql';
