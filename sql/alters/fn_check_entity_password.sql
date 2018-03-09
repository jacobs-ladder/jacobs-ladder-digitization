CREATE OR REPLACE FUNCTION fn_check_entity_password
(
    my_username      VARCHAR,
    my_password      VARCHAR
)
RETURNS BOOLEAN AS

-- returning TRUE means that the user with this username does have this password
-- returning FALSE means that either the user doesnt exist or the user with this username does NOT have this password

$_$
    DECLARE

        my_password_hash   VARCHAR;
        my_returned_entity INTEGER;

    BEGIN

        -- check the password against our encrypted hash
        SELECT e.entity
          INTO my_returned_entity
          FROM tb_entity e
         WHERE username = my_username
           AND password_hash = crypt(my_password, password_hash)
           AND e.disabled = FALSE;

        RETURN my_returned_entity IS NOT NULL;

    END;
$_$
LANGUAGE 'plpgsql';

