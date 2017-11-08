from flask import Flask, Response, redirect, url_for, request, session, abort
from flask.ext.login import LoginManager, UserMixin, \
                                login_required, login_user, logout_user 

app = Flask(__name__)

# config
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'secret_xxx'
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


# some protected url
@app.route('/')
@login_required
def home():
    return app.send_static_file('index.html')
 
# somewhere to login
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']    
        # TODO Check the database for real login    
        if password == username + "_secret":
            id = username.split('user')[1]
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


# handle login failed
@app.errorhandler(401)
def page_not_found(e):
    return Response('<p>Login failed</p>')
    
    
# callback to reload the user object        
@login_manager.user_loader
def load_user(userid):
    #TODO Return user object from user id #
    return User(userid, 'user' + str(userid))
    

if __name__ == "__main__":
    app.run()
