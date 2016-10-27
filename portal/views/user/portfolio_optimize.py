from time import gmtime, strftime
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import requests
import json
from collections import OrderedDict
from django.template import RequestContext, Context, loader
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from django.db import connection
from portal.models.data.stock import Stock
from portal.views.user import top_portfolios

@login_required
@csrf_exempt
def portfolio_optimize(request):
    if request.user.is_authenticated():
        username = request.user.username
        userid = request.user.id
    optimizeSearchResults = []
    eachStockresult = {}
    eachStockresult['months'] = (request.POST['Months'])
    eachStockresult['market'] = (request.POST['Market'])
    eachStockresult['investingAmount'] = (request.POST['investing_amount'])
    eachStockresult['numStocks'] = (request.POST['stocks_number'])
    eachStockresult['expectedRisk'] = (request.POST['expRisk'])
    eachStockresult['expectedReturn'] = (request.POST['expReturn'])
    optimizeSearchResults.append(eachStockresult)
    stocks = ['VNET','AKAM','BCOR','WIFI','CARB','JRJC','CCIH','CNV ','CCOI','ELNK','ENV ','FB','GDDY','GOOGL','IAC ','IIJI','INAP ','IPAS','JCOM','LOGL','LLNW','MEET','MEET','MOMO','NTES','NEWC','EGOV','NQ  ','OTOW','OPESY','PTOP','PPPI','RAX ','BLNK','NAME','SIFY','SINA','SMCE','SOHU','FCCN','SNST','TCTZF','TCEHY','DIDG','TMMI','TRON','TCX','TWTR','VLTC','WEB','JMU','XNET','YHOO','YAHOY','YNDX','YOOIF','YIPI']
    numshares = int(request.POST['stocks_number'])/2
    context_dict = {}
    context_dict['stock_invest'] = int(request.POST['investing_amount'])/int(request.POST['stocks_number'])
    context_dict['investingAmount'] = (request.POST['investing_amount'])
    context_dict['market'] = (request.POST['Market'])
    context_dict['Months'] = (request.POST['Months'])
    context_dict['Years'] = (request.POST['Years'])
    context_dict['expectedReturn'] = (request.POST['expReturn'])
    context_dict['expectedRisk'] = (request.POST['expRisk'])
    if request.POST['portname'] == "":
        context_dict['portname'] = "Test Portfolio"
    else: 
        context_dict['portname'] = request.POST['portname']
        time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    client_name = request.POST['clientname']
    description = request.POST['description']
    cursor = connection.cursor()
    cursor.execute("INSERT INTO `portal_portfolio` (name,created_date,update_date,description,risk,timeframe,control_market,investment,user_id, client_name) VALUES "
                    "('" + str(context_dict['portname']) + "','" + str(time) + "','" + str(time) + "','" + str(description) + "','" + str(context_dict['expectedRisk']) + "','" + str(context_dict['Years']) + "','" + str('S') + "','" + str(context_dict['investingAmount']) + "','" + str(userid) + "','" + str(client_name) + "')")
    cursor.execute("SELECT LAST_INSERT_ID();")
    show_id = dictfetchall(cursor)[0]['LAST_INSERT_ID()']
    newstocks = []  
    for num in range(numshares):
        cursor = connection.cursor()
        cursor.execute("INSERT INTO `portal_stock` (created_date, update_date, ticker, show_id, buy_date, current_price, initial_price, number_of_shares, sell_date) VALUES"
                        "('2016-07-09 12:12:12','2016-07-09 12:12:12','" + str(stocks[num]) + "','" + str(show_id) + "','2016-07-29','21.25','25.45','2','2016-09-01')")
        newstocks.append(stocks[num])
    # new_investment = request.POST['investingAmount']
    # if request.POST['Market'] == "S&P500":
    #     new_market = "S"
    # elif request.POST['Market'] == "Nasdaq":
    #     new_market = "N"
    # else:
    #     new_market = "D"
    # new_risk = 33

    print(request.POST)
    #end Adam's mock data --->
    # return render(request, 'user/portfolio_optimize.html', RequestContext(request))
    # 52.77.239.179:8080 - THE AWS instance of Ramana
    # 52.28.177.9:8888 - The AWS instance og prashant
    # socket.create_connection(('52.28.177.9', '8888'), timeout=2)
    # response = requests.get("http://52.77.239.179:8080/api-auth/portfolioOptimizer?format=json" + "&expRisk=20" +
    #                             "&timeFrame=" + request.POST['Months'] + "&expRet=30&investingAmount=" +
    #                             str(request.POST['investing_amount']) + "&noOfStocks=" + str(request.POST['stocks_number']),
    #         headers= {
    #             'FSAIAUTHENTICATION': 'Basic ZnNhaV91c2VyOmZzYWlAMTIz'
    # })

    # if(response.status_code != 200):
    #      raise Exception('GET /api-auth/portfolioOptimizer {}'.format(response.status_code))
    # else:
    #     #print(response.json())
    #     jsonResponse = response.json()
    #     stockInfo = jsonResponse['stockInfo']
    #     numStocks = jsonResponse['numStocks']
    #     #print(stockInfo)
    #     optimizeSearchResults = []
    #     eachStockresult = {}
    #     for i in range(len(stockInfo)):
    #         #print(stockInfo[i]['ExpectedReturn']);
    #         riskLevel = ""
    #         if float(stockInfo[i]['ExpectedRisk']) <= 20:
    #             riskLevel = "Low";
    #         elif float(stockInfo[i]['ExpectedRisk']) > 20 and float(stockInfo[i]['ExpectedRisk']) <= 50:
    #             riskLevel = "Medium";
    #         else:
    #             riskLevel = "High";

    #         eachStockresult['companyName'] = stockInfo[i]['name']
    #         eachStockresult['tickerSymbol'] = stockInfo[i]['ticker']
    #         eachStockresult['buyDate'] = stockInfo[i]['StartDate']
    #         eachStockresult['sellDate'] = stockInfo[i]['endDate']
    #         eachStockresult['expectedReturn'] = "{0:.2f}".format(float(stockInfo[i]['ExpectedReturn']))
    #         eachStockresult['riskLevel'] = riskLevel
    #         eachStockresult['expectedRisk'] = "{0:.2f}".format(float(stockInfo[i]['ExpectedRisk']))
    #         optimizeSearchResults.append(eachStockresult)
    #         eachStockresult = {}
    context_dict['newstocks'] = newstocks
    context_dict["optimizeSearchResults"] = optimizeSearchResults
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
    portfolios = top_portfolios(request, portalUser.id)
    context_dict["portfolios"] = portfolios
    context_dict["username"] = username    
    # portfolios = top_portfolios()
    # context_dict["portfolios"] = portfolios
    t = loader.get_template('user/portfolio_optimize.html')
    c = Context(context_dict)
    html = t.render(c)

    #print("response from REST API")
    #print(response)
    return HttpResponse(html)

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]    