CREATE OR REPLACE FUNCTION fn_create_entity
(
    my_username      VARCHAR,
    my_password      VARCHAR,
    my_first_name    VARCHAR,
    my_last_name     VARCHAR,
    my_email_address VARCHAR,
    my_role_label    VARCHAR
)
RETURNS INTEGER AS

$_$
    DECLARE

        my_password_hash   VARCHAR;
        my_returned_entity INTEGER;
        my_role            INTEGER;

    BEGIN

        -- encrypt the password
        my_password_hash = crypt(my_password, gen_salt('md5'::TEXT));

        -- look up the pk of the role
        SELECT r.role
          INTO my_role
          FROM tb_role r
         WHERE r.label = my_role_label;

        INSERT INTO tb_entity
        (
            username,
            password_hash,
            first_name,
            last_name,
            email_address,
            role
        )
        VALUES
        (
            my_username,
            my_password_hash,
            my_first_name,
            my_last_name,
            my_email_address,
            my_role
        )
        RETURNING entity INTO my_returned_entity;

        RETURN my_returned_entity;

    END;
$_$
LANGUAGE 'plpgsql';
