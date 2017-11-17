#!/bin/bash

# NOTE: THIS SCRIPT WILL DROP ALL THE DATA IN THE DATABASE
# AND IF THERE IS AN ERROR WHILE APPLYING ALTERS THEN THERE WILL BE
# A FILE CALLED database_alters_output.txt WITH THE ERROR CODE OUTPUT

# NOTE: this script needs to be executed from the webroot

# This version of the script only works on the remote heroku database. It destroys the database before rebuilding so if alters fail to apply then the database will not work until you run this script without failures

# drop the current schema

heroku pg:psql -c "DROP SCHEMA public CASCADE" &> /dev/null

# create the new schema

heroku pg:psql -c "CREATE SCHEMA public" &> /dev/null

# fill the new schema with the alters

order_of_alters_full_file_name="sql/meta/order_of_alters"
alter_file_path="sql/alters/"

while read line; do
    alter_full_file_name=$alter_file_path$line
    echo "APPLYING ALTER: $line"
    # NOTE: had to put the app_name in here directly because it couldnt be a string
    heroku pg:psql --app jacobs-ladder-digitization < $alter_full_file_name # TODO testing &> $temp_database_alters_output_full_file_name
done < $order_of_alters_full_file_name

# repopulate data
./scripts/repopulate_data_remote.sh

