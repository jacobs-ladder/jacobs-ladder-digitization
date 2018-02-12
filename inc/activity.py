import json
from json import JSONEncoder
################################
##### The Class Definition #####
################################

class activity:

    def __init__(self, id, title, activity_type_label, instructions):
	self.id 	         = id
        self.title               = title
        self.instructions        = instructions
        self.activity_type_label = activity_type_label

    def get_id(self):
	return self.id

    def get_title(self):
        return self.title

    def get_activity_type_label(self):
        return self.activity_type_label

    def get_instructions(self):
        return self.instructions

    def toJSON(self):
	return json.dumps(self.__dict__);


###########################################
##### Functions Related to this Class #####
###########################################

# takes in the returned result of a db query that gets some number of activities
def get_activity_objects(db_rows):

    activites = []

    for row in db_rows:
        # this will need to get updated if activites get more attributes
        current_activity_id                  = row[0]
        current_activity_title               = row[1]
        current_activity_activity_type_label = row[2]
        current_activity_instructions        = row[3]

        current_activity = activity(current_activity_id, current_activity_title, current_activity_activity_type_label, current_activity_instructions)

        activites.append(current_activity)

    return activites

def get_activities_json(activities):
    return json.dumps(activities, cls=ActivityEncoder)

class ActivityEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__
