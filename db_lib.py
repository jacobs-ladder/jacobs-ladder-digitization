import psycopg2

#https://www.tutorialspoint.com/postgresql/postgresql_python.htm

#user_name, user_password
def authenticate(username, password):
    return True # TODO temp

def get_user(user_id):
    pass # TODO temp

def get_user_id(username):
    return username.split('user')[1] # TODO temp
