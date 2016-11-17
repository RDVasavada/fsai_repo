from time import gmtime, strftime
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import csv
import requests
import json
import numpy as np
from random import randint
from random import shuffle
from collections import OrderedDict
from django.template import RequestContext, Context, loader
from django.contrib.auth.decorators import login_required
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from django.db import connection
from django.http import JsonResponse
from yahoo_finance import Share
import numpy as np, numpy.random
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
    stocks = [["ADS","Alliance Data Systems"],
     ["GILD","Gilead Sciences"],
     ["AAPL","Apple"],
     ["BMY","Bristol-Myers Squibb Co"],
     ["MSFT","Microsoft"],
     ["ON","ON Semiconductor"],
     ["HBI","Hanesbrands"],
     ["LCI","Lannett Co"],
     ["TEVA","Teva Pharmaceutical"],
     ["MCK","McKesson"],
     ["UNH","UnitedHealth Group"],
     ["RUSHA","Rush Enterprises"],
     ["CE","Celanese Corporation"],
     ["NSR","Neustar"],
     ["BIIB","Biogen"],
     ["ALGT","Allegiant Travel Company"],
     ["OLED","Universal Display"],
     ["SLB","Schlumberger N.V."],
     ["CYH","Community Health Systems"],
     ["HAL","Halliburton Company"],
     ["NLY","Annaly Capital"],
     ["RUSHB","Rush Enterprises"],
     ["CELG","Celgene Corporation"],
     ["PFE","Pfizer"],
     ["BWP","Boardwalk Pipeline"],
     ["BXE","Bellatrix Exploration"],
     ["AXL","American Axle"],
     ["AB","AllianceBernstein"],
     ["GLNG","Golar LNG"],
     ["ACAS","American Capital"],
     ["DSPG","DSP Group"],
     ["QUIK","QuickLogic"],
     ["GTIM","Good Times Restaurants"],
     ["BHI","Baker Hughes"],
     ["TOO","Teekay Offshore Partners"],
     ["SHLD","Sears Holdings"],
     ["AN","AutoNation"],
     ["IBM","International Business Machines"],
     ["GPS","Gap, Inc."],
     ["STX","Seagate Technology"],
     ["FOSL","Fossil Group"],
     ["BAM","Brookfield Asset Management"],
     ["AME","AMETEK"],
     ["SCHW","Charles Schwab"],
     ["WFC","Wells Fargo"],
     ["LBTYK","Liberty Global"],
     ["CCK","Crown Holdings"],
     ["USB","U.S. Bancorp"],
     ["VRX","Valeant Pharmaceuticals"],
     ["BRO","Brown & Brown"],
     ["LKQ","LKQ"],
     ["AMG","Affiliated Managers Group"],
     ["PRGO","Perrigo Company"],
     ["MHK","Mohawk Industries"],
     ["JLL","Jones Lang LaSalle"],
     ["SRCL","Stericycle"],
     ["FMC","FMC Corporation"],
     ["AME","AMETEK, Inc."],
     ["CERN","Cerner Corporation"],
     ["EWBC","East West Bancorp"],
     ["TRMB","Trimble"],
     ["VAL","Valspar Corporation"],
     ["MAT","Mattel"],
     ["SBAC","SBA Communications Corporation"],
     ["BOH","Bank of Hawaii Corporation"],
     ["XRAY","DENTSPLY SIRONA"],
     ["WSO","Watsco, Inc."],
     ["MLHR","Herman Miller, Inc."],
     ["JBHT","J.B. Hunt Transport Services"],
     ["ROL","Rollins"],
     ["WWD","Woodward"],
     ["FTI","FMC Technologies"],
     ["CLB","Core Laboratories"],
     ["KEX","Kirby Corporation"],
     ["AZO","AutoZone"],
     ["CTXS","Citrix Systems"],
     ["EW","Edwards Lifesciences"],
     ["DSW","DSW Inc."],
     ["SBH","Sally Beauty Holdings"],
     ["ANSS","ANSYS"],
     ["BBBY","Bed Bath & Beyond"],
     ["IDXX","IDEXX Laboratories"],
     ["IDXX","IDEXX Laboratories"],
     ["NBL","Noble Energy Inc."],
     ["ZBRA","Zebra Technologies"],
     ["BC","Brunswick Corporation"],
     ["PKI","PerkinElmer"],
     ["CBRL","Cracker Barrel Old Country"],
     ["GWR","Genesee & Wyoming Inc."],
     ["DLTR","Dollar Tree,"],
     ["COH","Coach"],
     ["HE","Hawaiian Electric Industries"],
     ["INT","World Fuel Services Corporation"],
     ["HAE","Haemonetics Corporation Common "],
     ["HURN","Huron Consulting Group"],
     ["VRNT","Verint Systems Inc."],
     ["AJG","Arthur J. Gallagher"],
     ["SCS","Steelcase Inc."],
     ["RCL","Royal Caribbean Cruises Ltd."],
     ["EOG","EOG Resources Inc."],
     ["UNP","Union Pacific Corporation"],
     ["CMP","Compass Minerals Intl"],
     ["PII","Polaris Industries Inc."],
     ["FLO","Flowers Foods Inc."],
     ["FLIR","FLIR Systems Inc."],
     ["EXPD","Expeditors International"],
     ["GIL","Gildan Activewear Inc."],
     ["POWI","Power Integrations Inc."],
     ["PHG","Koninklijke Philips"],
     ["FLS","Flowserve Corporation"],
     ["LII","Lennox International"],
     ["LLTC","Linear Technology Corporation"],
     ["ASB","Associated Banc-Corp"],
     ["ATR","AptarGroup, Inc"],
     ["WWW","Wolverine World Wide Inc."],
     ["ICLR","ICON plc"],
     ["SMG","Scotts Miracle-Gro Company"],
     ["APD","Air Products and Chemicals"],
     ["EFX","Equifax Inc."],
     ["SHW","Sherwin-Williams Company"],
     ["HUM","Humana Inc"],
     ["EBAY","eBay Inc."],
     ["MINI","Mobile Mini Inc."],
     ["MATX","Matson Inc."],
     ["DENN","Dennys Corporation"],
     ["NATI","National Instruments Corporation"],
     ["EGN","Energen Corporation"],
     ["NVDA","NVIDIA Corporation"],
     ["ITRI","Itron, Inc."],
     ["TPX","Tempur Sealy International"],
     ["IPHS","Innophos Holdings"],
     ["OXY","Occidental Petroleum"],
     ["GWW","W.W. Grainger Inc"],
     ["BRCD","Brocade Communications Systems"],
     ["CREE","Cree Inc."],
     ["LANC","Lancaster Colony Corporation"],
     ["NGD","New Gold Inc."],
     ["BLK","BlackRock Inc."],
     ["ETN","Eaton Corporation,"],
     ["KMB","Kimberly-Clark"],
     ["MDP","Meredith Corporation"],
     ["RPM","RPM International Inc."],
     ["LEG","Leggett & Platt"],
     ["WBA","Walgreens Boots Alliance"],
     ["CSCO","Cisco Systems"],
     ["JNJ","Johnson & Johnson"],
     ["HAS","Hasbro"],
     ["GPC","Genuine Parts Company"],
     ["LMT","Lockheed Martin Corporation"],
     ["RAI","Reynolds American Inc"],
     ["SYY","Sysco Corporation"],
     ["EMR","Emerson Electric Company"],
     ["PAYX","Paychex"],
     ["BAX","Baxter International Inc."],
     ["MSFT","Microsoft Corporation"],
     ["CFR","Cullen/Frost Bankers Inc."],
     ["UPS","United Parcel Service Inc."],
     ["T","AT&T Inc."],
     ["CA","CA Inc."],
     ["CVX","Chevron Corporation"],
     ["TAP","Molson Coors Brewing Company"],
     ["DD","E.I. du Pont de Nemours"],
     ["GEF","Greif Inc. Class A Common Stock"],
     ["AAPL","Apple Inc."],
     ["MMC","Marsh & McLennan Companies"],
     ["NSC","Norfolk Southern Corporation"],
     ["INTC","Intel Corporation"],
     ["EEP","Enbridge Energy"],
     ["NEM","Newmont Mining Corporation"],
     ["BMRN","BioMarin Pharmaceuticals"],
     ["MON","Monsanto Company"],
     ["CATO","Cato Corporation"],
     ["RBA","Ritchie Bros. Auctioneers"],
     ["MCD","McDonalds Corporation"],
     ["SWK","Stanley Black & Decker Inc."],
     ["GATX","GATX Corporation"],
     ["ADSK","Autodesk Inc."],
     ["GLW","Corning Incorporated"],
     ["DLR","Digital Realty Trust"],
     ["LVLT","Level 3 Communications"],
     ["WYNN","Wynn Resorts Limited"],
     ["FDX","FedEx Corporation"],
     ["CNX","CONSOL Energy Inc."],
     ["UTX","United Technologies Corporation"],
     ["DD","E.I. du Pont de Nemours"],
     ["GHC","Graham Holdings Company"],
     ["VSAT","ViaSat Inc."],
     ["RL","Ralph Lauren Corporation"],
     ["RE","Everest Re Group Ltd."],
     ["PHG","Koninklijke Philips"],
     ["RYN","Rayonier Inc."],
     ["LMCK","Liberty Media Corporation"],
     ["MTN","Vail Resorts Inc."],
     ["ATU","Actuant Corporation"],
     ["DEL","Deltic Timber Corporation"],
     ["CHK","Chesapeake Energy Corporation"],
     ["BEN","Franklin Resources Inc."],
     ["BIDU","Baidu, Inc."],
     ["CKH","SEACOR Holdings Inc."],
     ["MPEL","Melco Crown Entertainment"],
     ["AON","AON plc"],
     ["CF","CF Industries Holdings"],
     ["TPLM","Triangle Petroleum Corporation "],
     ["JOE","St. Joe Company"],
     ["SHLD","Sears Holdings Corporation"],
     ["BAC","Bank of America Corporation"],
     ["LUK","Leucadia National Corporation"],
     ["RDI","Reading International Inc"],
     ["APD","Air Products and Chemicals"],
     ["CAR","Avis Budget Group Inc."],
     ["CALL","magicJack VocalTec Ltd"],
     ["JBLU","JetBlue Airways Corporation"],
     ["UNP","Union Pacific Corporation"],
     ["MU","Micron Technology Inc."],
     ["GE","General Electric Company"],
     ["LOV","Spark Networks Inc."],
     ["GS","Goldman Sachs Group Inc."],
     ["CP","Canadian Pacific Railway"],
     ["AAL","American Airlines Group"],
     ["HTZ","Hertz Global Holdings Inc."],
     ["RAI","Reynolds American Inc"],
     ["CTO","Consolidated-Tomoka Land Co."],
     ["MO","Altria Group Inc."],
     ["GOOGL","Alphabet Inc."],
     ["UNP","Union Pacific Corporation"],
     ["BHI","Baker Hughes Incorporated"],
     ["GD","General Dynamics Corporation"],
     ["KO","Coca-Cola Company "],
     ["WDC","Western Digital Corporation"],
     ["ARRS","ARRIS International plc"],
     ["PTEN","Patterson-UTI Energy Inc."],
     ["NBL","Noble Energy Inc."],
     ["AVT","Avnet Inc."],
     ["AAN","Aarons, Inc."],
     ["IDCC","InterDigital Inc."],
     ["DV","DeVry Education Group Inc."],
     ["XEC","Cimarex Energy Co"],
     ["HP","Helmerich & Payne Inc."],
     ["RDC","Rowan Companies plc"],
     ["ARW","Arrow Electronics Inc."],
     ["VECO","Veeco Instruments Inc."],
     ["AGCO","AGCO Corporation"],
     ["SM","SM Energy Company"],
     ["CUB","Cubic Corporation"],
     ["APOL","Apollo Education Group Inc."],
     ["OSK","Oshkosh Corporation"],
     ["FL","Foot Locker Inc."],
     ["UHAL","Amerco"],
     ["NEE","NextEra Energy Inc."],
     ["DUK","Duke Energy Corporation"],
     ["CMS","CMS Energy Corporation"],
     ["ALL","Allstate Corporation"],
     ["XEL","Xcel Energy Inc."],
     ["PFE","Pfizer, Inc."],
     ["MRK","Merck & Company Inc."],
     ["IBM","International Business Machines"],
     ["AVA","Avista Corporation"],
     ["ABT","Abbott Laboratories"],
     ["FTK","Flotek Industries Inc."],
     ["SIRI","Sirius XM Holdings Inc."],
     ["BG","Bunge Limited Bunge Limited"],
     ["AGN","Allergan "],
     ["SUPN","Supernus Pharmaceuticals Inc."],
     ["CPN","Calpine Corporation"],
     ["EDAP","EDAP TMS S.A."],
     ["RLI","RLI Corporation"],
     ["ASH","Ashland Global Holdings"],
     ["ASTC","Astrotech Corporation"],
     ["WEC","WEC Energy Group Inc."],
     ["ACTA","Actua Corporation"],
     ["ECOL","US Ecology Inc."],
     ["AGEN","Agenus Inc."],
     ["GG","Goldcorp Inc."],
     ["PRGO","Perrigo Company"],
     ["DRRX","DURECT Corporation"],
     ["XOM","Exxon Mobil Corporation"],
     ["K","Kellogg Company"],
     ["PQ","Petroquest Energy Inc."],
     ["XPL","Solitario Exploration & Royalty"],
     ["TWI","Titan International Inc."],
     ["AMT","American Tower Corporation"],
     ["MKL","Markel Corporation"],
     ["MA","Mastercard Incorporated"],
     ["MCO","Moodys Corporation"],
     ["DLTR","Dollar Tree Inc."],
     ["KMX","CarMax Inc"],
     ["V","Visa Inc."],
     ["ROP","Roper Technologies Inc."],
     ["ESGR","Enstar Group Limited"],
     ["ORLY","OReilly Automotive Inc."],
     ["SBAC","SBA Communications Corporation"],
     ["LKQ","LKQ Corporation"],
     ["MNRO","Monro Muffler Brake Inc."],
     ["AMTD","TD Ameritrade Holdings"],
     ["DHR","Danaher Corporation"],
     ["DHIL","Diamond Hill Investment Group "],
     ["ANSS","ANSYS Inc."],
     ["LAMR","Lamar Advertising Company"],
     ["CSX","CSX Corporation"],
     ["AI","Arlington Asset Investment"],
     ["WM","Waste Management Inc."],
     ["CNI","Canadian National Railway"],
     ["CAT","Caterpillar Inc."],
     ["WMT","Wal-Mart Stores, Inc."],
     ["CCI","Crown Castle International"],
     ["ECL","Ecolab Inc."],
     ["KOF","Coca Cola Femsa"],
     ["UPS","United Parcel Service Inc."],
     ["FDX","FedEx Corporation"],
     ["TV","Grupo Televisa S.A."],
     ["WBA","Walgreens Boots Alliance Inc."],
     ["LBTYK","Liberty Global"],
     ["AN","AutoNation Inc."],
     ["LBTYA","Liberty Global"],
     ["ARCO","Arcos Dorados Holdings Inc."],
     ["LILA","Liberty Global"],
     ["PG","Procter & Gamble "],
     ["FOXA","Twenty-First Century Fox"],
     ["FOX","Twenty-First Century Fox"],
     ["PEP","Pepsico Inc."],
     ["CSCO","Cisco Systems Inc."],
     ["ORCL","Oracle Corporation"],
     ["JNJ","Johnson & Johnson"],
     ["KO","Coca-Cola Company"],
     ["SYY","Sysco Corporation"],
     ["MSFT","Microsoft Corporation"],
     ["XOM","Exxon Mobil Corporation"],
     ["USB","U.S. Bancorp"],
     ["COP","ConocoPhillips"],
     ["BK","Bank of New York Mellon"],
     ["AVP","Avon Products Inc."],
     ["STT","State Street Corporation"]]
    if request.user.is_authenticated():
        username = request.user.username
        userid = request.user.id
    optimizeSearchResults = []
    eachStockresult = {}
    # eachStockresult['months'] = "12"
    # eachStockresult['market'] = "S"
    eachStockresult['investingAmount'] = str(request.POST['investing_amount'])
    eachStockresult['numStocks'] = str(request.POST['number_of_shares'])
    eachStockresult['expectedRisk'] = str(request.POST['expRisk'])
    # eachStockresult['expectedReturn'] = "25"
    optimizeSearchResults.append(eachStockresult)
    shuffle(stocks)
    numshares = int(request.POST['number_of_shares'])
    context_dict = {}
    context_dict['stock_invest'] = float(25000)/float(15.00)
    context_dict['investingAmount'] =  str(request.POST['investing_amount'])
    # context_dict['market'] = U"S Markets"
    # context_dict['Months'] = "12"
    context_dict['numStocks'] = str(request.POST['number_of_shares'])
#brokerage account
    context_dict['expectedRisk'] = str(request.POST['expRisk'])
    context_dict['brokerage'] = str(request.POST['bb_account'])
#retirement
    context_dict['retirement'] = str(request.POST['retirement_account'])
#age
    context_dict['Years'] = str(request.POST['Years'])
    # context_dict['expectedReturn'] = str(request.POST[''])
    context_dict['expectedRisk'] = str(request.POST['expRisk'])
#household salary
    context_dict['household_salary'] = str(request.POST['salary'])
#household pension
    context_dict['household_pension'] = str(request.POST['hh_pension'])
#ss_income
    context_dict['ss_income'] = str(request.POST['ss_income'])
    
    time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
#portname
    try: 
        if request.POST['portname'] == "":
            context_dict['portname'] = "Test Portfolio"
        else: 
            context_dict['portname'] = request.POST['portname']
    except:
        context_dict['portname'] = "Test Portfolio"
    time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
#clientname
    try: 
        if request.POST['clientname'] == "":
            context_dict['clientname'] = "Your Portfolio"
            client_name = "Your Portfolio"
        else: 
            context_dict['clientname'] = request.POST['clientname']
            client_name = str(request.POST['clientname'])
    except:
        context_dict['clientname'] = "Your Portfolio"
        client_name = "Your Portfolio"
#description
    try: 
        if request.POST['description'] == "":
            context_dict['description'] = "N/A"
            description = "N/A"
        else: 
            context_dict['description'] = request.POST['description']
            description = request.POST['description']
    except:
        context_dict['description'] = "N/A"    
        description = "N/A"
    cursor = connection.cursor()
    cursor.execute("INSERT INTO `portal_portfolio` (investing_amount, num_stocks, expected_risk, brokerage_account, retirement_account, age, household_salary, household_income, ss_income, name, created_date, update_date, client_name, description, user_id) VALUES "
                    "('" + str(context_dict['investingAmount']) + "','" + str(context_dict['numStocks']) + "','" + str(context_dict['expectedRisk']) + "','" + str(context_dict['brokerage']) + "','" + str(context_dict['retirement']) + "','" + str(context_dict['Years']) + "','" + str(context_dict['household_salary']) + "','" + str(context_dict['household_pension']) + "','" + str(context_dict['ss_income']) + "','" + str(context_dict['portname']) + "',now(),now(),'" + str(context_dict['clientname']) + "','" + str(context_dict['description']) + "','" + str(userid) + "')")
    cursor.execute("SELECT LAST_INSERT_ID();")
    show_id = dictfetchall(cursor)[0]['LAST_INSERT_ID()']
    context_dict['portfolio_id']  = show_id
    newstocks = []
    randomtotal = 0
    randomarr = []
    for num in range(numshares):
        if num < 5:
            ranInt = randint(1,999)
        elif num > 5:
            ranInt = randint(1,250)
        else:
            ranInt = randint(1,25)
        randomarr.append(ranInt)
        randomtotal += ranInt
    allocationArr = np.random.dirichlet(np.ones(numshares),size=100)
    print(np.sum(allocationArr))
    print(np.sum(allocationArr))
    print(np.sum(allocationArr))
    print(np.sum(allocationArr))
    print(np.sum(allocationArr))
    count=0
    for num in range(numshares+1):
        ticker = str(stocks[num][0])
        companyname = str(stocks[num][1])
        ticker = ticker[0:]
        randomfloat = str(randint(5,89)) + "." + str(randint(0,99))
        if randint(1,2) == 1:
            multipler = "0." + str(randint(6,9))
        else:
            multipler = str(1) + "." + str(randint(0,3))
        randomfloatTwo = float(randomfloat) * float(multipler)
        randomshares = str(randint(15,15000))
        randomallocation = str(allocationArr[count]*100)[1:13]
        cursor = connection.cursor()
        create_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        try:
            cursor.execute("select value from daily_" + str(ticker))
            for sval in dictfetchall[cursor]:
                stock_value = sval['value']
        except:
            stock_share = Share(str(ticker))
            stock_value = stock_share.get_open()
            if stock_value == None:
                stock_value = 0
        sentimentarr = []
        with open("sentiment.csv") as f:
          reader = csv.reader(f)
          for row in reader:
            if len(sentimentarr) > 50:
                break
            if str(row[0]) in str(ticker):
              if str(row[1])[0:5] in '2016-11-11':
                stock_sentiment = (float(row[2])*100)+50
                sentimentarr.append(stock_sentiment)
        sentimentavg = np.average(sentimentarr)
        count += 1
        cursor.execute("INSERT INTO `portal_stock` (created_date, update_date, ticker, show_id, buy_date, current_price, initial_price, number_of_shares, sell_date, company_name, allocation, sentiment)  VALUES "
                        "('"+str(create_date)+"','"+str(create_date)+"','" + str(ticker) + "','" + str(show_id) + "','2017-07-29','" + str(stock_value) + "','" + str(stock_value) + "','" + str(randomshares) + "','2016-09-01','" + str(companyname) + "','" + randomallocation + "','" + str(sentimentavg) + "')")
        newstocks.append({'ticker':stocks[num][0],'cname':stocks[num][1],'price':str(stock_value),'shares':randomshares,'allocation':randomallocation})
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

