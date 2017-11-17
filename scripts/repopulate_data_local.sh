#!/bin/bash

# NOTE: this script needs to be executed from the webroot

database_user="postgres"
database_name="jacobs_ladder_digitization"

order_of_populate_full_file_name="sql/meta/order_of_populate"
populate_file_path="sql/populate/"

while read line; do
    populate_full_file_name=$populate_file_path$line
    echo "POPULATING: $line"
    psql -U $database_user -d $database_name -f $populate_full_file_name -1
done < $order_of_populate_full_file_name

