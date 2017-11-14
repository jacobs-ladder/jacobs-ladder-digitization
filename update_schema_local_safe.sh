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
temp_database_alters_output_full_file_name="database_alters_output.txt"

rm $temp_database_alters_output_full_file_name &> /dev/null

while read line; do
    alter_full_file_name=$alter_file_path$line
    echo "APPLYING ALTER: $line"
    psql -U $database_user -d $temp_database_name -f $alter_full_file_name -1 &> $temp_database_alters_output_full_file_name
done < $order_of_alters_full_file_name

# check for errors when applying the alters

if grep -q ERROR $temp_database_alters_output_full_file_name
then

    # if there was an error while applying alters
    echo "An error occurred while applying alters. Here is the output from applying alters:"
    cat $temp_database_alters_output_full_file_name
    rm $temp_database_alters_output_full_file_name &> /dev/null

else
    # if no errors in temp's schema creation

    rm $temp_database_alters_output_full_file_name &> /dev/null

    original_database_name="jacobs_ladder_digitization"

    # drop original database

    psql -U $database_user -c "DROP DATABASE $original_database_name" &> /dev/null

    # rename temp to original name

    psql -U $database_user -c "ALTER DATABASE $temp_database_name RENAME TO $original_database_name" &> /dev/null

    # repopulate data
    ./repopulate_data.sh

fi

