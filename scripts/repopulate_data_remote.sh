#!/bin/bash

order_of_populate_full_file_name="sql/meta/order_of_populate"
populate_file_path="sql/populate/"
temp_database_populate_output_full_file_name="database_populate_output.txt"

while read line; do
    populate_full_file_name=$populate_file_path$line
    echo "POPULATING: $line"
    # NOTE: had to put the app_name in here directly because it couldnt be a string
    heroku pg:psql --app jacobs-ladder-digitization < $populate_full_file_name
done < $order_of_populate_full_file_name
