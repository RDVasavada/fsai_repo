from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
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
from urllib2 import urlopen
import re
import pandas as pd
quandl.ApiConfig.api_key = 'X8CjGKTPEqTuto2v_Q94'
response = requests.get("http://finance.yahoo.com/d/quotes.csv?s=VNET&f=sn")
@csrf_exempt
@login_required
def guru_optimize(request):
  resultFile = open("Screen_criteria.csv",'w')
  wr = csv.writer(resultFile, delimiter=' ',
                            quotechar=' ', quoting=csv.QUOTE_MINIMAL)
  wr.writerow(['Filter_factor;condition;Filter_value'])
  wr.writerow([str(request.POST['xdivy'])])
  wr.writerow([str(request.POST['xmktcap'])])
  wr.writerow([str(request.POST['xnm'])])
  wr.writerow([str(request.POST['xpe'])])
  wr.writerow([str(request.POST['xpb'])])
  wr.writerow([str(request.POST['xepusd'])])
  resultFile.close()
  resultFile = open("Screen_parameters.csv",'w')
  wr = csv.writer(resultFile, delimiter=' ',
                            quotechar=' ', quoting=csv.QUOTE_MINIMAL)
  wr.writerow(['PortfolioID;Screen_frequency;Initial_capital'])
  wr.writerow(['84;BA;1000000000'])
  resultFile.close()
  print
  filename = 'Screen_parameters.csv'
  screen_params = pd.read_csv(filename,delimiter = ';')
  Screen_freq = screen_params.loc[0,'Screen_frequency']
  PortfolioID = screen_params.loc[0,'PortfolioID']
  capital = screen_params.loc[0,'Initial_capital']


  start = '2006-01-01'
  end = (datetime.date.today()-BDay(1))
  snapshots =  pd.DatetimeIndex(start=start,end=end, freq=Screen_freq).tolist()
  snapshots.append(end)
  p_fundamentals_exist = fundamentals_exist = 0                 

  stocks_problematic = pd.DataFrame(columns=['symbol','field'])
  i = j= k = m = 0
  min_factor = 0.67
  max_factor = 1.33
  filename = str(PortfolioID) +'.csv'
  portfolio_imported = pd.read_csv(filename,delimiter = ' ', header=None, names=['PortfolioID', 'Date', 'symbol', 'security_type', 'Number of Shares', 'Price'])


  portfolio_imported['Position_orig'] = portfolio_imported['Price'].multiply(portfolio_imported['Number of Shares'], axis="index")
  portfolio_size = portfolio_imported['Position_orig'].sum(axis=0)
  portfolio_imported['weight_orig_pct'] = np.round(100*(portfolio_imported['Position_orig'].divide(portfolio_size, axis="index")).astype(float),3)

  # Add current prices. If no price available, exclude stock.
  stocks = qu_EOD_trsf('EOD',portfolio_imported['symbol'],field='.11')
  try:
      prices = quandl.get(stocks,start_date=end, end_date=end,collapse='daily')
  except:
      prices = quandl.get(stocks,start_date=end - BDay(1), end_date=end,collapse='daily')
  portfolio_imported['Pricing_current_date'] = prices.iloc[-1].name.date()
  portfolio_imported['Price_current'] = prices.iloc[-1].T.values
  portfolio_imported = portfolio_imported.dropna(subset=['Price_current']) .reset_index(drop=True) 
  stocks = qu_EOD_trsf('EOD',portfolio_imported['symbol'],field='.11')
  try:
      prices = quandl.get(stocks,start_date=snapshots[0], end_date=snapshots[0],collapse='daily')
  except:
      prices = quandl.get(stocks,start_date=snapshots[0] - BDay(4), end_date=snapshots[0],collapse='daily')
  portfolio_imported['Price'] = prices.iloc[-1].T.values
  portfolio_imported = portfolio_imported.dropna(subset=['Price']) .reset_index(drop=True)
  portfolio = portfolio_imported[['PortfolioID','symbol','Price','weight_orig_pct']].copy()
  portfolio['allocated_capital'] = np.round((portfolio['weight_orig_pct']/100).multiply(capital, axis='index'))
  portfolio['Number of Shares'] = np.floor((portfolio['allocated_capital'] / portfolio['Price']).astype(float))
  portfolio['Position'] = portfolio['Price'].multiply(portfolio['Number of Shares'], axis="index")
  capital_left = capital - portfolio['Position'].sum()

  if capital_left > 0: 
      df = portfolio.sort(['Price'], ascending = [1]).iloc[0]
      No_Shares_to_buy = np.floor(capital_left / df['Price'])
      Pos_delta = No_Shares_to_buy*df['Price']
      portfolio.loc[(portfolio['symbol'] == df['symbol']),('Number of Shares')] += No_Shares_to_buy
      portfolio.loc[(portfolio['symbol'] == df['symbol']),('Position')] += Pos_delta
      del df, capital_left           

  portfolio_size = portfolio['Position'].sum(axis=0)
  portfolio['weight'] = np.round(100*(portfolio['Position'].divide(portfolio_size, axis="index")).astype(float),3)
  portfolio_client = portfolio.copy()
  portfolio.drop(['allocated_capital','weight'],axis=1,inplace=True)
  screen_file = 'Screen_criteria.csv'
  screener = pd.read_csv(screen_file,delimiter = ';')
  screener = screener.dropna().reset_index(drop=True)
  screen_list = filter_list(screener)
  quandl.ApiConfig.api_key = 'X8CjGKTPEqTuto2v_Q94'
  for i in range(len(portfolio['symbol'])):
        for j in range(len(screener['Filter_factor'])):
            try:
                df = qu_SF1_trsf('SF1',portfolio['symbol'].iloc[i],screener['Filter_factor'].iloc[j],start,end,'ART','quarterly')
                if j == 0:
                    fundamentals = df.copy()
                else:
                    fundamentals = pd.merge(left=fundamentals,right=df[[screener['Filter_factor'].iloc[j]]], how='left',left_index=True,right_index=True,
                                            suffixes=('_left', '_right'))
                del df
                fundamentals_exist = 1
            except:
                stocks_problematic = stocks_problematic.append({'symbol': portfolio['symbol'].iloc[i]
                                                                ,'field':screener['Filter_factor'].iloc[j]},ignore_index=True)        
                fundamentals_exist = 0
        if fundamentals_exist == 1:
            if p_fundamentals_exist == 0:
                p_fundamentals = fundamentals.copy()
                p_fundamentals_exist = 1
            if i > 0:
                p_fundamentals = p_fundamentals.append(fundamentals)
            del fundamentals
      
  for k in range(len(screener)):
      if k == 0:
          txt = "np.where(((" + "p_fundamentals['" + screener['Filter_factor'][k] + "']" + screener['condition'][k] + screener['Filter_value'][k].astype(str) + ") | (pd.isnull(p_fundamentals['" + screener['Filter_factor'][k] + "'])==True))"
          txt_ct = txt
      else:
          txt = txt + " & ((" + "p_fundamentals['" + screener['Filter_factor'][k] + "']" + screener['condition'][k] + screener['Filter_value'][k].astype(str) + ") | (pd.isnull(p_fundamentals['" + screener['Filter_factor'][k] + "'])==True))" 
          txt_ct = txt
  txt = txt_ct + ",0,1) "
  p_fundamentals.sort_index(inplace=True)
  p_fundamentals['screen_out'] = eval(txt)

  p_fundamentals['date'] = p_fundamentals.index

  pf_input = portfolio.copy()
  for m in range(len(snapshots)):
      pf, screen, pf_ret = Portfolio_Reallocation(pf_input, m,min_factor,max_factor, snapshots, p_fundamentals, screener, screen_list, m)
          
      # returns portfolio if stocks got filtered out. If no filter triggered, returns string  
      if type(pf) != str: 
          # Changes due to filters
          startYear=pf_ret['Start_year'].iloc[0]
          endYear= pf_ret['End_year'].iloc[0]
          expReturn=np.round(pf_ret['Portfolio_return'].iloc[0],2)
          # run MV
          if expReturn > 0:
              try:
                print(pf)
                print("pf")
                pf_optimal = MV(pf,startYear ,endYear,expReturn)
                print(pf_optimal)
                print("optimal")
                pf_optimal['weight_optimal'] = pf_optimal['weight_optimal'].astype(float)
                pf_optimal['Number of Shares bef MV'] = pf_optimal['Number of Shares'].astype(int)
                portfolio_size = np.round(pf_optimal['Position'].sum(),0)
                pf_optimal['Number of Shares'] = np.floor((((pf_optimal['weight_optimal']/100).multiply
                                                  (portfolio_size, axis="index"))/pf_optimal['Price']).astype(float))
                pf_optimal['Position'] = np.round((pf_optimal['Number of Shares'].multiply(pf_optimal['Price'])).astype(float,2))
                portfolio_size = np.round(pf_optimal['Position'].sum(),0)
                pf_optimal['weight'] = np.round(100*(pf_optimal['Position'].divide(portfolio_size, axis="index")).astype(float),2)
                pf_optimal = pf_optimal[['PortfolioID','Snapshot_date','symbol','Price','Number of Shares','Position','weight']]                

                pf_input = pf_optimal.drop('weight',axis=1).copy()
                if m == 0 :
                    portfolio_overview = pf_optimal.copy()
                    return_overview = pf_ret.copy()

                else: 
                  portfolio_overview = portfolio_overview.append(pf_optimal)
                  return_overview = return_overview.append(pf_ret)
              except:
                pf_input = pf[['PortfolioID','Snapshot_date','symbol','Price','Number of Shares','Position','weight']].copy()                
                if m == 0 :    
                   portfolio_overview = pf_input.copy()
                   return_overview = pf_ret.copy()
                else :
                   portfolio_overview = portfolio_overview.append(pf_input)
                   return_overview = return_overview.append(pf_ret)
               #drop weight column for next run   
                pf_input =pf[['PortfolioID','Snapshot_date','symbol','Price','Number of Shares','Position']].copy()
                    # return_overview = pf_ret.copy()
              # Reduce to necessary column
          
          else:
              #equal weighting due to negative returns
             print("ExpReturn smaller than zero,equal weighting instead")
             pf_input = pf[['PortfolioID','Snapshot_date','symbol','Price','Number of Shares','Position','weight']].copy()
             if m==0:                        
                 portfolio_overview = pf_input.copy()
                 return_overview = pf_ret.copy()
             else :
                 portfolio_overview = portfolio_overview.append(pf_input)
                 return_overview = return_overview.append(pf_ret)
             #drop weight column for next run
             pf_input =pf[['PortfolioID','Snapshot_date','symbol','Price','Number of Shares','Position']].copy()
      
      if m == 0 :
          screen_overview = screen.copy()
      else:
          screen_overview = screen_overview.append(screen)
  portfolio_client, portfolio_overview




  filename = 'Screen_parameters.csv'
  screen_params = pd.read_csv(filename,delimiter = ' ',
                                quotechar=' ', quoting=csv.QUOTE_MINIMAL)
  Screen_freq = 'BA'
  PortfolioID = '156'
  capital = '10000000'
  start = '2006-01-01'
  end = (datetime.date.today()-BDay(1))

  snapshots =  pd.DatetimeIndex(start=start,end=end, freq=Screen_freq).tolist()
  snapshots.append(end)
  p_fundamentals_exist = fundamentals_exit = 0                 

  stocks_problematic = pd.DataFrame(columns=['symbol','field'])
  i = j= k = m = 0
  min_factor = 0.67
  max_factor = 1.33
  filename = str(PortfolioID) +'.csv'
  portfolio_imported = pd.read_csv(filename,delimiter = ' ', header=None, names=['PortfolioID', 'Date', 'symbol', 'security_type', 'Number of Shares', 'Price'])


  portfolio_imported['Position_orig'] = portfolio_imported['Price'].multiply(portfolio_imported['Number of Shares'], axis="index")
  portfolio_size = portfolio_imported['Position_orig'].sum(axis=0)
  portfolio_imported['weight_orig_pct'] = np.round(100*(portfolio_imported['Position_orig'].divide(portfolio_size, axis="index")).astype(float),3)

  # Add current prices. If no price available, exclude stock.
  stocks = qu_EOD_trsf('EOD',portfolio_imported['symbol'],field='.11')
  try:
      prices = quandl.get(stocks,start_date=end, end_date=end,collapse='daily')
  except:
      prices = quandl.get(stocks,start_date=end - BDay(1), end_date=end,collapse='daily')

  portfolio_imported['Pricing_current_date'] = prices.iloc[-1].name.date()
  portfolio_imported['Price_current'] = prices.iloc[-1].T.values

  portfolio_imported = portfolio_imported.dropna(subset=['Price_current']) .reset_index(drop=True) 

  # For Backtesting: Only include stocks which have a price as of today AND to the beginning of the period

  stocks = qu_EOD_trsf('EOD',portfolio_imported['symbol'],field='.11')
  try:
      prices = quandl.get(stocks,start_date=snapshots[0], end_date=snapshots[0],collapse='daily')
  except:
      prices = quandl.get(stocks,start_date=snapshots[0] - BDay(4), end_date=snapshots[0],collapse='daily')
  portfolio_imported['Price'] = prices.iloc[-1].T.values
  portfolio_imported = portfolio_imported.dropna(subset=['Price']) .reset_index(drop=True)
  print(screen_overview)
  print(portfolio_overview)
  stocks = portfolio_overview['symbol'].tolist()
  Snapshot_date = portfolio_overview['Snapshot_date'].tolist()
  price = portfolio_overview['Price'].tolist()
  no_of_shares = portfolio_overview['Number of Shares'].tolist()
  _screenedOut = screen_overview['screen_out'].to_dict()
  screenedPortfolio = {}
  rtnportfolio = {}
  rtnportfolio['stocks'] = stocks
  rtnportfolio['price'] = price
  rtnportfolio['no_of_shares'] = no_of_shares
  rtnportfolio['Snapshot_date'] = Snapshot_date
  oldportfolio = {}
  return JsonResponse({'post':rtnportfolio,'pre':_screenedOut})


def Portfolio_Reallocation(portfolio_input, j, min_factor, max_factor, snapshots, p_fundamentals, screener, screen_list, m):

    portfolio = portfolio_input.copy()
    cash_total = 0

    end = snapshots[j]

    ##################################################
    # Calculate Portfolio Positions (bef. Screening) #
    ##################################################

    stocks = qu_EOD_trsf('EOD',list_stocks=portfolio['symbol'],field='.11')

    try:
        prices = quandl.get(stocks,start_date=end, end_date=end,collapse='daily')
    except:
        prices = quandl.get(stocks,start_date=end - datetime.timedelta(days=4), end_date=end,collapse='daily')


    portfolio['Price'] = prices.iloc[-1].T.values
    ######### NEUER TEIL
    portfolio = portfolio.dropna(subset=['Price']).reset_index(drop=True) 
    
    portfolio['Pricing_date'] = prices.iloc[-1].name.date()
    portfolio['Snapshot_date'] = end

    # Calculate portfolio positions and weights
    portfolio['Position'] = portfolio['Price'].multiply(portfolio['Number of Shares'], axis="index")
    portfolio_size = portfolio['Position'].sum(axis=0)
    portfolio['weight_bef_screen_pct'] = np.round(100*(portfolio['Position'].divide(portfolio_size, axis="index")).astype(float),3)

    ########################
    # Portfolio Screening #
    #######################

    # get screening infos from p_fundamentals

    df = pd.merge(left=portfolio,right=p_fundamentals,how='left',left_on=['symbol'],right_on=['symbol'],
                       suffixes=('_left', '_right'))
    df['diff'] = (df['Snapshot_date']-df['date']).astype('timedelta64[D]')
    # problem; snapshot date is business date end (in order to get price data) but fundamental data is as of date end,
    # therefore it might happen that snapshot_date (=pricing date) is smaller than date (=date of fundamentals)
    df2 = df[df['diff']>=-4].groupby(['symbol'], as_index=False)['diff'].min()

    df = pd.merge(left=df,right=df2,how='inner',left_on=['symbol','diff'],right_on=['symbol','diff'],
                       suffixes=('_left', '_right'))

    

    # identify necessary columns (symbol and filter criteria):
    k=0
    for k in range(len(screener)):

        if k ==0:
            cols = "['symbol', '" + screener['Filter_factor'][k] + "',"

        if k > 0 and k < max(range(len(screener))):
            cols = cols + "'" + screener['Filter_factor'][k] + "',"

        if k  == max(range(len(screener))):
            cols = cols + "'" + screener['Filter_factor'][k] + "', 'screen_out']"

    portfolio = pd.merge(left=portfolio,right=df[eval(cols)],
                          how='left',left_on=['symbol'],right_on=['symbol'],
                       suffixes=('_left', '_right'))

    portfolio['screen_out'].fillna(0, inplace=True)
    #Log Screen results
    #df_screen = portfolio.copy().drop(['Pricing_date'], axis=1)
    cols = ['PortfolioID', 'Snapshot_date','symbol','Position','weight_bef_screen_pct']  + [col for col in portfolio if col in screen_list]
    df_screen = portfolio[cols].copy().reset_index(drop=True)
    
    
    
    max_snapshot = range(len(snapshots))[-1]
    if portfolio[portfolio['screen_out']==1]['Position'].sum() > 0 or m ==max_snapshot : 
    
        ################################################################################################    
        #Portfolio Reallocation: Distribute cash to other portfolio holdings (Equal Weighting)
        ################################################################################################
        #Calculate cash position
        cash_total = portfolio[portfolio['screen_out']==1]['Position'].sum()
        cash_per_position = cash_total / len(portfolio[(portfolio['screen_out']==0) 
                                                       & (pd.isnull(portfolio['Price'])==False)]['Position'])
        #Set positions which are filtered out to 0 
        portfolio['Position_bef_screen'] = portfolio['Position']
        portfolio['Number of Shares before'] = portfolio['Number of Shares']
        portfolio['Number of Shares'] = np.where(portfolio['screen_out'] == 1, 0, portfolio['Number of Shares'])
        portfolio['Position'] = np.where(portfolio['screen_out'] == 1, 0, portfolio['Position'])

        # Buy new shares
        portfolio['Number of Shares to buy'] = np.where((portfolio['screen_out'] == 1) 
                                                        | (pd.isnull(portfolio['Price']) == True),
                                                        0,np.floor((cash_per_position / portfolio['Price']).astype(float)))

        portfolio['Position_delta'] = portfolio['Number of Shares to buy']*portfolio['Price']
        portfolio['Position'] += portfolio['Position_delta']
        portfolio['Number of Shares'] = (portfolio['Number of Shares'] + portfolio['Number of Shares to buy']).astype(int)

        # If some cash left, buy the stock with the lowest price
        cash_left = cash_total - portfolio['Position_delta'].sum()
        if cash_left > 0: 
            df = portfolio[portfolio['screen_out']==0].sort(['Price'], ascending = [1]).iloc[0]
            No_Shares_to_buy = np.floor(cash_left / df['Price'])
            Pos_delta = No_Shares_to_buy*df['Price']
            portfolio.loc[(portfolio['symbol'] == df['symbol']),('Number of Shares to buy')] += No_Shares_to_buy
            portfolio.loc[(portfolio['symbol'] == df['symbol']),('Number of Shares')] += No_Shares_to_buy
            portfolio.loc[(portfolio['symbol'] == df['symbol']),('Position_delta')] += Pos_delta
            portfolio.loc[(portfolio['symbol'] == df['symbol']),('Position')] += Pos_delta
            del df           
        cash_left = cash_total - portfolio['Position_delta'].sum()  
        # After screening, recalculate portfolio weights
        portfolio_size = portfolio['Position'].sum(axis=0)

        portfolio['weight_aft_screen_pct'] = np.round(100*(portfolio['Position'].divide(portfolio_size, axis="index")).astype(float),3)

        portfolio['weight_aft_screen_pct'].fillna(0, inplace=True)
        
        ################################################################################################    
        # Delete stocks which are filtered out from portfolio
        ################################################################################################

        portfolio = portfolio[portfolio.screen_out ==0].reset_index(drop=True)

        #Remove stocks with NaN weight (Nan weight due to missing price data)
        portfolio = portfolio[portfolio.weight_aft_screen_pct != 0.0].reset_index(drop=True)

        ################################################################################################    
        # Add minimum and maximum weights for Portfoliovisualizer
        ################################################################################################
        
        # Add minimum and maximum weight
        portfolio['Min_weight'] = np.round(np.maximum(np.minimum(min_factor*portfolio['weight_aft_screen_pct'],
                                            portfolio['weight_aft_screen_pct'] - 1.0),1.0),0)
        
        portfolio['Max_weight'] = np.round(np.minimum(np.maximum(max_factor*portfolio['weight_aft_screen_pct'],
                                            portfolio['weight_aft_screen_pct'] + 1.0),100.0),0)

        portfolio = portfolio.rename(columns={'weight_aft_screen_pct' : 'weight'})
        #drop unnecessary columns
        portfolio = portfolio.drop(['Number of Shares to buy','Position_delta'], 1).drop(eval(screen_list),axis=1)
      

        #portf_pv = portfolio_overview[['PortfolioID','Snapshot_date','symbol','Number of Shares','Price','Position','weight_aft_screen_pct',
        #                               'return']].copy()

        
        

        ################################################################################################    
        # Calculate annual stock return and portfolio return
        ################################################################################################

        # You can hand over to Portfoliovisualizer only beginning year and end year. 
        # Not a problem with end of year (year end in live mode would always end at the most current snapshot. 
        # Given that we can only assign a start year (and not an exact date within that year), we need to calculate
        # the return also based on the beginning of the start year and then annualize the return.
        # example: Today is May first 2016, some stocks get filtered out the portfolio, therefore we need to run Portf. visualizer
        # my specified period is end year = 2016 and beginning year = 2015. 
        # When calculating the return, I cannot simply do May first 2016 / May first 2015 - 1 because Portfoliovisualizer uses JAN 1st 2015 as starting date. 
        # In order to match returns, we will therefore also calculate May first 2016 / January first 2015 -1 and annualise the return.

        if end.month == 12:
            start = (end - datetime.timedelta(days=365))
                # last business day last year
        else:
            start = date(end.year-2,12,31) 

        stocks = qu_EOD_trsf('EOD',list_stocks=portfolio['symbol'],field='.11')
        # print(stocks)
        monthly_returns = quandl.get(stocks,start_date=start, end_date=end,collapse='monthly',transform='rdiff')

        # print(len(monthly_returns))
        portfolio['return'] = np.round(((monthly_returns +1).prod(axis=0)**(12/len(monthly_returns)) -1),3).T.values


        portfolio_return = np.round((portfolio['return']*portfolio['weight']),1).sum()

        df1 = {'PortfolioID' : [portfolio['PortfolioID'].loc[0]],
               'Snapshot_date' : end,
               'Start_year' : monthly_returns.iloc[0].name.date().year,
               'End_year' : end.year,
               'Portfolio_return' : portfolio_return}

        pf_return = pd.DataFrame(df1, columns=['PortfolioID','Snapshot_date','Start_year','End_year','Portfolio_return'])
        print(portfolio)
        return portfolio, df_screen, pf_return
    
    else :
        return 'No_changes_as_no_screen_triggered',df_screen,'No_changes_as_no_screen_triggered'





def qu_EOD_trsf(db=None,list_stocks=None,field=None):
    
    list_stocks = list_stocks.str.replace('-','_').str.replace('.','_').tolist()
        
    stocks = [db + '/' + x + field for x in list_stocks]

    return stocks

def qu_SF1_trsf(db=None,ticker=None,field=None,start=None,end=None,dimension=None,freq=None):
    
    # Adapt ticker to quandl syntax
    tick_quandl = ticker.replace('.', '')
    tick_quandl = tick_quandl.replace('_', '')

    if field == 'PB':     
            qu = db + "/" + tick_quandl + "_" +field+ "_ARY"
    if field in ('DIVYIELD','MARKETCAP'):        
            qu = db + "/" + tick_quandl +'_' + field 
    if field not in ('PB','DIVYIELD','MARKETCAP'):        
            qu = db + "/" + tick_quandl +'_' +field+'_' + dimension

    df = quandl.get(qu,
                    start_date=start, end_date=end,
                    collapse=freq, returns='pandas')

    df['symbol'] = ticker
    df.rename(columns={'Value': field }, inplace=True)
    return df


def filter_list(screener):
  cols = ""
  for index in range(len(screener)):
    if index ==0:
        print("one")
        cols = "['" + screener['Filter_factor'][index] + "\',"
        print cols
    elif index > 0 and index < max(range(len(screener))):
        print("two")
        cols = cols + "'" + screener['Filter_factor'][index] + "',"
        print cols
    elif index  == max(range(0,len(screener))):
        print("three")
        cols = cols + "'" + screener['Filter_factor'][index] + "', 'screen_out']"
        print cols
  return cols






def MV(pf_input, startYear,endYear,expReturn):
#Import Dependencies
#from bs4 import BeautifulSoup
#from urllib.request import urlopen
#import re
#import pandas as pd

    #Declare Vars
    minWeights = []
    maxWeights = []
    tickers = []
    expReturn = expReturn
    startYear = startYear
    endYear = endYear
    optWeights = []

    #Build

    for item in pf_input['Min_weight']:
        minWeights.append(item)
    for item in pf_input['Max_weight']:
        maxWeights.append(item)
    for item in pf_input['symbol']:
        tickers.append(item)

    #Create Scrape-URL-Link
    urlArr = []
    count = int(1)
    url = "https://www.portfoliovisualizer.com/optimize-portfolio?s=y&startYear=" + str(startYear)
    url = url + "&endYear=" + str(endYear)
    url = url + "&goal=3&targetAnnualReturn=" + str(expReturn)
    for x,y,z in zip(minWeights, maxWeights, tickers):
        rtnStr = "&symbol" + str(count)
        rtnStr += "=" + str(z)
        rtnStr += "&minWeight" + str(count) + "=" + str(x)
        rtnStr += "&maxWeight" + str(count) + "=" + str(y) 
        print(rtnStr)
        count += int(1)
        urlArr.append(rtnStr)
        tail = "".join(urlArr)
        url += tail 

    #Open URL and Scrape
    soup = BeautifulSoup(urlopen(url), "html.parser")
    try:
      soup = soup.find_all("tbody")[2]
      soup = soup.find_all("td", class_="numberCell")
      weightArr = []
      for item in soup:
          newitem = (str(item))
          x = float(newitem)
          if math.isnan(x):
            weightArr.append(re.sub("[^0-9.]", "", "0.1"))
          else:
            weightArr.append(re.sub("[^0-9.]", "", newitem))
      df2 = pd.DataFrame({'weight_optimal': weightArr })
      return pf_input.join(df2)
    except:
      return("error")

    #Append weightArr to Dataframe




