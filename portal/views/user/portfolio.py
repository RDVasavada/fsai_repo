from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
import requests
from django.template import RequestContext, Context, Template, loader
from django.contrib.auth.decorators import login_required
import socket

@login_required
def portfolio(request):
	return render(request, 'user/portfolio_view.html')

def portfolio_settings(request):
    return render(request, 'user/portfolio_settings.html', RequestContext(request))

def my_portfolios(request):
    return render(request, 'user/my_portfolios.html', RequestContext(request))

def portfolio_optimize(request):
    print("Months: " + request.POST['Months'])
    print("Market :" + request.POST['Market'])
    print("InvesingAmount :" + request.POST['investing_amount'])
    print("stocksNumber :" + request.POST['stocks_number'])
    print(request.POST['expRisk'])
    print(request.POST['expReturn'])
    # 52.77.239.179:8080 - THE AWS instance of Ramana
    # 52.28.177.9:8888 - The AWS instance og prashant
    # socket.create_connection(('52.28.177.9', '8888'), timeout=2)
    response = requests.get("http://52.77.239.179:8080/api-auth/portfolioOptimizer?format=json" + "&expRisk=20" +
                                "&timeFrame=" + request.POST['Months'] + "&expRet=30&investingAmount=" +
                                str(request.POST['investing_amount']) + "&noOfStocks=" + str(request.POST['stocks_number']),
            headers= {
                'FSAIAUTHENTICATION': 'Basic ZnNhaV91c2VyOmZzYWlAMTIz'
    })

    if(response.status_code != 200):
         raise Exception('GET /api-auth/portfolioOptimizer {}'.format(response.status_code))
    else:
        #print(response.json())
        jsonResponse = response.json()
        stockInfo = jsonResponse['stockInfo']
        numStocks = jsonResponse['numStocks']
        #print(stockInfo)
        optimizeSearchResults = []
        eachStockresult = {}
        for i in range(len(stockInfo)):
            #print(stockInfo[i]['ExpectedReturn']);
            riskLevel = ""
            if float(stockInfo[i]['ExpectedRisk']) <= 20:
                riskLevel = "Low";
            elif float(stockInfo[i]['ExpectedRisk']) > 20 and float(stockInfo[i]['ExpectedRisk']) <= 50:
                riskLevel = "Medium";
            else:
                riskLevel = "High";

            eachStockresult['companyName'] = stockInfo[i]['name']
            eachStockresult['tickerSymbol'] = stockInfo[i]['ticker']
            eachStockresult['buyDate'] = stockInfo[i]['StartDate']
            eachStockresult['sellDate'] = stockInfo[i]['endDate']
            eachStockresult['expectedReturn'] = "{0:.2f}".format(float(stockInfo[i]['ExpectedReturn']))
            eachStockresult['riskLevel'] = riskLevel
            eachStockresult['expectedRisk'] = "{0:.2f}".format(float(stockInfo[i]['ExpectedRisk']))
            optimizeSearchResults.append(eachStockresult)
            eachStockresult = {}
    context_dict = {}
    context_dict["optimizeSearchResults"] = optimizeSearchResults
    t = loader.get_template('user/portfolio_optimize.html')
    c = Context(context_dict)
    html = t.render(c)
    #print("response from REST API")
    #print(response)

    return HttpResponse(html)
