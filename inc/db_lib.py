
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
def create_activity(db_conn, title, description):

    cursor = db_conn.cursor()

    # TODO having a nicer error message for when a title is taken might be nice

    query = '''
            INSERT INTO tb_activity
            (
                title,
                description
            )
            VALUES
            (
                %(title)s,
                %(description)s
            ) RETURNING activity
    '''

    cursor.execute(query, {"title":title, "description":description})
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
        SELECT a.activity,
	       a.title,
               a.description
          FROM tb_activity a
         WHERE a.activity = %(id)s
    '''

    cursor.execute(query, {"id":id})
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "IDs are not unique (this shouldn't be allowed by the schema)"
    if len(rows) < 1:
        raise ValueError, "Activity with that id does not exist: %s" % (id)

    return activity.activity(rows[0][0], rows[0][1], rows[0][2])


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

    if attributes['description'] is not None:
        query += 'description = %(description)s,'
        parameters['description'] = attributes['description']

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
# TODO commenting this out until ryan has a chance to actually fix it
#def delete_activity(db_conn, id):
#
#    # TODO for now this actually deletes from the db rather than using a disabled column or something like that
#
#    cursor = db_conn.cursor()
#
#    query = '''
#        DELETE
#          FROM tb_student_activity
#         WHERE activity = %(id)s;
#
#        DELETE
#          FROM tb_activity
#         WHERE activity = %(id)s
#     RETURNING activity
#    '''
#
#    parameters = {}
#    parameters['id'] = id
#
#    cursor.execute(query, parameters)
#    rows = cursor.fetchall()
#    db_conn.commit()
#
#    if len(rows) < 1:
#        # this should never happen because the db function should stop it if there is a problem
#        raise ValueError, "Could not delete activity"
#
#    return rows[0][0]


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
         WHERE s.student = %(id)s
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


######################################
##### Student Activity Functions #####
######################################

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
    rows = cursor.fetchall()

    return student_activity_data_aggregation.student_activity_data_aggregation(rows)


# returns a list of activity objects that are associated with the student with the parameter ID
def get_activities_by_student(db_conn, student_id):

    cursor = db_conn.cursor()

    query = '''
        SELECT a.activity,
               a.title,
               a.description
          FROM tb_activity a
    INNER JOIN tb_student_activity sa
            ON a.activity = sa.activity
         WHERE sa.student = %(student)s
    '''

    cursor.execute(query, {"student":student_id})
    rows = cursor.fetchall()

    return activity.get_activity_objects(rows)


#####################################
##### Student Teacher Functions #####
#####################################

##### Create #####

# creates a student_teacher association between the parameter student and the parameter teacher
def assign_student_to_teacher(db_conn, student_id, teacher_id):

    # TODO for now this function will throw an error from the SQL if the teacher id is some kind of entity that is not a teacher

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
    '''

    cursor.execute(query, {"student":student_id})
    rows = cursor.fetchall()

    # no need to do error checking like if the teacher is a teacher etc cuz the SQL will handle it

    return user.get_user_objects(rows)
