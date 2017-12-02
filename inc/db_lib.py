
###################
##### Imports #####
###################

# external libraries
import psycopg2
import re

# for getting environment variables/config vars
import os

# other files we wrote
import activity


#####################################
##### General Library Functions #####
#####################################

# returns a db_connection object using the DATABASE_URL config var
def get_db_connection():

    # grab the DATABASE_URL config var
    db_url = os.environ.get('DATABASE_URL')

    # make sure that we got the DATABASE_URL
    if db_url is None:
        # TODO this should probably be a custom error type
        raise IOError, "Could not get the DATABASE_URL config variable"

    # parse the DATABASE_URL into the host, port, db_name, and db_user
    # the url looks like this: postgres://db_username:db_password@db_host_name:port/name_of_db_itself
    p = "^postgres://(.*):(.*)@(.*):(\d*)/(.*)$"
    db_user     = re.match(p, db_url).group(1)
    db_password = re.match(p, db_url).group(2)
    db_host     = re.match(p, db_url).group(3)
    db_port     = re.match(p, db_url).group(4)
    db_name     = re.match(p, db_url).group(5)

    # get the db_connection
    return psycopg2.connect("dbname='%s' user='%s' host='%s' port='%s' password='%s'" % (db_name, db_user, db_host, db_port, db_password))



###########################
##### Query Functions #####
###########################

# checks if this user exists and this is their password
def authenticate(db_conn, username, password):

    cursor = db_conn.cursor()

    query = '''
        SELECT fn_check_entity_password(%(username)s, %(password)s)
    '''

    cursor.execute(query, {"username":username, "password":password})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "Usernames are not unique (this shouldn't be allowed by the schema)"

    return rows[0][0]


# returns the user_id of the user with the parameter username
def get_user_id(db_conn, username):

    cursor = db_conn.cursor()

    query = '''
        SELECT e.entity
          FROM tb_entity e
         WHERE e.username = %(username)s
    '''

    cursor.execute(query, {"username":username})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "Usernames are not unique (this shouldn't be allowed by the schema)"
    if len(rows) < 1:
        raise ValueError, "User with that username does not exist: %s" % (username)

    return rows[0][0]


# returns a list of all the activities in the db as activity objects
def get_all_activites(db_conn):

    cursor = db_conn.cursor()

    query = '''
        SELECT a.activity,
	       a.title,
               a.description
          FROM tb_activity a
    '''

    cursor.execute(query)
    rows = cursor.fetchall()

    return activity.get_activity_objects(rows)

