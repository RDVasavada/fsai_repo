from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import requests
import json
import datetime as dt
from yahoo_finance import Share
from pprint import pprint
from collections import OrderedDict
from django.template import RequestContext, Context, loader
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from django.db import connection
from portal.models.data.stock import Stock

@login_required
def portfolio(request):
    # write code to get portfolio information from database
    # portfolio_Objects = Portfolio.objects.all()
    html = get_top_portfolios(request, 'user/portfolio_view.html')
    return HttpResponse(html)

@csrf_exempt
def portfolio_settings(request):
    html = get_top_portfolios(request, 'user/portfolio_settings.html')
    return HttpResponse(html)

@csrf_exempt
def support(request):
    html =  get_top_portfolios(request, 'user/support.html')
    return HttpResponse(html)
@csrf_exempt
@login_required
def individual_portfolio(request):
    html = get_top_portfolios(request, 'user/individual_portfolio.html')
    return HttpResponse(html)
@csrf_exempt
@login_required
def individual_stock(request):
    context_dict = {}
    context_dict["company_symbol"] = request.POST['company_name'];
    today = dt.datetime.today().strftime("%Y-%m-%d")
    # lastyear = today.replace('year=2014')
    stock = Share(request.POST['company_name'])
    pprint(stock.get_info())
    # print(stock.get_historical('2015-08-18', today))
    # print(info)
    response = requests.get("http://chstocksearch.herokuapp.com/api/"+request.POST['company_name'])
    context_dict["company_name"] = response.json()[0]['company']
    # print(response.json()[0]['company'])
    params_gd = OrderedDict({
        "v": "1",
        "format": "json",
        "t.p": "83856",
        "t.k": "cbW9p5pFQDw",
        "action": "employers",
        "q": response.json()[0]['company'],
        # programmatically get the IP of the machine
        "userip": json.loads(urllib2.urlopen("http://ip.jsontest.com/").read().decode('utf-8'))['ip'],
        "useragent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36"
    })
    basepath_gd = 'http://api.glassdoor.com/api/api.htm'
    response_gd = requests.get(basepath_gd,
                               params=params_gd,
                               headers={
                                   "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36"
                               })
    jsonResponse = response_gd.json()
    company_stats = jsonResponse['response']['employers'][0]
    # print(company_stats['employers'][0])
    #     numStocks = jsonResponse['numStocks']
    # company_stats = jsonResponseresponse_gd.content
    # print(company_stats[0])
    context_dict["company_stats"] = company_stats
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)
    portfolios = top_portfolios(portalUser.id)
    context_dict["portfolios"] = portfolios
    context_dict["username"] = username    
    t = loader.get_template('user/individual_stock.html')
    c = Context(context_dict)
    html = t.render(c)
    return HttpResponse(html)

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
    portfolios = top_portfolios(portalUser.id)
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

# @login_required
def top_portfolios(user_id):
    # if request.user.is_authenticated():
    #     username = request.user.username
    #     print("Authenticated User is :" + username)
    #     portalUser = PortalUser.objects.get(username=username)
    #     print("getting top portfolios")
    portfolios = {}
    print(user_id)
    try:
        #all_portfolios = Portfolio.objects.raw("select p.id as id,risk,"
        #                                       "timeframe,investment,control_market,name,sum(investment) as value "
        #                                       "from portal_portfolio p, portal_stock s "
        #                                       "where p.id=s.show_id and p.user_id=1 group by p.id order by investment desc limit 3")
        #print(user_id)
        cursor = connection.cursor()
        cursor.execute("select p.id as id,name,sum(investment) as value, COUNT(DISTINCT(ticker)) as no_of_tickers, "
                       "sum(current_price * number_of_shares) as total_value from "
                       "portal_portfolio p, portal_stock s where p.id=s.show_id "
                       "and p.user_id=" + str(user_id) + " group by p.id order by investment desc limit 10")
        portfolios = dictfetchall(cursor)
        #print "this is all portfolios"
        print(portfolios)
    except Exception as e:
        print(e)
    #Stock.objects.filter(show__user_id=1)
    #cursor = connection.cursor()
    #cursor.execute("UPDATE bar SET foo = 1 WHERE baz = %s", 67)
    #cursor.execute("SELECT foo FROM bar WHERE baz = %s", 12)
    return portfolios

@login_required
def my_portfolios(request):
    print("inside portfolios of user")
    if request.user.is_authenticated():
        username = request.user.username
        print("Authenticated User is :" + username)
        portalUser = PortalUser.objects.get(username=username)
        # Get User information from username
        # get the portfolios of the user
        print("Portal User Object :" + str(portalUser) + "|" + str(portalUser.id))

        print("getting all the portfolios")
        try:
            # all_portfolios = Portfolio.objects.filter(user__id=portalUser.id)
            all_portfolios = Portfolio.objects.filter(user__id=portalUser.id)
            #print(all_portfolios)

            #all_portfolios = Portfolio.objects.raw('SELECT * FROM portal_portfolio WHERE user_id = %s', [portalUser.id])
            #print(all_portfolios)
            for port in all_portfolios:
                #print(str(port.id) + "|" + port.name)
                port.stocks = port.stock_set.all()
                #print(port.stock_set.all())
                #for stock in port.stock_set:
                    #print(str(stock.id) + " | " + stock.ticker)


            #for p in Portfolio.objects.raw('SELECT * FROM portal_portfolio WHERE user_id = %s', [portalUser.id]):
                #print(p)

            #user_portfolios = Portfolio.objects.filter(user_id=portalUser.id)
            #length = len(user_portfolios)
            #print(length)
        except Exception as e:
            print(e)
            all_portfolios = None

        #print(str(user_portfolios))
        #print("user_portfolios: " + str(len(user_portfolios)))
        #for uportfolio in user_portfolios:
            #print(uportfolio)
            #for stock in uportfolio.entry_set.all():
                #print(stock)
        #print(user_portfolios)
    else:
        print("authentication is not successful")
    # print "adam's ports"
    # for port in all_portfolios:
    #     print len(port.stocks)
    context_dict = {}
    context_dict["all_portfolios"] = all_portfolios
    context_dict["username"] = username
    t_portfolios = top_portfolios(portalUser.id)
    context_dict["portfolios"] = t_portfolios

    t = loader.get_template('user/my_portfolios.html')
    c = Context(context_dict)
    html = t.render(context_dict)
    #print(html)
    return HttpResponse(html)

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
    print(name + "|" + description + "|" + str(risk) + "|" + timeframe + "|" +
          control_market + "|" + str(investment) + "|" + user_id)
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

    context_dict = {}
    context_dict["portfolios"] = top_portfolios(user_id)
    t = loader.get_template('user/portfolio_view.html')
    c = Context(context_dict)

    html = t.render(c)
    return HttpResponse(html)
    #return render(request, 'user/portfolio_view.html')

'''
search for portfolios by the name
'''
@login_required
def search_portfolio(request):
    print("search for portfolios")
    if request.user.is_authenticated():
        username = request.user.username
        print("Authenticated User is :" + username)
        portalUser = PortalUser.objects.get(username=username)
        portfolio_name = request.GET["query"]
        portfolio_results = Portfolio.objects.filter(string__icontains=portfolio_name).filter(user__id=portalUser.id)
        print("Portfolio Results ")
        print(portfolio_results)

        context_dict = {}
        context_dict["all_portfolios"] = portfolio_results

        t_portfolios = top_portfolios(portalUser.id)
        context_dict["portfolios"] = t_portfolios

        t = loader.get_template('user/my_portfolios.html')
        c = Context(context_dict)
        html = t.render(c)
        # print(html)
        return HttpResponse(html)
    return HttpResponse("this returns the search results")

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]

def get_top_portfolios(request, html_template):
    if request.user.is_authenticated():
        username = request.user.username
        portalUser = PortalUser.objects.get(username=username)

    portfolios = top_portfolios(portalUser.id)
    print portfolios
    # portfolios = top_portfolios(portalUser.id)

    context_dict = {}
    context_dict["portfolios"] = portfolios
    context_dict["username"] = username
    t = loader.get_template(html_template)
    c = Context(context_dict)
    html = t.render(context_dict)
    return html



