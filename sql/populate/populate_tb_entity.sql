-- COLUMNS:
--    username
--    password
--    first_name
--    last_name
--    email_address
--    role

SELECT fn_create_entity(
    'nathan',
    'password',
    'nathan',
    'weiskirch',
    'nathan@nathan.com',
    'teacher'
);

SELECT fn_create_entity(
    'eleanor',
    'password',
    'eleanor',
    'eason',
    'eleanor@eleanor.com',
    'evaluator'
);

SELECT fn_create_entity(
    'dacorvyn',
    'password',
    'dacorvyn',
    'young',
    'dacorvyn@dacorvyn.com',
    'administrator'
);

