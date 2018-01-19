# 7301_junior_design_project

# Python

List of python libraries to install with pip:
flask
flask-login
psycopg2

To Run manually (not using heroku)
python app.py
go to http://127.0.0.1:5000/ in your browser


# Local Database:

Postgres version: 9.6.5

Config details:


Postgres Username: postgres,

Postgres Password: password,

db name: jacobs_ladder_digitization

Running `./update_schema_local_safe.sh` will take the most recent schema changes and update your local db instance. It will also repopulate the database with the default test data. This script will not update the schema if there is an error in the alters; however, if the alters apply correctly and the repopulation does not work correctly then you will have an updated schema without proper data.

See Ryan to get a db instance set up on your local machine.


# Remote Database:

Postgres Version 9.6.5

Config details (in this case this is an actual heroku config var):

Layout:       postgres://username:password@host:port/db_name

Running `./update_schema_remote.sh` will take the most recent schema changes and update the heroku db instance. It will also repopulate the database with the default test data. Running this script is dangerous if the alters are not guaranteed to run correctly because the database will be empty and without any tables if the alters do not apply correctly. The latest schema should be tested locally before it is applied to the remote database.


# Getting Heroku Working

You should have this installed on your local machine: heroku-cli/6.14.37

You need to set up an account with heroku

The instructions for setting up an account can be found here (click on "free Heroku Account"): https://devcenter.heroku.com/articles/getting-started-with-python#introduction

Ryan will have to give you access to the heroku app using `heroku access:add someone@example.com` where the email address is the one associated with your heroku account

Once you have access, you will need to add the heroku remote to your local repository. This can be done with the following command: `heroku git:remote -a jacobs-ladder-digitization`

After that point, you can push to the heroku remote using `git push heroku` and pull from it using `git pull heroku` etc.

You can also run a local instance of the application by running `heroku local`. This will set up the application to run on http://0.0.0.0:5000/


# How Heroku Works

Heroku knows that our application is a python application

Heroku uses the special file "Procfile" to determine how to execute the application. In our case it executes app.py

Heroku uses requirements.txt to track dependencies for python applications. If you have a python module that you want to use somewhere in our application then it (and its version numer) need to be added to this file. If you do not then Heroku will not install your module on the remote server and our application will fail.

Heroku uses runtime.txt to track which version of python it should be using. We are currently using python 2.7.4. Heroku can only use either 2.7.4 or 3.6.
