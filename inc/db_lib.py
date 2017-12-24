
###################
##### Imports #####
###################

# external libraries
import psycopg2
import re
import datetime

# for getting environment variables/config vars
import os

# other files we wrote
import activity
import user
import student_activity_data_aggregation


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
def get_user_id_by_username(db_conn, username):

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


# returns a user object with the data of the user from the db with the parameter id
def get_user_by_id(db_conn, id):

    cursor = db_conn.cursor()

    query = '''
        SELECT e.entity,
	       e.username,
               e.first_name,
               e.last_name,
               e.email_address
          FROM tb_entity e
         WHERE e.entity = %(id)s
    '''

    cursor.execute(query, {"id":id})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "IDs are not unique (this shouldn't be allowed by the schema)"
    if len(rows) < 1:
        raise ValueError, "User with that id does not exist: %s" % (id)

    return user.user(rows[0][0], rows[0][1], rows[0][2], rows[0][3], rows[0][4])


# creates a user with the given information
# returns the unique id of that user
def create_user(db_conn, username, password, first_name, last_name, email_address, role_label):

    cursor = db_conn.cursor()

    # TODO having a nicer error message for when a username is taken might be nice

    query = '''
        SELECT fn_create_entity(
                %(username)s,
                %(password)s,
                %(first_name)s,
                %(last_name)s,
                %(email_address)s,
                %(role_label)s
            )
    '''

    cursor.execute(query, {"username":username, "password":password, "first_name":first_name, "last_name":last_name, "email_address":email_address, "role_label":role_label})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not create user"

    return rows[0][0]


# returns a list of all the users in the db as user objects
def get_all_users(db_conn):

    cursor = db_conn.cursor()

    query = '''
        SELECT e.entity,
	       e.username,
               e.first_name,
               e.last_name,
               e.email_address
          FROM tb_entity e
    '''

    cursor.execute(query)
    rows = cursor.fetchall()

    return user.get_user_objects(rows)


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


def get_activity_data_by_student_and_activity(db_conn, student_id, activity_id):

    cursor = db_conn.cursor()

    query = '''
        SELECT ar.number   AS row_num,
               ar.title    AS row_title,
               acol.number AS col_num,
               acol.title  AS col_title,
               acell.data  AS data,
               dt.label    AS data_type
          FROM tb_activity_cell acell
    INNER JOIN tb_activity_row ar
            ON acell.activity_row = ar.activity_row
    INNER JOIN tb_activity_column acol
            ON acell.activity_column = acol.activity_column
    INNER JOIN tb_student_activity sa_row
            ON ar.student_activity = sa_row.student_activity
    INNER JOIN tb_student_activity sa_col -- this duplicate join is here to filter the cells based on columns as well as rows
            ON acol.student_activity = sa_col.student_activity
    INNER JOIN tb_data_type dt
            ON acol.data_type = dt.data_type
         WHERE sa_row.student  = %(student)s
           AND sa_row.activity = %(activity)s
      ORDER BY ar.number, acol.number
    '''

    cursor.execute(query, {"student":student_id, "activity":activity_id})
    query_rows = cursor.fetchall()

    return student_activity_data_aggregation.student_activity_data_aggregation(query_rows)

