#!/bin/bash

# NOTE: this script is intended to be executed from the webroot of the project
# NOTE: this script assumes that the git remote for the heroku server is named 'heroku'

# This script will update the remote database to use the most recent alters. After that it will
# take the current commited version of the code that is on this local machine and push it to heroku.
# This will reload the server so that this version of the code is executing on the server

./scripts/update_schema_remote.sh

git push heroku
