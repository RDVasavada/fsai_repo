from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from portal.views.user.top_portfolios import get_top_portfolios
from django.middleware.csrf import rotate_token
import requests
import pandas as pd
import numpy as np
import quandl
import csv
import string
import datetime
from django.views.decorators.csrf import csrf_exempt
from datetime import date
from pandas.tseries.offsets import BDay
from bs4 import BeautifulSoup
# from urllib.request import urlopen
import re
import pandas as pd
quandl.ApiConfig.api_key = 'X8CjGKTPEqTuto2v_Q94'

@csrf_exempt
@login_required
def guru_optimize(request):
  # pe = request.POST['key-pe']
  # if str(pe) == str(0):
  #   pe = "PE;;"
  # else: 
  #   pe = "PE;>=;"+ str(request.POST['key-pe'])
  # pb = request.POST['key-pb']
  # if str(pb) == str(0):
  #   pb = "PB;;"
  # else:
  #   pb = "PB;>=;"+ str(request.POST['key-pb'])
  # mkt = request.POST['key-mkt']
  # if str(mkt) == str(0):
  #   mkt = "MARKETCAP;;"
  # else:
  #   mkt = "MARKETCAP;>=;"+ str(request.POST['key-mkt'])
  # divy = request.POST['key-divy']
  # if str(divy) == str(0):
  #   divy = "DIVYIELD;;"
  # else: 
  #   divy = "DIVYIELD;>=;" + str(request.POST['key-divy'])
  # epusd = request.POST['key-epusd']
  # if str(epusd) == str(0):
  #   epusd = "EPUSD;;"
  # else:
  #   epusd = "EPUSD;>=;" + str(request.POST['key-epusd'])
  # nm = request.POST['key-nm']
  # if str(nm) == str(0):
  #   nm = "NETMARGIN;;"
  # else:
  #   nm = "NETMARGIN;>=;" + str(request.POST['key-nm'])
  # resultFile = open("Screen_criteria.csv",'w')
  # wr = csv.writer(resultFile, delimiter=' ',
  #                           quotechar=' ', quoting=csv.QUOTE_MINIMAL)
  # wr.writerows(['Filter_factor;condition;Filter_value',divy,mkt,nm,pe,pb,epusd])
  # resultFile.close()
  # resultFile = open("Screen_parameters.csv",'w')
  # wr = csv.writer(resultFile, delimiter=' ',
  #                           quotechar=' ', quoting=csv.QUOTE_MINIMAL)
  # wr.writerows(['PortfolioID;Screen_frequency;Initial_capital','2;BA;10000000'])
  # resultFile.close()  
  # filename = 'Screen_parameters.csv'
  # screen_params = pd.read_csv(filename,delimiter = ' ',
  #                               quotechar=' ', quoting=csv.QUOTE_MINIMAL)
  # Screen_freq = 'BA'
  # PortfolioID = '3'
  # capital = '10000000'
  # start = '2006-01-01'
  # end = (datetime.date.today()-BDay(1))

  # snapshots =  pd.DatetimeIndex(start=start,end=end, freq=Screen_freq).tolist()
  # snapshots.append(end)
  # p_fundamentals_exist = fundamentals_exit = 0                 

  # stocks_problematic = pd.DataFrame(columns=['symbol','field'])
  # i = j= k = m = 0
  # min_factor = 0.67
  # max_factor = 1.33
  # filename = str(PortfolioID) +'.csv'
  # portfolio_imported = pd.read_csv(filename,delimiter = ' ', header=None, names=['PortfolioID', 'Date', 'symbol', 'security_type', 'Number of Shares', 'Price'])


  # portfolio_imported['Position_orig'] = portfolio_imported['Price'].multiply(portfolio_imported['Number of Shares'], axis="index")
  # portfolio_size = portfolio_imported['Position_orig'].sum(axis=0)
  # portfolio_imported['weight_orig_pct'] = np.round(100*(portfolio_imported['Position_orig'].divide(portfolio_size, axis="index")).astype(float),3)

  # # Add current prices. If no price available, exclude stock.
  # stocks = qu_EOD_trsf('EOD',portfolio_imported['symbol'],field='.11')
  # try:
  #     prices = quandl.get(stocks,start_date=end, end_date=end,collapse='daily')
  # except:
  #     prices = quandl.get(stocks,start_date=end - BDay(1), end_date=end,collapse='daily')

  # portfolio_imported['Pricing_current_date'] = prices.iloc[-1].name.date()
  # portfolio_imported['Price_current'] = prices.iloc[-1].T.values

  # portfolio_imported = portfolio_imported.dropna(subset=['Price_current']) .reset_index(drop=True) 

  # # For Backtesting: Only include stocks which have a price as of today AND to the beginning of the period

  # stocks = qu_EOD_trsf('EOD',portfolio_imported['symbol'],field='.11')
  # try:
  #     prices = quandl.get(stocks,start_date=snapshots[0], end_date=snapshots[0],collapse='daily')
  # except:
  #     prices = quandl.get(stocks,start_date=snapshots[0] - BDay(4), end_date=snapshots[0],collapse='daily')
  # portfolio_imported['Price'] = prices.iloc[-1].T.values
  # portfolio_imported = portfolio_imported.dropna(subset=['Price']) .reset_index(drop=True) 

  html = get_top_portfolios(request, 'user/guru_optimize.html')
  return HttpResponse(html)


