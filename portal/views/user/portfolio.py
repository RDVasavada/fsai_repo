from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import requests
from django.template import RequestContext, Context, Template, loader
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
import traceback

@login_required
def portfolio(request):
    # write code to get portfolio information from database
    portfolio_Objects = Portfolio.objects.all()
    return render(request, 'user/portfolio_view.html')

def portfolio_settings(request):
    return render(request, 'user/portfolio_settings.html', RequestContext(request))

def portfolio_optimize(request):
    try:
        print("Months: " + request.POST['Months'])
        print("Market :" + request.POST['Market'])
        print("InvesingAmount :" + request.POST['investing_amount'])
        print("stocksNumber :" + request.POST['stocks_number'])
        print("expected Risk :" + request.POST['expRisk'])
        print("expected return :" + request.POST['expReturn'])

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
    except Exception as e:
        print(e)
        html = "<h2>Something went wrong with the server</h2>"
    #print("response from REST API")
    #print(response)
    return HttpResponse(html)

@login_required
def my_portfolios(request):
    print("inside portfolios of user")
    if request.user.is_authenticated():
        username = request.user.username
        print("Authenticated User is :" + username)
        portalUser = PortalUser.objects.get(username=username)
        # Get User information from username
        # get the portfolios of the user
        print("portal User object :" + str(portalUser))
        user_portfolios = Portfolio.objects.filter(user_id=portalUser.id)
        print("user_portfolios: " + str(user_portfolios.length))
        for uportfolio in user_portfolios:
            print(uportfolio)
            for stock in uportfolio.entry_set.all():
                print(stock)
        #print(user_portfolios)
    else:
        print("authentication is not successful")

    return render(request, 'user/my_portfolios.html', RequestContext(request))

'''
This method will save the portfolio object into database
'''
@csrf_exempt
def save_portfolio(request):
    print("inside save portfolio method")
    print("Request Method :" + request.method)
    #print(request.POST)
    name = request.POST['name']
    description = request.POST['description']
    risk = int(request.POST['risk'])
    timeframe = request.POST['timeframe']
    control_market = request.POST['control_market']
    investment = float(request.POST['investment'])

    user_id = request.POST['user']

    print("portfolio input in the request")
    print(name + "|" +
          description + "|" +
          str(risk) + "|" +
          timeframe + "|" +
          control_market + "|" +
          str(investment) + "|" +
          user_id)
    portalUser = PortalUser.objects.get(id=user_id);

    print("Portal User :")
    print(portalUser)

    new_portfolio = Portfolio(name, description, risk, timeframe,
                              control_market, investment, portalUser)

    #print("-------------------------------------")
    #print("after creating the new portfolio user")

    try:
        print("before object save method")
        print(new_portfolio)
        new_portfolio.save()
        print("after saving portfolio object")
    except Exception as e:
        print(e)

    #print("inside save portfolio method")

    '''
    portfolio_Objects = Portfolio.objects.all()
    t = loader.get_template('user/portfolio_view.html')
    c = Context(portfolio_Objects)
    html = t.render(c)
    '''

    t = loader.get_template('user/portfolio_view.html')
    c = Context()
    html = t.render(c)
    return HttpResponse(html)
    #return render(request, 'user/portfolio_view.html')

'''
search for portfolios by the name
'''
def search_portfolio(request):
    print("search for portfolios")
    portfolio_name = request.GET["query"]
    portfolio_results = Portfolio.objects.filter(string__icontains=portfolio_name)
    print("Portfolio Results ")
    print(portfolio_results)
    return HttpResponse("this returns the search results")
