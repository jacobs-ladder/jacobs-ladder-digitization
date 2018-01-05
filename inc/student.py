import json
from json import JSONEncoder
import class user
################################
##### The Class Definition #####
################################

class student:

    def __init__(self, id, student, firstname, lastname):
        self.id 	    = id
        self.student    = student
        self.firstname  = firstname
        self.lastname   = lastname

    def get_id(self):
        return self.id

    def get_student(self):
        return self.student

    def get_firstname(self):
        return self.firstname
    
    def get_lastname(self):
        return self.lastname

    def toJSON(self):
	return json.dumps(self.__dict__);


###########################################
##### Functions Related to this Class #####
###########################################

# takes in the returned result of a db query that gets information about the student
def get_student_objects(db_rows):

    student = []

    for row in db_rows:
        # this will need to get updated if student gets more attributes
        current_student               = row[0]
        current_student_first name    = row[1]
		current_student_last_name     = row[2]

        This_Student = student(current_student, current_student_first_name, current_student_last_name)

        students.append(This_student)

    return students

def get_students_json(students):
    return json.dumps(students, cls=StudentEncoder)

class StudentEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__
