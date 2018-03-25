
###################
##### Imports #####
###################

# external libraries
import psycopg2
import re
import datetime
import json

# for getting environment variables/config vars
import os

# other files we wrote
import activity
import user
import student
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


##########################
##### User Functions #####
##########################


##### Create #####

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


##### Read #####

# returns a user object with the data of the user from the db with the parameter id
def get_user_by_id(db_conn, id):

    cursor = db_conn.cursor()

    query = '''
        SELECT e.entity,
	       e.username,
               e.first_name,
               e.last_name,
               e.email_address,
               r.label
          FROM tb_entity e
          JOIN tb_role r
            ON e.role = r.role
         WHERE e.entity = %(id)s
           AND e.disabled = FALSE
    '''

    cursor.execute(query, {"id":id})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "IDs are not unique (this shouldn't be allowed by the schema)"
    if len(rows) < 1:
        raise ValueError, "User with that id does not exist: %s" % (id)

    return user.user(rows[0][0], rows[0][1], rows[0][2], rows[0][3], rows[0][4], rows[0][5])


# returns a list of all the users in the db as user objects
def get_all_users(db_conn):

    cursor = db_conn.cursor()

    query = '''
        SELECT e.entity,
	       e.username,
               e.first_name,
               e.last_name,
               e.email_address,
               r.label
          FROM tb_entity e
          JOIN tb_role r
            ON e.role = r.role
         WHERE e.disabled = FALSE
    '''

    cursor.execute(query)
    rows = cursor.fetchall()

    return user.get_user_objects(rows)


##### Update #####

# updates the user with the parameter id to have the newly input attributes (at least all the ones that are defined)
def update_user(db_conn, id, attributes):

    # TODO add validation for role_labels so that way we get a nice error
    # message if they pass in a role_label that doesn't exist

    # goes through attributes to make sure that at least one of them exists to be updated
    attribute_to_be_updated_exists = any(value is not None for value in attributes.values())
    if not attribute_to_be_updated_exists:
        raise ValueError, "No attributes were given to be updated"

    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_entity
           SET
    '''
    parameters = {}
    parameters['id'] = id

    if attributes['username'] is not None:
        query += 'username = %(username)s,'
        parameters['username'] = attributes['username']

    if attributes['first_name'] is not None:
        query += 'first_name = %(first_name)s,'
        parameters['first_name'] = attributes['first_name']

    if attributes['last_name'] is not None:
        query += 'last_name = %(last_name)s,'
        parameters['last_name'] = attributes['last_name']

    if attributes['email_address'] is not None:
        query += 'email_address = %(email_address)s,'
        parameters['email_address'] = attributes['email_address']

    if attributes['role_label'] is not None:
        query += 'role = (SELECT r.role FROM tb_role r WHERE r.label = %(role_label)s),'
        parameters['role_label'] = attributes['role_label']

    query = query[:-1] # remove last character from query string (the comma of the last attribute to be updated)

    query += '''
         WHERE entity = %(id)s
     RETURNING entity
    '''

    cursor.execute(query, parameters)
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not update entity"

    return rows[0][0]

##### Delete #####

def delete_user(db_conn, id):

    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_student_teacher
           SET disabled = TRUE
         WHERE teacher = %(id)s;

        UPDATE tb_entity
           SET disabled = TRUE
         WHERE entity = %(id)s
     RETURNING entity
    '''

    cursor.execute(query, {"id": id})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not delete entity"

    return rows[0][0]


##### Misc #####

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
           AND e.disabled = FALSE
    '''

    cursor.execute(query, {"username":username})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "Usernames are not unique (this shouldn't be allowed by the schema)"
    if len(rows) < 1:
        raise ValueError, "User with that username does not exist: %s" % (username)

    return rows[0][0]


##############################
##### Activity Functions #####
##############################


##### Create #####

# creates an activity with the given information
# returns the unique id of that activity
def create_activity(db_conn, title, activity_type_label, instructions, columns_and_rows):

    cursor = db_conn.cursor()

    # TODO having a nicer error message for when a title is taken might be nice

    query = '''
            SELECT fn_create_activity(
                %(title)s,
                %(instructions)s,
                %(activity_type_label)s,
                %(columns_and_rows)s::JSON
            )
    '''

    cursor.execute(query, {"title":title, "activity_type_label":activity_type_label, "instructions":instructions, "columns_and_rows":columns_and_rows})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not create activity"

    return rows[0][0]


##### Read #####

# returns an activity object with the data of the activity from the db with the parameter id
def get_activity_by_id(db_conn, id):

    cursor = db_conn.cursor()

    query = '''
        WITH tt_columns AS (
            SELECT ac.title    AS title,
                   dt.label    AS data_type_label,
                   ac.activity AS activity
              FROM tb_activity_column ac
        INNER JOIN tb_data_type dt
                ON ac.data_type = dt.data_type
             WHERE ac.disabled = FALSE
          ORDER BY ac.activity,
                   ac.number
        ), tt_rows AS (
            SELECT ar.title    AS title,
                   ar.activity AS activity
              FROM tb_activity_row ar
             WHERE ar.disabled = FALSE
          ORDER BY ar.activity,
                   ar.number
        ), tt_activity_with_columns AS (
            SELECT a.activity,
                   array_agg(ttc.title)           AS column_titles,
                   array_agg(ttc.data_type_label) AS column_data_type_labels
              FROM tb_activity a
        INNER JOIN tt_columns ttc
                ON a.activity = ttc.activity
             WHERE a.disabled = FALSE
          GROUP BY a.activity
        ), tt_activity_with_rows AS (
            SELECT a.activity,
                   array_agg(ttr.title) AS row_titles
              FROM tb_activity a
        INNER JOIN tt_rows ttr
                ON a.activity = ttr.activity
             WHERE a.disabled = FALSE
          GROUP BY a.activity
        )
        SELECT a.activity,
               a.title,
               at.label,
               a.instructions,
               ttac.column_titles,
               ttac.column_data_type_labels,
               ttar.row_titles
          FROM tb_activity a
    INNER JOIN tb_activity_type at
            ON a.activity_type = at.activity_type
    INNER JOIN tt_activity_with_columns ttac
            ON a.activity = ttac.activity
    INNER JOIN tt_activity_with_rows ttar
            ON a.activity = ttar.activity
         WHERE a.activity = %(id)s
           AND a.disabled  = FALSE
           AND at.disabled = FALSE
    '''

    cursor.execute(query, {"id":id})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "IDs are not unique (this shouldn't be allowed by the schema)"
    if len(rows) < 1:
        raise ValueError, "Activity with that id does not exist: %s" % (id)

    # gather together our column information
    activity_column_titles     = rows[0][4]
    activity_column_data_types = rows[0][5]
    activity_columns           = []
    for x in range(len(activity_column_titles)):
        activity_columns.append([activity_column_titles[x], activity_column_data_types[x]])

    return activity.activity(rows[0][0], rows[0][1], rows[0][2], rows[0][3], activity_columns, rows[0][6])


# returns a list of all the activities in the db as activity objects
def get_all_activities(db_conn):

    cursor = db_conn.cursor()

    query = '''
        WITH tt_columns AS (
            SELECT ac.title    AS title,
                   dt.label    AS data_type_label,
                   ac.activity AS activity
              FROM tb_activity_column ac
        INNER JOIN tb_data_type dt
                ON ac.data_type = dt.data_type
             WHERE ac.disabled = FALSE
          ORDER BY ac.activity,
                   ac.number
        ), tt_rows AS (
            SELECT ar.title    AS title,
                   ar.activity AS activity
              FROM tb_activity_row ar
             WHERE ar.disabled = FALSE
          ORDER BY ar.activity,
                   ar.number
        ), tt_activity_with_columns AS (
            SELECT a.activity,
                   array_agg(ttc.title)           AS column_titles,
                   array_agg(ttc.data_type_label) AS column_data_type_labels
              FROM tb_activity a
        INNER JOIN tt_columns ttc
                ON a.activity = ttc.activity
             WHERE a.disabled = FALSE
          GROUP BY a.activity
        ), tt_activity_with_rows AS (
            SELECT a.activity,
                   array_agg(ttr.title) AS row_titles
              FROM tb_activity a
        INNER JOIN tt_rows ttr
                ON a.activity = ttr.activity
             WHERE a.disabled = FALSE
          GROUP BY a.activity
        )
        SELECT a.activity,
               a.title,
               at.label,
               a.instructions,
               ttac.column_titles,
               ttac.column_data_type_labels,
               ttar.row_titles
          FROM tb_activity a
    INNER JOIN tb_activity_type at
            ON a.activity_type = at.activity_type
    INNER JOIN tt_activity_with_columns ttac
            ON a.activity = ttac.activity
    INNER JOIN tt_activity_with_rows ttar
            ON a.activity = ttar.activity
         WHERE a.disabled  = FALSE
           AND at.disabled = FALSE
    '''

    cursor.execute(query)
    rows = cursor.fetchall()

    return activity.get_activity_objects(rows)


##### Update #####

# updates the activity with the parameter id to have the newly input attributes (at least all the ones that are defined)
def update_activity(db_conn, id, attributes):

    # goes through attributes to make sure that at least one of them exists to be updated
    attribute_to_be_updated_exists = any(value is not None for value in attributes.values())
    if not attribute_to_be_updated_exists:
        raise ValueError, "No attributes were given to be updated"

    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_activity
           SET
    '''
    parameters = {}
    parameters['id'] = id

    if attributes['title'] is not None:
        query += 'title = %(title)s,'
        parameters['title'] = attributes['title']

    if attributes['instructions'] is not None:
        query += 'instructions = %(instructions)s,'
        parameters['instructions'] = attributes['instructions']

    if attributes['activity_type'] is not None:
        activity_type_query = '''
            SELECT at.activity_type
              FROM tb_activity_type at
             WHERE at.label = %(label)s
               AND disabled = FALSE
        '''
        cursor.execute(activity_type_query, {"label":label})
        rows = cursor.fetchall()

        query += 'activity_type = %(activity_type)s,'
        parameters['activity_type'] = rows[0][0]

    query = query[:-1] # remove last character from query string (the comma of the last attribute to be updated)

    query += '''
         WHERE activity = %(id)s
     RETURNING activity
    '''

    cursor.execute(query, parameters)
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not update activity"

    return rows[0][0]



##### Delete #####

# deletes the activity from the database with the parameter id
def delete_activity(db_conn, id):

    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_student_activity
           SET disabled = TRUE
         WHERE activity = %(id)s;

        UPDATE tb_activity_column
           SET disabled = TRUE
         WHERE activity = %(id)s;

        UPDATE tb_activity_row
           SET disabled = TRUE
         WHERE activity = %(id)s;

        UPDATE tb_activity_cell ac
           SET disabled = TRUE
          FROM tb_activity_column acol
         WHERE ac.activity_column = acol.activity_column
           AND acol.activity = %(id)s;

        UPDATE tb_activity
           SET disabled = TRUE
         WHERE activity = %(id)s
     RETURNING activity
    '''

    cursor.execute(query, {"id": id})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not delete activity"

    return rows[0][0]




###################################
##### Activity Type Functions #####
###################################



##### Create #####

def create_activity_type(db_conn, label):

    cursor = db_conn.cursor()

    query = '''
            INSERT INTO tb_activity_type
            (
                label
            )
            VALUES
            (
                %(label)s
            ) RETURNING activity_type
    '''

    cursor.execute(query, {"label":label})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not create activity_type"

    return rows[0][0]


##### Read #####

# NOTE: activity types are going to return json objects directly instead of the route having to make the json

# returns a json list of all the activity_types in the database
def get_all_activity_types(db_conn):

    cursor = db_conn.cursor()

    query = '''
        SELECT at.activity_type,
               at.label
          FROM tb_activity_type at
         WHERE at.disabled = FALSE
    '''

    cursor.execute(query)
    rows = cursor.fetchall()

    json_rows = []
    current_row = 0
    for row in rows:
        json_rows.append({})
        json_rows[current_row]['id']    = row[0]
        json_rows[current_row]['label'] = row[1]
        current_row = current_row + 1;

    return json.dumps(json_rows)


# returns a json object that has the id and label of the activity type with the input id
def get_activity_type_by_id(db_conn, id):

    cursor = db_conn.cursor()

    query = '''
        SELECT at.activity_type,
               at.label
          FROM tb_activity_type at
         WHERE at.activity_type = %(activity_type)s
           AND at.disabled = FALSE
    '''

    cursor.execute(query, {"activity_type":id})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "IDs are not unique (this shouldn't be allowed by the schema)"
    if len(rows) < 1:
        raise ValueError, "Activity Type with that id does not exist: %s" % (id)

    json_row = {}
    json_row['id']    = rows[0][0]
    json_row['label'] = rows[0][1]

    return json.dumps(json_row)


# returns a json object that has the id and label of the activity type with the input label
def get_activity_type_by_label(db_conn, label):

    cursor = db_conn.cursor()

    query = '''
        SELECT at.activity_type,
               at.label
          FROM tb_activity_type at
         WHERE at.label    = %(label)s
           AND at.disabled = FALSE
    '''

    cursor.execute(query, {"label":label})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "Labels are not unique (this shouldn't be allowed by the schema)"
    if len(rows) < 1:
        raise ValueError, "Activity Type with that label does not exist: %s" % (label)

    json_row = {}
    json_row['id']    = rows[0][0]
    json_row['label'] = rows[0][1]

    return json.dumps(json_row)


##### Delete #####

def delete_activity_type(db_conn, id):

    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_student_activity sa
           SET disabled = TRUE
          FROM tb_activity a
         WHERE sa.activity = a.activity
           AND a.activity_type = %(id)s;

        UPDATE tb_activity_column ac
           SET disabled = TRUE
          FROM tb_activity a
         WHERE ac.activity = a.activity
           AND a.activity_type = %(id)s;

        UPDATE tb_activity_row ar
           SET disabled = TRUE
          FROM tb_activity a
         WHERE ar.activity = a.activity
           AND a.activity_type = %(id)s;

        UPDATE tb_activity_cell ac
           SET disabled = TRUE
          FROM tb_activity_column acol
          JOIN tb_activity a
            ON acol.activity = a.activity
         WHERE ac.activity_column = acol.activity_column
           AND a.activity_type = %(id)s;

        UPDATE tb_activity
           SET disabled = TRUE
         WHERE activity_type = %(id)s;

        UPDATE tb_activity_type
           SET disabled = TRUE
         WHERE activity_type = %(id)s
     RETURNING activity_type
    '''

    cursor.execute(query, {"id": id})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not delete activity type"

    return rows[0][0]



#############################
##### Student Functions #####
#############################


##### Create #####

# creates a student with the given information
# returns the unique id of that student
def create_student(db_conn, first_name, last_name):

    cursor = db_conn.cursor()

    query = '''
            INSERT INTO tb_student
            (
                first_name,
                last_name
            )
            VALUES
            (
                %(first_name)s,
                %(last_name)s
            ) RETURNING student
    '''

    cursor.execute(query, {"first_name":first_name, "last_name":last_name})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not create student"

    return rows[0][0]


##### Read #####

# returns a student object with the data of the student from the db with the parameter id
# as a result this function is not tested
def get_student_by_id(db_conn, id):

    cursor = db_conn.cursor()

    query = '''
        SELECT s.student,
               s.first_name,
               s.last_name
          FROM tb_student s
         WHERE s.student  = %(id)s
           AND s.disabled = FALSE
    '''

    cursor.execute(query, {"id":id})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "IDs are not unique (this shouldn't be allowed by the schema)"
    if len(rows) < 1:
        raise ValueError, "Student with that id does not exist: %s" % (id)

    return student.student(rows[0][0], rows[0][1], rows[0][2])


# returns a list of all the students in the db as student objects
# as a result this function is not tested
def get_all_students(db_conn):

    cursor = db_conn.cursor()

    query = '''
        SELECT s.student,
               s.first_name,
               s.last_name
          FROM tb_student s
         WHERE s.disabled = FALSE
    '''

    cursor.execute(query)
    rows = cursor.fetchall()

    return student.get_student_objects(rows)



##### Update #####

# updates the student with the parameter id to have the newly input attributes (at least all the ones that are defined)
def update_student(db_conn, id, attributes):

    # goes through attributes to make sure that at least one of them exists to be updated
    attribute_to_be_updated_exists = any(value is not None for value in attributes.values())
    if not attribute_to_be_updated_exists:
        raise ValueError, "No attributes were given to be updated"

    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_student
           SET
    '''
    parameters = {}
    parameters['id'] = id

    if attributes['first_name'] is not None:
        query += 'first_name = %(first_name)s,'
        parameters['first_name'] = attributes['first_name']

    if attributes['last_name'] is not None:
        query += 'last_name = %(last_name)s,'
        parameters['last_name'] = attributes['last_name']

    query = query[:-1] # remove last character from query string (the comma of the last attribute to be updated)

    query += '''
         WHERE student = %(id)s
     RETURNING student
    '''

    cursor.execute(query, parameters)
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not update student"

    return rows[0][0]


##### Delete #####


def delete_student(db_conn, id):

    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_student_teacher
           SET disabled = TRUE
         WHERE student = %(id)s;

        UPDATE tb_student_activity
           SET disabled = TRUE
         WHERE student = %(id)s;

        UPDATE tb_student
           SET disabled = TRUE
         WHERE student = %(id)s
     RETURNING student
    '''

    cursor.execute(query, {"id": id})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not delete student"

    return rows[0][0]




######################################
##### Student Activity Functions #####
######################################

##### Create #####

# creates a student_activity association between the parameter student and the parameter activity
def assign_activity_to_student(db_conn, student_id, activity_id):

    cursor = db_conn.cursor()

    student_activity_query = '''
        INSERT INTO tb_student_activity
        (
            student,
            activity
        )
        VALUES
        (
            %(student)s,
            %(activity)s
        )
        RETURNING student_activity
    '''

    cursor.execute(student_activity_query, {"student": student_id, "activity":activity_id})
    student_activity_rows = cursor.fetchall()

    if len(student_activity_rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not insert student_activity"

    # have to make sure that we create empty activity_cell rows or else stuff will fail in the future
    # TODO honestly this should probably be a trigger in the db and not in the
    # python but thats not a big deal right now
    activity_cells_query = '''
        INSERT INTO tb_activity_cell
        (
            student_activity,
            activity_row,
            activity_column,
            data
        )
        SELECT sa.student_activity,
               arow.activity_row,
               acol.activity_column,
               null
          FROM tb_student_activity sa
          JOIN tb_activity a
            ON a.activity = sa.activity
          JOIN tb_activity_row arow
            ON arow.activity = a.activity
          JOIN tb_activity_column acol
            ON acol.activity = a.activity
         WHERE sa.student_activity = %(student_activity)s
           AND sa.disabled         = FALSE
           AND a.disabled          = FALSE
           AND arow.disabled       = FALSE
           AND acol.disabled       = FALSE
     RETURNING activity_cell
    '''

    cursor.execute(activity_cells_query, {"student_activity": student_activity_rows[0][0]})
    activity_cells_rows = cursor.fetchall()

    if len(activity_cells_rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not insert student_activity"

    # dont commit our changes until we've validated everything
    db_conn.commit()

    return student_activity_rows[0][0]

# update the student_activity data based on the parameter student, activity, and data to update
# returns true if we were successful with updating every cell. Raises an error if something failed
def update_student_activity_data(db_conn, student_id, activity_id, data_to_update):

    # this will implicitly check to see if we have malformed json
    data_to_update_dict = json.loads(data_to_update)

    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_activity_cell ac
           SET data = %(data)s
          FROM tb_student_activity sa
          JOIN tb_activity a
            ON sa.activity = a.activity
          JOIN tb_activity_column acol
            ON a.activity = acol.activity
          JOIN tb_activity_row arow
            ON a.activity = arow.activity
         WHERE sa.student          = %(student)s
           AND a.activity          = %(activity)s
           AND acol.number         = %(column_number)s
           AND arow.number         = %(row_number)s
           AND ac.student_activity = sa.student_activity
           AND ac.activity_column  = acol.activity_column
           AND ac.activity_row     = arow.activity_row
     RETURNING ac.activity_cell
    '''
    parameters = {}
    parameters['student']       = student_id
    parameters['activity']      = activity_id

    # update each data cell with an individual query
    for x in range(len(data_to_update_dict)): # for each data cell that we are updating

        # grab the parameters for this data cell
        parameters['data']          = data_to_update_dict[x]['data']
        parameters['column_number'] = data_to_update_dict[x]['column_number']
        parameters['row_number']    = data_to_update_dict[x]['row_number']

        cursor.execute(query, parameters)
        rows = cursor.fetchall()
        db_conn.commit()

        if len(rows) < 1:
            # this should never happen because the db function should stop it if there is a problem
            raise ValueError, "Could not update the student_activity data"

    return True


##### Read #####

# returns the data of a particular student's performance on a particular activity
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
    INNER JOIN tb_student_activity sa
            ON acell.student_activity = sa.student_activity
    INNER JOIN tb_data_type dt
            ON acol.data_type = dt.data_type
         WHERE sa.student     = %(student)s
           AND sa.activity    = %(activity)s
           AND acell.disabled = FALSE
           AND acol.disabled  = FALSE
           AND sa.disabled    = FALSE
      ORDER BY ar.number, acol.number
    '''

    cursor.execute(query, {"student":student_id, "activity":activity_id})
    rows = cursor.fetchall()

    return student_activity_data_aggregation.student_activity_data_aggregation(rows)


# returns a list of activity objects that are associated with the student with the parameter ID
def get_activities_by_student(db_conn, student_id):

    cursor = db_conn.cursor()

    query = '''
        WITH tt_columns AS (
            SELECT ac.title    AS title,
                   dt.label    AS data_type_label,
                   ac.activity AS activity
              FROM tb_activity_column ac
        INNER JOIN tb_data_type dt
                ON ac.data_type = dt.data_type
          ORDER BY ac.activity,
                   ac.number
        ), tt_rows AS (
            SELECT ar.title    AS title,
                   ar.activity AS activity
              FROM tb_activity_row ar
          ORDER BY ar.activity,
                   ar.number
        ), tt_activity_with_columns AS (
            SELECT a.activity,
                   array_agg(ttc.title)           AS column_titles,
                   array_agg(ttc.data_type_label) AS column_data_type_labels
              FROM tb_activity a
        INNER JOIN tt_columns ttc
                ON a.activity = ttc.activity
          GROUP BY a.activity
        ), tt_activity_with_rows AS (
            SELECT a.activity,
                   array_agg(ttr.title) AS row_titles
              FROM tb_activity a
        INNER JOIN tt_rows ttr
                ON a.activity = ttr.activity
             WHERE a.disabled = FALSE
          GROUP BY a.activity
        )
        SELECT a.activity,
               a.title,
               at.label,
               a.instructions,
               ttac.column_titles,
               ttac.column_data_type_labels,
               ttar.row_titles
          FROM tb_activity a
    INNER JOIN tb_activity_type at
            ON a.activity_type = at.activity_type
    INNER JOIN tt_activity_with_columns ttac
            ON a.activity = ttac.activity
    INNER JOIN tt_activity_with_rows ttar
            ON a.activity = ttar.activity
    INNER JOIN tb_student_activity sa
            ON a.activity = sa.activity
         WHERE sa.student  = %(student)s
           AND at.disabled = FALSE
           AND sa.disabled = FALSE
    '''

    cursor.execute(query, {"student":student_id})
    rows = cursor.fetchall()

    return activity.get_activity_objects(rows)


##### Delete #####

def delete_student_activity(db_conn, student_id, activity_id):

    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_activity_cell ac
           SET disabled = TRUE
          FROM tb_student_activity sa
         WHERE ac.student_activity = sa.student_activity
           AND sa.student  = %(student_id)s
           AND sa.activity = %(activity_id)s;

        UPDATE tb_student_activity
           SET disabled = TRUE
         WHERE student  = %(student_id)s
           AND activity = %(activity_id)s
     RETURNING student_activity
    '''

    cursor.execute(query, {"student_id": student_id, "activity_id": activity_id})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not delete student_activity"

    return rows[0][0]



#####################################
##### Student Teacher Functions #####
#####################################

##### Create #####

# creates a student_teacher association between the parameter student and the parameter teacher
def assign_student_to_teacher(db_conn, student_id, teacher_id):

    cursor = db_conn.cursor()

    query = '''
        INSERT INTO tb_student_teacher
        (
            student,
            teacher
        )
        VALUES
        (
            %(student)s,
            %(teacher)s
        )
        RETURNING student_teacher
    '''

    cursor.execute(query, {"student": student_id, "teacher":teacher_id})
    rows = cursor.fetchall()
    db_conn.commit()

    # no need to do error checking like if the teacher is a teacher
    # or if the student/teacher pair are already associated
    # cuz the SQL will handle it

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not insert student_teacher"

    return rows[0][0]


##### Read #####

# searches for all the students that have the parameter teacher assigned to them and then returns those student objects
# this function can return users that are not teachers because admins and evaluators also act as teachers
def get_students_by_teacher(db_conn, teacher_id):

    cursor = db_conn.cursor()

    query = '''
        SELECT s.student    AS student,
               s.first_name AS first_name,
               s.last_name  AS last_name
          FROM tb_student s
          JOIN tb_student_teacher st
            ON s.student = st.student
         WHERE st.teacher = %(teacher)s
           AND s.disabled  = FALSE
           AND st.disabled = FALSE
    '''

    cursor.execute(query, {"teacher":teacher_id})
    rows = cursor.fetchall()

    # no need to do error checking like if the teacher is a teacher etc cuz the SQL will handle it

    return student.get_student_objects(rows)

# searches for all the teachers that have the parameter student assigned to them and then returns those user objects
def get_teachers_by_student(db_conn, student_id):

    # TODO this function will just return nothing if you give it a student id that doesn't exist
    # should probably have error checking for this

    cursor = db_conn.cursor()

    query = '''
        SELECT e.entity,
               e.username,
               e.first_name,
               e.last_name,
               e.email_address,
               r.label
          FROM tb_entity e
          JOIN tb_student_teacher st
            ON st.teacher = e.entity
          JOIN tb_role r
            ON e.role = r.role
         WHERE st.student = %(student)s
           AND e.disabled  = FALSE
           AND st.disabled = FALSE
    '''

    cursor.execute(query, {"student":student_id})
    rows = cursor.fetchall()

    # no need to do error checking like if the teacher is a teacher etc cuz the SQL will handle it

    return user.get_user_objects(rows)


##### Delete #####

def delete_student_teacher(db_conn, student_id, teacher_id):
    cursor = db_conn.cursor()

    query = '''
        UPDATE tb_student_teacher
           SET disabled = TRUE
         WHERE student = %(student_id)s
           AND teacher = %(teacher_id)s
     RETURNING student_teacher
    '''

    cursor.execute(query, {"student_id": student_id, "teacher_id": teacher_id})
    rows = cursor.fetchall()
    db_conn.commit()

    if len(rows) < 1:
        # this should never happen because the db function should stop it if there is a problem
        raise ValueError, "Could not delete student_teacher"

    return rows[0][0]


