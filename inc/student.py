import json
from json import JSONEncoder
################################
##### The Class Definition #####
################################

class student:

    def __init__(self, id, title, description):
	self.id 	 = id
        self.title       = title
        self.description = description

    def get_id(self):
	return self.id

    def get_title(self):
        return self.title

    def get_description(self):
        return self.description

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
        current_student_first name    = row[0]
		current_student_last_name 	  = row[1]
        current_student_teacher_list  = row[2]
        current_student_activity_list = row[3]

        current_student = student(current_student_first_name, current_student_last_name, current_student_teacher_list, current_student_activity_list)

        students.append(current_student)

    return students

def get_students_json(students):
    return json.dumps(students, cls=StudentEncoder)

class StudentEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__
