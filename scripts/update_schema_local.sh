#!/bin/bash

# NOTE: THIS SCRIPT WILL DROP ALL THE DATA IN THE DATABASE
# AND IF THERE IS AN ERROR WHILE APPLYING ALTERS THEN THERE WILL BE
# A FILE CALLED database_alters_output.txt WITH THE ERROR CODE OUTPUT

# This version of the script only works on the local database and it doesnt change the database unless all the alters apply correctly

# create temp database

database_user="postgres"
temp_database_name="jacobs_ladder_digitization_temp"

psql -U $database_user -c "CREATE DATABASE $temp_database_name" &> /dev/null

# fill temp database with new alters

order_of_alters_full_file_name="sql/meta/order_of_alters"
alter_file_path="sql/alters/"

while read line; do
    alter_full_file_name=$alter_file_path$line
    echo "APPLYING ALTER: $line"
    psql -U $database_user -d $temp_database_name -f $alter_full_file_name -1
done < $order_of_alters_full_file_name


# if no errors in temp's schema creation

original_database_name="jacobs_ladder_digitization"

# drop original database

psql -U $database_user -c "DROP DATABASE $original_database_name" &> /dev/null

# rename temp to original name

psql -U $database_user -c "ALTER DATABASE $temp_database_name RENAME TO $original_database_name" &> /dev/null

# repopulate data
./scripts/repopulate_data_local.sh

