import json
from json import JSONEncoder

################################
##### The Class Definition #####
################################

class user:

    # constructor

    def __init__(self, id, username, first_name, last_name, email_address):
	self.id 	   = id
        self.username      = username
        self.first_name    = first_name
        self.last_name     = last_name
        self.email_address = email_address

    # getter methods

    def get_id(self):
	return self.id

    def get_username(self):
	return self.username

    def get_first_name(self):
	return self.first_name

    def get_last_name(self):
	return self.last_name

    def get_email_address(self):
	return self.email_address

    # json method

    def toJSON(self):
	return json.dumps(self.__dict__);


###########################################
##### Functions Related to this Class #####
###########################################

# takes in the returned result of a db query that gets some number of activities
def get_user_objects(db_rows):

    users = []

    for row in db_rows:

        # this will need to get updated if users get more attributes
        current_user_id               = row[0]
        current_user_username         = row[1]
        current_user_first_name       = row[2]
        current_user_last_name        = row[3]
        current_user_email_address    = row[4]

        current_user = user(current_user_id, current_user_username, current_user_first_name, current_user_last_name, current_user_email_address)

        users.append(current_user)

    return users


def get_users_json(users):
    return json.dumps(users, cls=UserEncoder)

class UserEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__
