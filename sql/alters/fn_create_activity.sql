CREATE OR REPLACE FUNCTION fn_create_activity
(
    my_title               VARCHAR,
    my_instructions        VARCHAR,
    my_activity_type_label VARCHAR,
    my_columns_and_rows    JSON
)
RETURNS INTEGER AS

$_$
    DECLARE

        my_returned_activity INTEGER;
        my_activity_type     INTEGER;
        my_column            JSON;
        my_column_data_type  INTEGER;
        my_row               JSON;

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

        -- create the columns for this activity
        FOR my_column IN
            SELECT json_array_elements(my_columns_and_rows->'columns')
        LOOP

            SELECT dt.data_type
              INTO my_column_data_type
              FROM tb_data_type dt
             WHERE dt.label = my_column->>'data_type';

            INSERT INTO tb_activity_column
            (
                activity,
                title,
                number,
                data_type
            )
            VALUES
            (
                my_returned_activity,
                my_column->>'title',
                (my_column->>'number')::INTEGER,
                my_column_data_type
            );

        END LOOP;

        -- create the rows for this activity
        FOR my_row IN
            SELECT json_array_elements(my_columns_and_rows->'rows')
        LOOP

            INSERT INTO tb_activity_row
            (
                activity,
                title,
                number
            )
            VALUES
            (
                my_returned_activity,
                my_row->>'title',
                (my_row->>'number')::INTEGER
            );

        END LOOP;

        RETURN my_returned_activity;

    END;
$_$
LANGUAGE 'plpgsql';
