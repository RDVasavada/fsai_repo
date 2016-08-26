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
from portal.views.user.top_portfolios import *

@login_required
@csrf_exempt
def portfolio_optimize(request):
    # html = get_top_portfolios(request, 'user/portfolio_optimize.html')
    # return HttpResponse(html)

    # try:
    #     print("Months: " + request.POST['Months'])
    #     print("Market :" + request.POST['Market'])
    #     print("InvesingAmount :" + request.POST['investing_amount'])
    #     print("stocksNumber :" + request.POST['stocks_number'])
    #     print("expected Risk :" + request.POST['expRisk'])
    #     print("expected return :" + request.POST['expReturn'])

    #     # 52.28.177.9:8888 - The AWS instance og prashant
    #     # socket.create_connection(('52.28.177.9', '8888'), timeout=2)
    #     response = requests.get("http://52.77.239.179:8080/api-auth/portfolioOptimizer?format=json" + "&expRisk=20" +
    #                                 "&timeFrame=" + request.POST['Months'] + "&expRet=30&investingAmount=" +
    #                                 str(request.POST['investing_amount']) + "&noOfStocks=" + str(request.POST['stocks_number']),
    #             headers= {
    #                 'FSAIAUTHENTICATION': 'Basic ZnNhaV91c2VyOmZzYWlAMTIz'
    #     })

    #     if(response.status_code != 200):
    #          raise Exception('GET /api-auth/portfolioOptimizer {}'.format(response.status_code))
    #     else:
    #         print(response.json())
            # jsonResponse = response.json()
            # stockInfo = jsonResponse['stockInfo']
            # numStocks = jsonResponse['numStocks']
            # #print(stockInfo)
            # optimizeSearchResults = []
            # eachStockresult = {}
            # for i in range(len(stockInfo)):
            #     #print(stockInfo[i]['ExpectedReturn']);
            #     riskLevel = ""
            #     if float(stockInfo[i]['ExpectedRisk']) <= 20:
            #         riskLevel = "Low";
            #     elif float(stockInfo[i]['ExpectedRisk']) > 20 and float(stockInfo[i]['ExpectedRisk']) <= 50:
            #         riskLevel = "Medium";
            #     else:
            #         riskLevel = "High";

            #     eachStockresult['companyName'] = stockInfo[i]['name']
            #     eachStockresult['tickerSymbol'] = stockInfo[i]['ticker']
            #     eachStockresult['buyDate'] = stockInfo[i]['StartDate']
            #     eachStockresult['sellDate'] = stockInfo[i]['endDate']
            #     eachStockresult['expectedReturn'] = "{0:.2f}".format(float(stockInfo[i]['ExpectedReturn']))
            #     eachStockresult['riskLevel'] = riskLevel
            #     eachStockresult['expectedRisk'] = "{0:.2f}".format(float(stockInfo[i]['ExpectedRisk']))
            #     optimizeSearchResults.append(eachStockresult)
            #     eachStockresult = {}
    #     context_dict = {}
    #     context_dict["optimizeSearchResults"] = optimizeSearchResults
    #     t = loader.get_template('user/portfolio_optimize.html')
    #     c = Context(context_dict)
    #     html = t.render(c)
    # except Exception as e:
    #     print(e)
    #     html = "<h2>Something went wrong with the server</h2>"
    #begin Adam's mock data script -->
    optimizeSearchResults = []
    eachStockresult = {}
    eachStockresult['months'] = (request.POST['Months'])
    eachStockresult['market'] = (request.POST['Market'])
    eachStockresult['investingAmount'] = (request.POST['investing_amount'])
    eachStockresult['numStocks'] = (request.POST['stocks_number'])
    eachStockresult['expectedRisk'] = (request.POST['expRisk'])
    eachStockresult['expectedReturn'] = (request.POST['expReturn'])
    optimizeSearchResults.append(eachStockresult)
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
    context_dict = {}
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
