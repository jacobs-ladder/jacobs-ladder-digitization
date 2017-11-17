CREATE OR REPLACE FUNCTION fn_create_entity
(
    my_username      VARCHAR,
    my_password      VARCHAR,
    my_first_name    VARCHAR,
    my_last_name     VARCHAR,
    my_email_address VARCHAR
)
RETURNS INTEGER AS

$_$
    DECLARE

        my_password_hash   VARCHAR;
        my_returned_entity INTEGER;

    BEGIN

        -- encrypt the password
        my_password_hash = crypt(my_password, gen_salt('md5'::TEXT));

        INSERT INTO tb_entity
        (
            username,
            password_hash,
            first_name,
            last_name,
            email_address

        )
        VALUES
        (
            my_username,
            my_password_hash,
            my_first_name,
            my_last_name,
            my_email_address
        )
        RETURNING entity INTO my_returned_entity;

        RETURN my_returned_entity;

    END;
$_$
LANGUAGE 'plpgsql';
