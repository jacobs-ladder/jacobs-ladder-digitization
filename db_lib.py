import psycopg2
import os
import re

#https://www.tutorialspoint.com/postgresql/postgresql_python.htm

def get_db_connection():

    # TODO testing
    print "got inside get_db_connection function!"

    # grab the DATABASE_URL config var
    db_url = os.environ.get('DATABASE_URL')

    # TODO testing
    print "db_url: %s" % db_url

    # make sure that we got the DATABASE_URL
    if db_url is None:
        # TODO this should probably be a custom error type
        raise IOError, "Could not get the DATABASE_URL config variable"

    # parse the DATABASE_URL into the host, port, db_name, and db_user
    # the url looks like this: postgres://db_username:db_host_name.com:port/name_of_db_itself
    p = "^postgres://(.*):(.*):(\d*)/(.*)$"
    db_user = re.match(p, db_url).group(1)
    db_host = re.match(p, db_url).group(2)
    db_port = re.match(p, db_url).group(3)
    db_name = re.match(p, db_url).group(4)

    # get the db_connection
    return psycopg2.connect("dbname='%s' user='%s' host='%s' password='%s'" % (db_name, db_user, db_host, db_port))


#user_name, user_password
def authenticate(username, password):

    pass # TODO temp

    return user_name == username and user_password == password;

def get_user(user_id):
    pass # TODO temp
    return user_name;

def get_user_id(username):
    return username.split('user')[1] # TODO temp
