import psycopg2
import os
import re

#https://www.tutorialspoint.com/postgresql/postgresql_python.htm

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


# checks if this user exists and this is their password
def authenticate(username, password):

    db_conn = get_db_connection()
    cursor = db_conn.cursor()

    # TODO implement password hash rather than just direct comparison
    query = '''
        SELECT e.entity
          FROM tb_entity e
         WHERE e.username = %s
           AND e.password = %s
    '''

    # TODO find out if this protects from SQL injection or not
    cursor.execute(query, (username, password))
    rows = cursor.fetchall()

    if len(rows) > 1:
        raise ValueError, "Usernames are not unique (this shouldn't be allowed by the schema)"

    return len(rows) > 0

def get_user(user_id):
    pass # TODO temp
    return user_name;

def get_user_id(username):
    return username.split('user')[1] # TODO temp
