from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from portal.views.user.top_portfolios import get_top_portfolios
from django.middleware.csrf import rotate_token
from django.views.decorators.csrf import csrf_exempt
import json 
from urllib2 import urlopen
from django.template import RequestContext, Context, loader
import requests
from bs4 import BeautifulSoup
@login_required
def guru_settings(request):
  rotate_token(request)
  # picks = requests.get("https://www.gurufocus.com/api/public/user/c1a72ad16235bed6e762ac34b11d34db:e2285097ad0c7db93e020623fc0022d0/guru/84/aggregated")
  # picks = picks.json()
  # print(picks)
  # bg = picks['84']['port']
  # rm = picks['10']['port']
  # dy = picks['91']['port']
  # fpa = picks['6']['port']
  # mf = picks['17']['port']
  # sk = picks['28']['port']
  # ds = picks['139']['port']
  # dw = picks['56']['port']
  # bb = picks['22']['port']
  # mh = picks['2']['port']
  # ca = picks['64']['port']
  # rb = picks['62']['port']
  # el = picks['15']['port']
  # ls = picks['156']['port']
  # wt = picks['55']['port']
  context_dict = {}
  # contex_dict['bg']=bg
  # contex_dict['rm']=rm
  # contex_dict['dy']=dy
  # contex_dict['fpa']=pa
  # contex_dict['mf']=mf
  # contex_dict['sk']=sk
  # contex_dict['ds']=ds
  # contex_dict['dw']=dw
  # contex_dict['bb']=bb
  # contex_dict['mh']=mh
  # contex_dict['ca']=ca
  # contex_dict['rb']=rb
  # contex_dict['el']=el
  # contex_dict['ls']=ls
  # contex_dict['wt']=wt
  # context_dict['picks'] = picks
  t = loader.get_template('user/guru_settings.html')
  c = Context(context_dict)
  html = t.render(context_dict)
  return HttpResponse(html)

@csrf_exempt
def guru_portfolio(request, guru_id):
  rtnlist = find(guru_id)
  return JsonResponse({'data':rtnlist})

def find(chosen):
  guru = "https://www.gurufocus.com/api/public/user/c1a72ad16235bed6e762ac34b11d34db:e2285097ad0c7db93e020623fc0022d0/guru/" + str(chosen) + "/aggregated"
  gurusoup = BeautifulSoup(urlopen(guru))
  try:
    g = gurusoup.body.contents[0]
    d = json.loads(g)
  except TypeError:
    g = gurusoup.p.contents[0]
    d = json.loads(g)   
  guruarr = []
  for key in d:
    for pick in d[key]["port"]:
      guruarr.append(pick)
  return(guruarr)  