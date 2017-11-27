from flask import Flask, Response, redirect, url_for, request, session, abort, send_from_directory
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user

import sys
sys.path.insert(0, 'inc')

import db_lib

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


# silly user model
class User(UserMixin):

    def __init__(self, id, name):
        self.id = id
        self.name = name

    def __repr__(self):
        return "%d/%s/%s" % (self.id, self.name)


@app.route('/')
@login_required
def home():
   return app.send_static_file('index.html')

@app.route('/api/activity')
@login_required

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

# somewhere to login
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        db_conn = db_lib.get_db_connection()

        if db_lib.authenticate(db_conn, username, password):
            id = db_lib.get_user_id(db_conn, username)
            user = load_user(id)
            login_user(user)
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
    return Response('<p>Logged out</p>')

# get all activites
@app.route("/api/activity", methods=["GET", "POST"])
@login_required
def activity():

    db_conn = db_lib.get_db_connection()

    if request.method == 'POST':
        # TODO temp
        pass
    elif request.method == 'GET':

        activites = db_lib.get_all_activites(db_conn)

        result_string = '['
        for activity in activites:
            result_string += '{"id": ' + activity.get_id() + ', "title": ' + activity.get_title()
	    result_string += ', "Description": ' + activity.get_description() + "}\n"
	result_string += ']'
        return Response(result_string)

@app.route("/admin")
@login_required
def admin_home():
    return app.send_static_file('admin.html')




@app.errorhandler(404)
def not_found(e):
    return Response('<p>Error 404: Page Not Found</p>')

@app.errorhandler(401)
def unauthorized(e):
    return Response('<p>Error 401: Unauthorized</p>')

@app.errorhandler(403)
def forbidden(e):
    return Response('<p>Error 403: Forbidden</p>')


# callback to reload the user object
@login_manager.user_loader
def load_user(userid):
    # TODO Return user object from user id #
    return User(userid, 'user' + str(userid))


if __name__ == "__main__":
    from os import environ
    app.run(host='0.0.0.0', port=environ.get("PORT", 5000))
