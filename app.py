from flask import Flask, Response, redirect, url_for, request, session, abort, send_from_directory, render_template
from flask_login import LoginManager, login_required, login_user, logout_user, current_user
import json
from functools import wraps

import sys
sys.path.insert(0, 'inc')

import db_lib
from activity import get_activities_json
from user import get_users_json
from student import get_students_json

app = Flask(__name__)

# config
app.config.update(
    SECRET_KEY = 'ef9936ee-6454-4ca7-bcd0-15b079140840'
)

app.view_functions['static'] = login_required(app.send_static_file)

# flask-login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


def role_required(role="any"):
	def fn(view_fn):
		def wrapper(*args, **kwargs):
			if role.lower() != current_user.get_role_label().lower() and role.lower() != "any":
				return abort(403)
			return view_fn(*args, **kwargs)
		return wrapper
	return fn


# callback to reload the user object
@login_manager.user_loader
def load_user(user_id):

    db_conn = db_lib.get_db_connection()

    user = db_lib.get_user_by_id(db_conn, user_id)

    # close the database connection once we are done with it
    db_conn.close()

    return user

@app.route('/')
@login_required
def home():
	if current_user.get_role_label() == "administrator":
		return redirect("/admin")
	if current_user.get_role_label() == "teacher":
		return redirect("/teacher")
	if current_user.get_role_label() == "evaluator":
		return redirect("/eval")

##################################################
##### Delivering files to Client-Side Routes #####
##################################################

@app.route('/js/<path:path>')
@login_required
def send_js(path):
    if '..' in path:
        return abort(403)
    return send_from_directory('dist/js', path)

@app.route('/css/<path:path>')
def send_css(path):
    if '..' in path:
        return abort(403)
    return send_from_directory('css', path)


#######################
##### Page Routes #####
#######################


# somewhere to login
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        db_conn = db_lib.get_db_connection()

        if db_lib.authenticate(db_conn, username, password):
            id = db_lib.get_user_id_by_username(db_conn, username)
            user = load_user(id)
            login_user(user)

        # close the database connection once we are done with it
        db_conn.close()

        if request.args.get("next") == None:
            return redirect('/')
        else:
            return redirect(request.args.get("next"))
    else:
        return app.send_static_file('login.html')


# somewhere to logout
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return app.send_static_file('logout.html')

# somewhere to admin
@app.route("/admin")
@login_required
#@role_required("administrator")
def admin_home():
	return app.send_static_file('admin.html')

@app.route("/activitycreation")
@login_required
# @role_required("administrator")
def activity_creation():
	return app.send_static_file('activitycreation.html')

@app.route("/activitylist")
@login_required
# @role_required("administrator")
def activity_list():
	return app.send_static_file('activitylist.html')

@app.route("/studentlist")
@login_required
# @role_required("administrator")
def student_list():
	return app.send_static_file('studentlist.html')

@app.route("/teacher")
@login_required
# @role_required("administrator")
def teacher():
    return app.send_static_file('teacher.html')

@app.route("/eval")
@login_required
# @role_required("administrator")
def eval():
    return app.send_static_file('eval.html')

@app.route("/teacher_profile")
@login_required
# @role_required("administrator")
def teacher_profile():
    return app.send_static_file('teacher_profile.html')

@app.route("/student_profile/<int:sid>")
@login_required
# @role_required("administrator")
def student_profile(sid):
    return render_template('student_profile.html', sid=sid)

@app.route("/userlist")
@login_required
# @role_required("administrator")
def userlist():
    return app.send_static_file('userlist.html')




#############################
##### API Routes (Data) #####
#############################

# TODO should probably switch from using ?key=value to using form[]
# see here: http://flask.pocoo.org/docs/0.12/quickstart/

@app.route("/api/activity", methods=["GET", "POST", "PATCH"])#, "DELETE"])
@login_required
def activity():

    db_conn = db_lib.get_db_connection()

    if request.method == 'GET':
        # check parameters to know if they want all activities or a single activity
        if 'activity' in request.args.keys():

            activity_to_be_returned = db_lib.get_activity_by_id(db_conn, request.args['activity'])

            # close the database connection once we are done with it
            db_conn.close()
            return Response(activity_to_be_returned.toJSON())

        else:

            activities = db_lib.get_all_activities(db_conn)

            # close the database connection once we are done with it
            db_conn.close()
            return Response(get_activities_json(activities))

    elif request.method == 'POST':

        title         = request.form['title']
        activity_type = request.form['activity_type']
        instructions  = request.form['instructions']

        created_activity_id = db_lib.create_activity(db_conn, title, activity_type, description)

        # close the database connection once we are done with it
        db_conn.close()
        return Response('{created_activity:' + str(created_activity_id) + '}')

    elif request.method == 'PATCH':
        activity_id = request.args['activity']

        attributes = {
            "title":         request.args['title']         if 'title'         in request.args.keys() else None,
            "activity_type": request.args['activity_type'] if 'activity_type' in request.args.keys() else None,
            "instructions":  request.args['instructions']  if 'instructions'  in request.args.keys() else None
        }

        updated_activity_id = db_lib.update_activity(db_conn, activity_id, attributes)

        # close the database connection once we are done with it
        db_conn.close()
        return Response('{updated_activity:' + str(updated_activity_id) + '}')

    # TODO commented this route out until we get the db activity deleting working
    #elif request.method == 'DELETE':
    #    activity_id = request.args['activity']
    #    deleted_activity_id = db_lib.delete_activity(db_conn, activity_id)

    #    return Response('{deleted_activity:' + str(deleted_activity_id) + '}')


@app.route("/api/activity_type", methods=["GET", "POST"])
@login_required
def activity_type():

    db_conn = db_lib.get_db_connection()

    if request.method == 'GET':

        if 'activity_type' in request.args.keys():

            activity_type_to_be_returned = db_lib.get_activity_type_by_id(db_conn, request.args['activity_type'])

            # close the database connection once we are done with it
            db_conn.close()
            return Response(activity_type_to_be_returned)

        elif 'label' in request.args.keys():

            activity_type_to_be_returned = db_lib.get_activity_type_by_label(db_conn, request.args['label'])

            # close the database connection once we are done with it
            db_conn.close()
            return Response(activity_type_to_be_returned)

        else:

            activity_types_to_be_returned = db_lib.get_all_activity_types(db_conn)

            # close the database connection once we are done with it
            db_conn.close()
            return Response(activity_types_to_be_returned)

    elif request.method == 'POST':

        label = request.args['label']

        created_activity_type_id = db_lib.create_activity_type(db_conn, label)

        # close the database connection once we are done with it
        db_conn.close()
        return Response('{created_activity_type_id:' + str(created_activity_type_id) + '}')


# route for users (creation and retrieval)
@app.route("/api/user", methods=["GET", "POST", "PATCH"])
@login_required
def user():

    db_conn = db_lib.get_db_connection()

    if request.method == 'GET':
        # check parameters to know if they want all users or a single user
        if 'user' in request.args.keys():

            user_to_be_returned = db_lib.get_user_by_id(db_conn, request.args['user'])

            # close the database connection once we are done with it
            db_conn.close()
            return Response(user_to_be_returned.toJSON())

        else:

            users = db_lib.get_all_users(db_conn)

            # close the database connection once we are done with it
            db_conn.close()
            return Response(get_users_json(users))

    elif request.method == 'POST':

        username      = request.args['username']
        password      = request.args['password']
        first_name    = request.args['first_name']
        last_name     = request.args['last_name']
        email_address = request.args['email_address']
        role_label    = request.args['role_label']

        created_user_id = db_lib.create_user(db_conn, username, password, first_name, last_name, email_address, role_label)

        # close the database connection once we are done with it
        db_conn.close()
        return Response('{created_user_id:' + str(created_user_id) + '}')

    elif request.method == 'PATCH':

        user_id = request.args['user']

        attributes = {
            "username":      request.args['username']      if 'username'      in request.args.keys() else None,
            "first_name":    request.args['first_name']    if 'first_name'    in request.args.keys() else None,
            "last_name":     request.args['last_name']     if 'last_name'     in request.args.keys() else None,
            "email_address": request.args['email_address'] if 'email_address' in request.args.keys() else None
        }

        updated_user_id = db_lib.update_user(db_conn, user_id, attributes)

        # close the database connection once we are done with it
        db_conn.close()
        return Response('{updated_user:' + str(updated_user_id) + '}')


# route for students (creation and retrieval)
@app.route("/api/student", methods=["GET", "POST", "PATCH"])
@login_required
def student():

    db_conn = db_lib.get_db_connection()

    if request.method == 'GET':
        # check parameters to know if they want all students or a single student
        # in the future they should be able to pass a parameter here that filters on teachers etc.
        if 'student' in request.args.keys():

            student_to_be_returned = db_lib.get_student_by_id(db_conn, request.args['student'])

            # close the database connection once we are done with it
            db_conn.close()
            return Response(student_to_be_returned.toJSON())

        else:

            students = db_lib.get_all_students(db_conn)

            # close the database connection once we are done with it
            db_conn.close()
            return Response(get_students_json(students))

    elif request.method == 'POST':

        first_name = request.args['first_name']
        last_name  = request.args['last_name']

        created_student_id = db_lib.create_student(db_conn, first_name, last_name)

        # close the database connection once we are done with it
        db_conn.close()
        return Response('{created_student:' + str(created_student_id) + '}')

    elif request.method == 'PATCH':

        user_id = request.args['student']

        attributes = {
            "student_first_name":    request.args['student_first_name']    if 'student_first_name'    in request.args.keys() else None,
            "student_last_name":     request.args['student_last_name']     if 'student_last_name'     in request.args.keys() else None,
        }

        updated_student_id = db_lib.update_student(db_conn, student_id, attributes)

        # close the database connection once we are done with it
        db_conn.close()
        return Response('{updated_student:' + str(updated_student_id) + '}')

# route for the activity data of a particular student (creation and retrieval)
@app.route("/api/student_activity", methods=["GET", "POST"])
@login_required
def student_activity():

    db_conn = db_lib.get_db_connection()

    if request.method == 'GET':

        #Check if they include an activity id to see whether they want to agrregate data on a specific activity
        #Otherwise return list of activities currently assigned to the student
        if 'activity' in request.args.keys():

            student_id  = request.args['student']
            activity_id = request.args['activity']

            student_activity_data_aggregation = db_lib.get_activity_data_by_student_and_activity(db_conn, student_id, activity_id)

            # close the database connection once we are done with it
            db_conn.close()
            return Response(student_activity_data_aggregation.toJSON())

        else:

            student_id  = request.args['student']

            student_activity_list = db_lib.get_activities_by_student(db_conn, student_id)

            # close the database connection once we are done with it
            db_conn.close()
            return Response(get_activities_json(student_activity_list))

    elif request.method == 'POST':
        # TODO temp
        pass

# routes for student-teacher interaction and assigning teachers to students and students to teachers
@app.route("/api/student_teacher",methods=["GET","POST"])
@login_required
def student_teacher():

    db_conn = db_lib.get_db_connection()

    if request.method == 'GET':
        #If it gives me a student id, get me all of the teachers for that student
        if 'student' in request.args.keys():

            students_teacher_list = db_lib.get_teachers_by_student(db_conn, request.args['student'])

            # close the database connection once we are done with it
            db_conn.close()
            return Response(get_users_json(students_teacher_list))

        # if it gives me a teacher id, get me all of the students for that teacher
        elif 'teacher' in request.args.keys():

            teachers_student_list = db_lib.get_students_by_teacher(db_conn, request.args['teacher'])

            # close the database connection once we are done with it
            db_conn.close()
            return Response(get_students_json(teachers_student_list))

    elif request.method == 'POST':

        # Assign student to teacher and vice versa
        student_id = request.args['student']
        teacher_id = request.args['teacher']

        student_teacher_assignment = db_lib.assign_student_to_teacher(db_conn, student_id, teacher_id)

        # close the database connection once we are done with it
        db_conn.close()
        return Response('{student_teacher:' + str(student_teacher_assignment) + '}')



#######################
##### Error Pages #####
#######################

@app.errorhandler(404)
def not_found(e):
    return Response('<p>Error 404: Page Not Found</p>')

@app.errorhandler(401)
def unauthorized(e):
    return Response('<p>Error 401: Unauthorized</p>')

@app.errorhandler(403)
def forbidden(e):
    return Response('<p>Error 403: Forbidden</p>')



########################
##### Startup Code #####
########################

if __name__ == "__main__":
    from os import environ
    debug_flag = False

    # check for the debug flag
    for sys_arg in sys.argv:
        if sys_arg == 'debug':
            debug_flag = True

    app.run(host='0.0.0.0', port=int(environ.get("PORT", 5000)), debug=debug_flag)
