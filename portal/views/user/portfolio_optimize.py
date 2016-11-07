from time import gmtime, strftime
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import requests
import json
from random import randint
from random import shuffle
from collections import OrderedDict
from django.template import RequestContext, Context, loader
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from django.db import connection
from django.http import JsonResponse
from portal.models.data.stock import Stock
from portal.views.user import top_portfolios

@login_required
@csrf_exempt
def removeportfolio(request, portfolio_id):
    if request.user.is_authenticated():
        username = request.user.username
        userid = request.user.id
        cursor = connection.cursor()
        cursor.execute("DELETE from `portal_stock`"
                        " WHERE show_id = " + str(portfolio_id) + "")
        cursor.execute("DELETE from `portal_portfolio`"
                    " WHERE id = " + str(portfolio_id) + " AND user_id = " + str(userid) + "")
        return JsonResponse({'data':'complete'})
@login_required
@csrf_exempt
def saveportfolio(request, portfolio_id):
    if request.user.is_authenticated():
        username = request.user.username
        userid = request.user.id
        cursor = connection.cursor()
        # cursor.execute("CREATE TEMPORARY TABLE `tmp_stock` SELECT * FROM `portal_stock` WHERE show_id = " + str(portfolio_id) + ";"
        #                 "UPDATE `tmp_stock` SET id = NULL;"
        #                 "INSERT INTO `portal_stock` SELECT * FROM `tmp_stock`;"
        #                 "DROP TEMPORARY TABLE IF EXISTS `tmp_stock`;")
        cursor.execute("CREATE TEMPORARY TABLE `tmp_portfolio` SELECT * FROM `portal_portfolio` WHERE id = " + str(portfolio_id) + " AND user_id = " + str(userid) + ";"
                "UPDATE `tmp_portfolio` SET id = " + str(int(portfolio_id) + 1) + ";"
                "INSERT INTO `portal_portfolio` SELECT * FROM `tmp_portfolio`;"
                "DROP TEMPORARY TABLE IF EXISTS `tmp_portfolio`;")
        cursor.close()
        cursor = connection.cursor()
        cursor.execute("UPDATE portal_stock SET show_id = " + str(int(portfolio_id) + 1) + " WHERE show_id = " + str(portfolio_id) + ";")
        return JsonResponse({'data':'complete'})

@login_required
@csrf_exempt
def portfolio_optimize(request):
    if request.user.is_authenticated():
        username = request.user.username
        userid = request.user.id
    optimizeSearchResults = []
    eachStockresult = {}
    eachStockresult['months'] = "12"
    eachStockresult['market'] = "S"
    eachStockresult['investingAmount'] = "2,500"
    eachStockresult['numStocks'] = "15"
    eachStockresult['expectedRisk'] = "20"
    eachStockresult['expectedReturn'] = "25"
    optimizeSearchResults.append(eachStockresult)
    stocks = [
     "ADS",
     "GILD",
     "AAPL",
     "BMY",
     "MSFT",
     "ON",
     "HBI",
     "LCI",
     "TEVA",
     "MCK",
     "UNH",
     "RUSHA",
     "CE",
     "NSR",
     "BIIB",
     "ALGT",
     "OLED",
     "SLB",
     "CYH",
     "HAL",
     "NLY",
     "RUSHB",
     "CELG",
     "PFE",
     "BWP",
     "BXE",
     "AXL",
     "AB",
     "GLNG",
     "ACAS",
     "DSPG",
     "QUIK",
     "GTIM",
     "BHI",
     "TOO",
     "SHLD",
     "AN",
     "IBM",
     "GPS",
     "STX",
     "FOSL",
     "BAM",
     "BRK.B",
     "AME",
     "SCHW",
     "WFC",
     "LBTYK",
     "CCK",
     "USB",
     "VRX",
     "BRK.A",
     "BRO",
     "LKQ",
     "AMG",
     "PRGO",
     "MHK",
     "JLL",
     "SRCL",
     "FMC",
     "AME",
     "CERN",
     "EWBC",
     "TRMB",
     "VAL",
     "MAT",
     "PLL",
     "SBAC",
     "BOH",
     "XRAY",
     "WSO",
     "MLHR",
     "JBHT",
     "ROL",
     "WWD",
     "FTI",
     "CLB",
     "KEX",
     "AZO",
     "CTXS",
     "EW",
     "DSW",
     "SBH",
     "ANSS",
     "BBBY",
     "IDXX",
     "IDXX",
     "PETM",
     "NBL",
     "ZBRA",
     "BC",
     "PKI",
     "CBRL",
     "GWR",
     "DLTR",
     "COH",
     "HE",
     "INT",
     "HAE",
     "HURN",
     "VRNT",
     "AJG",
     "MCRS",
     "BYI",
     "SCS",
     "RCL",
     "EOG",
     "UNP",
     "CMP",
     "PII",
     "FLO",
     "FLIR",
     "EXPD",
     "GIL",
     "POWI",
     "PHG",
     "FLS",
     "LII",
     "LLTC",
     "ASB",
     "ORB",
     "ATR",
     "WWW",
     "ICLR",
     "SMG",
     "APD",
     "EFX",
     "INFA",
     "SHW",
     "HUM",
     "HSP",
     "EBAY",
     "MINI",
     "MATX",
     "DENN",
     "NATI",
     "EGN",
     "NVDA",
     "ITRI",
     "TPX",
     "IPHS",
     "OXY",
     "GWW",
     "BRCD",
     "CREE",
     "LANC",
     "NGD",
     "MFB",
     "TIBX",
     "CQB",
     "BLK",
     "ETN",
     "KMB",
     "MDP",
     "RPM",
     "LEG",
     "WBA",
     "CSCO",
     "JNJ",
     "HAS",
     "GPC",
     "LMT",
     "RAI",
     "SYY",
     "EMR",
     "PAYX",
     "BAX",
     "MSFT",
     "CFR",
     "UPS",
     "T",
     "CA",
     "CVX",
     "MOLX",
     "TAP",
     "DD",
     "BAGL",
     "GEF",
     "AAPL",
     "MMC",
     "NSC",
     "INTC",
     "EEP",
     "NEM",
     "BMRN",
     "MON",
     "CATO",
     "RBA",
     "MCD",
     "SWK",
     "GATX",
     "ADSK",
     "GLW",
     "DLR",
     "LVLT",
     "WYNN",
     "FDX",
     "CNX",
     "UTX",
     "DD",
     "GHC",
     "VSAT",
     "RL",
     "RE",
     "PHG",
     "RYN",
     "LMCK",
     "MTN",
     "ATU",
     "DEL",
     "CHK",
     "BEN",
     "BIDU",
     "CKH",
     "MPEL",
     "AON",
     "CF",
     "TPLM",
     "JOE",
     "SHLD",
     "BAC",
     "LUK",
     "BRK.B",
     "RDI",
     "APD",
     "CAR",
     "CALL",
     "JBLU",
     "UNP",
     "MU",
     "GE",
     "LOV",
     "GS",
     "CP",
     "AAL",
     "HTZ",
     "RAI",
     "CTO",
     "MO",
     "GOOGL",
     "UNP",
     "BHI",
     "GD",
     "KO",
     "WDC",
     "ARRS",
     "PTEN",
     "NBL",
     "AVT",
     "AAN",
     "IDCC",
     "DV",
     "XEC",
     "HP",
     "RDC",
     "ARW",
     "VECO",
     "AGCO",
     "SM",
     "CUB",
     "APOL",
     "OSK",
     "FL",
     "UHAL",
     "NEE",
     "DUK",
     "CMS",
     "ALL",
     "XEL",
     "PFE",
     "MRK",
     "IBM",
     "AVA",
     "ABT",
     "FTK",
     "SIRI",
     "BG",
     "AGN",
     "SUPN",
     "CPN",
     "GANS",
     "EDAP",
     "BGEPF",
     "RLI",
     "ASH",
     "AESPRC",
     "PTQEP",
     "ASTC",
     "WEC",
     "ACTA",
     "ECOL",
     "AGEN",
     "GG",
     "PRGO",
     "DRRX",
     "XOM",
     "K",
     "PQ",
     "XPL",
     "TWI",
     "AMT",
     "MKL",
     "MA",
     "MCO",
     "DLTR",
     "KMX",
     "V",
     "ROP",
     "ESGR",
     "ORLY",
     "SBAC",
     "LKQ",
     "MNRO",
     "AMTD",
     "DHR",
     "BRK.B",
     "DHIL",
     "BRK.A",
     "ANSS",
     "LAMR",
     "CSX",
     "AI",
     "BRK.B",
     "WM",
     "CNI",
     "CAT",
     "WMT",
     "CCI",
     "ECL",
     "KOF",
     "UPS",
     "FDX",
     "TV",
     "WBA",
     "LBTYK",
     "AN",
     "LBTYA",
     "ARCO",
     "LILA",
     "PG",
     "FOXA",
     "FOX",
     "PEP",
     "CSCO",
     "ORCL",
     "JNJ",
     "KO",
     "SYY",
     "MSFT",
     "XOM",
     "USB",
     "COP",
     "BK",
     "AVP",
     "AGK.UK",
     "STT"]
    shuffle(stocks)
    numshares = int(20)
    context_dict = {}
    context_dict['stock_invest'] = float(25000)/float(15.00)
    context_dict['investingAmount'] = ('25,000')
    context_dict['market'] = "US Markets"
    context_dict['Months'] = "12"
    context_dict['Years'] = "12"
    context_dict['expectedReturn'] = 25
    context_dict['expectedRisk'] = "20"
    time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    try: 
        if request.POST['portname'] == "":
            context_dict['portname'] = "Test Portfolio"
        else: 
            context_dict['portname'] = request.POST['portname']
    except:
        context_dict['portname'] = "Test Portfolio"
        time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    client_name = "Client Name"
    description = "Decsription"
    cursor = connection.cursor()
    cursor.execute("INSERT INTO `portal_portfolio` (name,created_date,update_date,description,risk,timeframe,control_market,investment,user_id, client_name) VALUES "
                    "('" + str(context_dict['portname']) + "','" + str(time) + "','" + str(time) + "','" + str(description) + "','" + str(context_dict['expectedRisk']) + "','" + str(context_dict['Years']) + "','" + str('S') + "','" + str(25000) + "','" + str(userid) + "','" + str(client_name) + "')")
    cursor.execute("SELECT LAST_INSERT_ID();")
    show_id = dictfetchall(cursor)[0]['LAST_INSERT_ID()']
    context_dict['portfolio_id']  = show_id
    newstocks = []  
    for num in range(numshares):
        cursor = connection.cursor()
        cursor.execute("INSERT INTO `portal_stock` (created_date, update_date, ticker, show_id, buy_date, current_price, initial_price, number_of_shares, sell_date) VALUES"
                        "('2016-07-09 12:12:12','2016-07-09 12:12:12','" + str(stocks[num]) + "','" + str(show_id) + "','2016-07-29','21.25','" + str(randint(15,22)) + "','2','2016-09-01')")
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
    #                             str('25,000') + "&noOfStocks=" + str(request.POST['stocks_number']),
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

