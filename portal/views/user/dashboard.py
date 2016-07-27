from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import pusher
import os
from flask import Flask, render_template, request

app = Flask(__name__)

app_id = os.environ.get('226549')
key = os.environ.get('494655f2d7fa16cf1fd7')
secret = os.environ.get('b1e306b6252db57482f5')
p = pusher.Pusher(
  app_id='226549',
  key='494655f2d7fa16cf1fd7',
  secret='b1e306b6252db57482f5'
)

@app.route("/")
def show_index():
  return render_template('user/dashboard.html')

@app.route("/user/notification")
def trigger_notification():
  p['live_notification'].trigger('new_notification',{'message':'hi'})
  return "Notification triggered!"

if __name__ == "__main__":
  app.run(debug=True)


@login_required
def dashboard(request):
	return render(request, 'user/dashboard.html')
