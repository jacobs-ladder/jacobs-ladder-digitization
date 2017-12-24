from flask import Flask, Response, redirect, url_for, request, session, abort, send_from_directory
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user
import json

import sys
sys.path.insert(0, 'inc')

import db_lib
from activity import get_activities_json
from user import get_users_json

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

# callback to reload the user object
@login_manager.user_loader
def load_user(userid):
    # TODO Return user object from user id #
    return User(userid, 'user' + str(userid))

# silly user model
# TODO this class needs to be reconciled with our other user class
class User(UserMixin):

    def __init__(self, id, name):
        self.id = id
        self.name = name

    def __repr__(self):
        return "%d/%s/%s" % (self.id, self.name)


##################################################
##### Delivering files to Client-Side Routes #####
##################################################

@app.route('/js/<path:path>')
@login_required
def send_js(path):
    if '..' in path:
        return abort(403)
    return send_from_directory('js', path)

@app.route('/css/<path:path>')
def send_css(path):
    if '..' in path:
        return abort(403)
    return send_from_directory('css', path)



#######################
##### Page Routes #####
#######################

@app.route('/')
@login_required
def home():
   return app.send_static_file('admin.html')


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
	    if request.args.get("next") == None:
		return redirect("");
            return redirect(request.args.get("next"))
        else:
            return abort(401)
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
def admin_home():
    return app.send_static_file('admin.html')



#############################
##### API Routes (Data) #####
#############################

# get all activites
@app.route("/api/activity", methods=["GET", "POST"])
@login_required
def activity():

    db_conn = db_lib.get_db_connection()

    if request.method == 'POST':
        title       = request.args['title']
        description = request.args['description']

        created_activity_id = db_lib.create_activity(db_conn, title, description)

        return Response('{created_activity:' + str(created_activity_id) + '}')
    elif request.method == 'GET':
        # check parameters to know if they want all activities or a single activity
        if 'activity' in request.args.keys():
            activity_to_be_returned = db_lib.get_activity_by_id(db_conn, request.args['activity'])
            return Response(activity_to_be_returned.toJSON())
        else:
            activities = db_lib.get_all_activites(db_conn)
            return Response(get_activities_json(activities))


# route for users (creation and retrieval)
@app.route("/api/user", methods=["GET", "POST"])
@login_required
def user():

    db_conn = db_lib.get_db_connection()

    if request.method == 'POST':
        username      = request.args['username']
        password      = request.args['password']
        first_name    = request.args['first_name']
        last_name     = request.args['last_name']
        email_address = request.args['email_address']
        role_label    = request.args['role_label']

        created_user_id = db_lib.create_user(db_conn, username, password, first_name, last_name, email_address, role_label)

        return Response('{created_user_id:' + str(created_user_id) + '}')
    elif request.method == 'GET':
        # check parameters to know if they want all users or a single user
        if 'user' in request.args.keys():
            user_to_be_returned = db_lib.get_user_by_id(db_conn, request.args['user'])
            return Response(user_to_be_returned.toJSON())
        else:
            users = db_lib.get_all_users(db_conn)
            return Response(get_users_json(users))


# route for students (creation and retrieval)
@app.route("/api/student", methods=["GET", "POST"])
@login_required
def student():

    db_conn = db_lib.get_db_connection()

    if request.method == 'POST':
        first_name = request.args['first_name']
        last_name  = request.args['last_name']

        created_student_id = db_lib.create_student(db_conn, first_name, last_name)

        return Response('{created_student:' + str(created_student_id) + '}')
    elif request.method == 'GET':
        # check parameters to know if they want all students or a single student
        # in the future they should be able to pass a parameter here that filters on teachers etc.
        if 'student' in request.args.keys():
            student_to_be_returned = db_lib.get_student_by_id(db_conn, request.args['user'])
            return Response(student_to_be_returned.toJSON())
        else:
            students = db_lib.get_all_students(db_conn)
            return Response(get_students_json(students))


# route for the activity data of a particular student (creation and retrieval)
@app.route("/api/student_activity", methods=["GET", "POST"])
@login_required
def student_activity():

    db_conn = db_lib.get_db_connection()

    if request.method == 'POST':
        # TODO temp
        pass
    elif request.method == 'GET':
        student_id  = request.args['student']
        activity_id = request.args['activity']

        student_activity_data_aggregation = db_lib.get_activity_data_by_student_and_activity(db_conn, student_id, activity_id)
        return Response(student_activity_data_aggregation.toJSON())



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
