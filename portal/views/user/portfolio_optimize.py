from time import gmtime, strftime
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import urllib2
import csv
import requests
import json
import time
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
    stocks = [['ADS', 'Alliance Data Systems','Business Services'], ['GILD', 'Gilead Sciences','Biotech & Pharmaceuticals'], ['AAPL ', 'Apple','Information Technology'], ['BMY', 'Bristol-Myers Squibb Co','Biotech & Pharmaceuticals'], ['MSFT', 'Microsoft','Information Technology'], ['ON', 'ON Semiconductor','Manufacturing'], ['HBI', 'Hanesbrands'], ['LCI', 'Lannett Co','Biotech & Pharmaceuticals'], ['TEVA', 'Teva Pharmaceutical','Biotech & Pharmaceuticals'], ['MCK', 'McKesson','Health Care'], ['UNH', 'UnitedHealth Group'], ['RUSHA', 'Rush Enterprises','Retail'], ['CE', 'Celanese Corporation','Manufacturing'], ['NSR', 'Neustar','Information Technology'], ['BIIB', 'Biogen','Biotech & Pharmaceuticals'], ['ALGT', 'Allegiant Travel Company','Transportation & Logistics'], ['OLED', 'Universal Display','Manufacturing'], ['SLB', 'Schlumberger N.V.'], ['CYH', 'Community Health Systems','Health Care'], ['HAL', 'Halliburton Company','Oil, Gas, Energy & Utilities'], ['NLY', 'Annaly Capital','Real Estate'], ['RUSHB', 'Rush Enterprises','Retail'], ['CELG', 'Celgene Corporation','Biotech & Pharmaceuticals'], ['PFE', 'Pfizer','Biotech & Pharmaceuticals'], ['BWP', 'Boardwalk Pipeline','Oil, Gas, Energy & Utilities'], ['BXE', 'Bellatrix Exploration','Oil, Gas, Energy & Utilities'], ['AXL', 'American Axle','Manufacturing'], ['AB', 'AllianceBernstein','Finance'], ['GLNG', 'Golar LNG','Transportation & Logistics'], ['ACAS', 'American Capital','Finance'], ['DSPG', 'DSP Group','Manufacturing'], ['QUIK', 'QuickLogic','Information Technology'], ['GTIM', 'Good Times Restaurants','Retail'], ['BHI', 'Baker Hughes','Oil, Gas, Energy & Utilities'], ['TOO', 'Teekay Offshore Partners','Transportation & Logistics'], ['SHLD', 'Sears Holdings','Retail'], ['AN', 'AutoNation','Retail'], ['IBM', 'International Business Machines','Business Services'], ['GPS', 'Gap, Inc.','Retail'], ['STX', 'Seagate Technology','Information Technology'], ['FOSL', 'Fossil Group','Retail'], ['BAM', 'Brookfield Asset Management','Finance'], ['AME', 'AMETEK','Manufacturing'], ['SCHW', 'Charles Schwab','Finance'], ['WFC', 'Wells Fargo','Finance'], ['LBTYK', 'Liberty Global','Telecommunications'], ['CCK', 'Crown Holdings','Manufacturing'], ['USB', 'U.S. Bancorp'], ['VRX', 'Valeant Pharmaceuticals','Biotech & Pharmaceuticals'], ['BRO', 'Brown & Brown'], ['LKQ', 'LKQ','Retail'], ['AMG', 'Affiliated Managers Group','Business Services'], ['PRGO', 'Perrigo Company','Biotech & Pharmaceuticals'], ['MHK', 'Mohawk Industries','Manufacturing'], ['JLL', 'Jones Lang LaSalle','Real Estate'], ['SRCL', 'Stericycle','Business Services'], ['FMC', 'FMC Corporation','Manufacturing'], ['AME', 'AMETEK, Inc.','Manufacturing'], ['CERN', 'Cerner Corporation','Information Technology'], ['EWBC', 'East West Bancorp','Finance'], ['TRMB', 'Trimble','Information Technology'], ['VAL', 'Valspar Corporation','Manufacturing'], ['MAT', 'Mattel','Manufacturing'], ['SBAC', 'SBA Communications Corporation','Telecommunications'], ['BOH', 'Bank of Hawaii Corporation','Finance'], ['XRAY', 'DENTSPLY SIRONA','Manufacturing'], ['WSO', 'Watsco, Inc.','Business Services'], ['MLHR', 'Herman Miller, Inc.','Manufacturing'], ['JBHT', 'J.B. Hunt Transport Services','Transportation & Logistics'], ['ROL', 'Rollins','Business Services'], ['WWD', 'Woodward','Manufacturing'], ['FTI', 'FMC Technologies','Manufacturing'], ['CLB', 'Core Laboratories','Oil, Gas, Energy & Utilities'], ['KEX', 'Kirby Corporation','Transportation & Logistics'], ['AZO', 'AutoZone','Retail'], ['CTXS', 'Citrix Systems','Information Technology'], ['EW', 'Edwards Lifesciences','Manufacturing'], ['DSW', 'DSW Inc.','Retail'], ['SBH', 'Sally Beauty Holdings','Retail'], ['ANSS', 'ANSYS','Information Technology'], ['BBBY', 'Bed Bath & Beyond','Retail'], ['IDXX', 'IDEXX Laboratories','Biotech & Pharmaceuticals'], ['IDXX', 'IDEXX Laboratories','Biotech & Pharmaceuticals'], ['NBL', 'Noble Energy Inc.','Oil, Gas, Energy & Utilities'], ['ZBRA', 'Zebra Technologies','Information Technology'], ['BC', 'Brunswick Corporation','Manufacturing'], ['PKI', 'PerkinElmer','Biotech & Pharmaceuticals'], ['CBRL', 'Cracker Barrel Old Country','Restaurants, Bars & Food Services'], ['GWR', 'Genesee & Wyoming Inc.','Transportation & Logistics'], ['DLTR', 'Dollar Tree,'], ['COH', 'Coach','Retail'], ['HE', 'Hawaiian Electric Industries','Oil, Gas, Energy & Utilities'], ['INT', 'World Fuel Services Corporation','Business Services'], ['HAE', 'Haemonetics Corporation Common ','Manufacturing'], ['HURN', 'Huron Consulting Group','Business Services'], ['VRNT', 'Verint Systems Inc.','Information Technology'], ['AJG', 'Arthur J. Gallagher','Insurance'], ['SCS', 'Steelcase Inc.','Manufacturing'], ['RCL', 'Royal Caribbean Cruises Ltd.','Travel & Tourism'], ['EOG', 'EOG Resources Inc.','Oil, Gas, Energy & Utilities'], ['UNP', 'Union Pacific Corporation','Transportation & Logistics'], ['CMP', 'Compass Minerals Intl','Manufacturing'], ['PII', 'Polaris Industries Inc.','Manufacturing'], ['FLO', 'Flowers Foods Inc.','Manufacturing'], ['FLIR', 'FLIR Systems Inc.','Manufacturing'], ['EXPD', 'Expeditors International','Transportation & Logistics'], ['GIL', 'Gildan Activewear Inc.','Manufacturing'], ['POWI', 'Power Integrations Inc.','Manufacturing'], ['PHG', 'Koninklijke Philips','Manufacturing'], ['FLS', 'Flowserve Corporation','Manufacturing'], ['LII', 'Lennox International','Business Services'], ['LLTC', 'Linear Technology Corporation','Manufacturing'], ['ASB', 'Associated Banc-Corp','Finance'], ['ATR', 'AptarGroup, Inc','Manufacturing'], ['WWW', 'Wolverine World Wide Inc.','Retail'], ['ICLR', 'ICON plc','Biotech & Pharmaceuticals'], ['SMG', 'Scotts Miracle-Gro Company','Manufacturing'], ['APD', 'Air Products and Chemicals','Manufacturing'], ['EFX', 'Equifax Inc.','Finance'], ['SHW', 'Sherwin-Williams Company','Manufacturing'], ['HUM', 'Humana Inc','Insurance'], ['EBAY', 'eBay Inc.','Information Technology'], ['MINI', 'Mobile Mini Inc.','Business Services'], ['MATX', 'Matson Inc.','Transportation & Logistics'], ['DENN', 'Dennys Corporation','Restaurants, Bars & Food Services'], ['NATI', 'National Instruments Corporation','Manufacturing'], ['EGN', 'Energen Corporation','Oil, Gas, Energy & Utilities'], ['NVDA', 'NVIDIA Corporation','Information Technology'], ['ITRI', 'Itron, Inc.','Oil, Gas, Energy & Utilities'], ['TPX', 'Tempur Sealy International','Manufacturing'], ['IPHS', 'Innophos Holdings','Manufacturing'], ['OXY', 'Occidental Petroleum','Oil, Gas, Energy & Utilities'], ['GWW', 'W.W. Grainger Inc','Business Services'], ['BRCD', 'Brocade Communications Systems','Information Technology'], ['CREE', 'Cree Inc.','Manufacturing'], ['LANC', 'Lancaster Colony Corporation','Manufacturing'], ['NGD', 'New Gold Inc.'], ['BLK', 'BlackRock Inc.','Finance'], ['ETN', 'Eaton Corporation,','Manufacturing'], ['KMB', 'Kimberly-Clark','Manufacturing'], ['MDP', 'Meredith Corporation','Media'], ['RPM', 'RPM International Inc.','Manufacturing'], ['LEG', 'Leggett & Platt','Manufacturing'], ['WBA', 'Walgreens Boots Alliance','Retail'], ['CSCO', 'Cisco Systems','Information Technology'], ['JNJ', 'Johnson & Johnson','Insurance'], ['HAS', 'Hasbro','Manufacturing'], ['GPC', 'Genuine Parts Company','Transportation & Logistics'], ['LMT', 'Lockheed Martin Corporation','Aerospace & Defense'], ['RAI', 'Reynolds American Inc','Manufacturing'], ['SYY', 'Sysco Corporation','Business Services'], ['EMR', 'Emerson Electric Company','Manufacturing'], ['PAYX', 'Paychex'], ['BAX', 'Baxter International Inc.','Biotech & Pharmaceuticals'], ['MSFT', 'Microsoft Corporation','Information Technology'], ['CFR', 'Cullen/Frost Bankers Inc.','Finance'], ['UPS', 'United Parcel Service Inc.','Transportation & Logistics'], ['T', 'AT&T Inc.','Telecommunications'], ['CA', 'CA Inc.','Information Technology'], ['CVX', 'Chevron Corporation','Oil, Gas, Energy & Utilities'], ['TAP', 'Molson Coors Brewing Company','Manufacturing'], ['DD', 'E.I. du Pont de Nemours','Manufacturing'], ['GEF', 'Greif Inc. Class A Common Stock','Manufacturing'], ['AAPL', 'Apple Inc.','Information Technology'], ['MMC', 'Marsh & McLennan Companies','Insurance'], ['NSC', 'Norfolk Southern Corporation','Transportation & Logistics'], ['INTC', 'Intel Corporation','Information Technology'], ['EEP', 'Enbridge Energy'], ['NEM', 'Newmont Mining Corporation','Mining & Metals'], ['BMRN', 'BioMarin Pharmaceuticals','Biotech & Pharmaceuticals'], ['MON', 'Monsanto Company','Agriculture & Forestry'], ['CATO', 'Cato Corporation','Retail'], ['RBA', 'Ritchie Bros. Auctioneers','Retail'], ['MCD', 'McDonalds Corporation','Restaurants, Bars & Food Services'], ['SWK', 'Stanley Black & Decker Inc.','Manufacturing'], ['GATX', 'GATX Corporation','Business Services'], ['ADSK', 'Autodesk Inc.','Information Technology'], ['GLW', 'Corning Incorporated','Manufacturing'], ['DLR', 'Digital Realty Trust','Information Technology'], ['LVLT', 'Level 3 Communications','Transportation & Logistics'], ['WYNN', 'Wynn Resorts Limited','Arts, Entertainment & Recreation'], ['FDX', 'FedEx Corporation','Transportation & Logistics'], ['CNX', 'CONSOL Energy Inc.','Oil, Gas, Energy & Utilities'], ['UTX', 'United Technologies Corporation','Aerospace & Defense'], ['DD', 'E.I. du Pont de Nemours','Manufacturing'], ['GHC', 'Graham Holdings Company','Media'], ['VSAT', 'ViaSat Inc.','Telecommunications'], ['RL', 'Ralph Lauren Corporation','Retail'], ['RE', 'Everest Re Group Ltd.','Insurance'], ['PHG', 'Koninklijke Philips','Manufacturing'], ['RYN', 'Rayonier Inc.','Real Estate'], ['LMCK', 'Liberty Media Corporation','Retail'], ['MTN', 'Vail Resorts Inc.','Arts, Entertainment & Recreation'], ['ATU', 'Actuant Corporation','Manufacturing'], ['DEL', 'Deltic Timber Corporation','Agriculture & Forestry'], ['CHK', 'Chesapeake Energy Corporation','Oil, Gas, Energy & Utilities'], ['BEN', 'Franklin Resources Inc.','Finance'], ['BIDU', 'Baidu, Inc.','Information Technology'], ['CKH', 'SEACOR Holdings Inc.','Business Services'], ['MPEL', 'Melco Crown Entertainment','Arts, Entertainment & Recreation'], ['AON', 'AON plc','Insurance'], ['CF', 'CF Industries Holdings','Manufacturing'], ['TPLM', 'Triangle Petroleum Corporation '], ['JOE', 'St. Joe Company','Construction, Repair & Maintenance'], ['SHLD', 'Sears Holdings Corporation','Retail'], ['BAC', 'Bank of America Corporation','Finance'], ['LUK', 'Leucadia National Corporation','Finance'], ['RDI', 'Reading International Inc','Arts, Entertainment & Recreation'], ['APD', 'Air Products and Chemicals','Manufacturing'], ['CAR', 'Avis Budget Group Inc.','Transportation & Logistics'], ['CALL', 'magicJack VocalTec Ltd','Information Technology'], ['JBLU', 'JetBlue Airways Corporation','Transportation & Logistics'], ['UNP', 'Union Pacific Corporation','Transportation & Logistics'], ['MU', 'Micron Technology Inc.','Manufacturing'], ['GE', 'General Electric Company','Information Technology'], ['LOV', 'Spark Networks Inc.','Information Technology'], ['GS', 'Goldman Sachs Group Inc.','Finance'], ['CP', 'Canadian Pacific Railway','Transportation & Logistics'], ['AAL', 'American Airlines Group','Travel & Tourism'], ['HTZ', 'Hertz Global Holdings Inc.','Travel & Tourism'], ['RAI', 'Reynolds American Inc','Manufacturing'], ['CTO', 'Consolidated-Tomoka Land Co.','Real Estate'], ['MO', 'Altria Group Inc.','Manufacturing'], ['GOOGL', 'Alphabet Inc.','Information Technology'], ['UNP', 'Union Pacific Corporation','Transportation & Logistics'], ['BHI', 'Baker Hughes Incorporated','Oil, Gas, Energy & Utilities'], ['GD', 'General Dynamics Corporation','Aerospace & Defense'], ['KO', 'Coca-Cola Company ','Manufacturing'], ['WDC', 'Western Digital Corporation','Information Technology'], ['ARRS', 'ARRIS International plc','Telecommunications'], ['PTEN', 'Patterson-UTI Energy Inc.','Oil, Gas, Energy & Utilities'], ['NBL', 'Noble Energy Inc.','Oil, Gas, Energy & Utilities'], ['AVT', 'Avnet Inc.','Business Services'], ['AAN', 'Aarons, Inc.','Retail'], ['IDCC', 'InterDigital Inc.','Manufacturing'], ['DV', 'DeVry Education Group Inc.','Education'], ['XEC', 'Cimarex Energy Co','Oil, Gas, Energy & Utilities'], ['HP', 'Helmerich & Payne Inc.','Oil, Gas, Energy & Utilities'], ['RDC', 'Rowan Companies plc','Oil, Gas, Energy & Utilities'], ['ARW', 'Arrow Electronics Inc.','Business Services'], ['VECO', 'Veeco Instruments Inc.','Manufacturing'], ['AGCO', 'AGCO Corporation','Manufacturing'], ['SM', 'SM Energy Company','Oil, Gas, Energy & Utilities'], ['CUB', 'Cubic Corporation','Aerospace & Defense'], ['APOL', 'Apollo Education Group Inc.','Education'], ['OSK', 'Oshkosh Corporation','Manufacturing'], ['FL', 'Foot Locker Inc.','Retail'], ['UHAL', 'Amerco','Travel & Tourism'], ['NEE', 'NextEra Energy Inc.','Oil, Gas, Energy & Utilities'], ['DUK', 'Duke Energy Corporation','Oil, Gas, Energy & Utilities'], ['CMS', 'CMS Energy Corporation','Oil, Gas, Energy & Utilities'], ['ALL', 'Allstate Corporation','Insurance'], ['XEL', 'Xcel Energy Inc.','Oil, Gas, Energy & Utilities'], ['PFE', 'Pfizer, Inc.','Biotech & Pharmaceuticals'], ['MRK', 'Merck & Company Inc.','Health Care'], ['IBM', 'International Business Machines','Business Services'], ['AVA', 'Avista Corporation','Oil, Gas, Energy & Utilities'], ['ABT', 'Abbott Laboratories','Biotech & Pharmaceuticals'], ['FTK', 'Flotek Industries Inc.','Oil, Gas, Energy & Utilities'], ['SIRI', 'Sirius XM Holdings Inc.','Media'], ['BG', 'Bunge Limited Bunge Limited','Manufacturing'], ['AGN', 'Allergan ','Biotech & Pharmaceuticals'], ['SUPN', 'Supernus Pharmaceuticals Inc.','Biotech & Pharmaceuticals'], ['CPN', 'Calpine Corporation','Oil, Gas, Energy & Utilities'], ['EDAP', 'EDAP TMS S.A.','Manufacturing'], ['RLI', 'RLI Corporation','Insurance'], ['ASH', 'Ashland Global Holdings'], ['ASTC', 'Astrotech Corporation','Business Services'], ['WEC', 'WEC Energy Group Inc.'], ['ACTA', 'Actua Corporation'], ['ECOL', 'US Ecology Inc.','Oil, Gas, Energy & Utilities'], ['AGEN', 'Agenus Inc.','Biotech & Pharmaceuticals'], ['GG', 'Goldcorp Inc.','Mining & Metals'], ['PRGO', 'Perrigo Company','Biotech & Pharmaceuticals'], ['DRRX', 'DURECT Corporation','Biotech & Pharmaceuticals'], ['XOM', 'Exxon Mobil Corporation','Oil, Gas, Energy & Utilities'], ['K', 'Kellogg Company'], ['PQ', 'Petroquest Energy Inc.','Oil, Gas, Energy & Utilities'], ['XPL', 'Solitario Exploration & Royalty','Mining & Metals'], ['TWI', 'Titan International Inc.','Manufacturing'], ['AMT', 'American Tower Corporation','Telecommunications'], ['MKL', 'Markel Corporation','Insurance'], ['MA', 'Mastercard Incorporated','Finance'], ['MCO', 'Moodys Corporation','Finance'], ['DLTR', 'Dollar Tree Inc.'], ['KMX', 'CarMax Inc','Retail'], ['V', 'Visa Inc.','Information Technology'], ['ROP', 'Roper Technologies Inc.','Manufacturing'], ['ESGR', 'Enstar Group Limited','Finance'], ['ORLY', 'OReilly Automotive Inc.'], ['SBAC', 'SBA Communications Corporation','Telecommunications'], ['LKQ', 'LKQ Corporation','Retail'], ['MNRO', 'Monro Muffler Brake Inc.','Construction, Repair & Maintenance'], ['AMTD', 'TD Ameritrade Holdings','Finance'], ['DHR', 'Danaher Corporation','Manufacturing'], ['DHIL', 'Diamond Hill Investment Group ','Business Services'], ['ANSS', 'ANSYS Inc.','Information Technology'], ['LAMR', 'Lamar Advertising Company','Business Services'], ['CSX', 'CSX Corporation','Transportation & Logistics'], ['AI', 'Arlington Asset Investment','Finance'], ['WM', 'Waste Management Inc.','Oil, Gas, Energy & Utilities'], ['CNI', 'Canadian National Railway','Transportation & Logistics'], ['CAT', 'Caterpillar Inc.','Manufacturing'], ['WMT', 'Wal-Mart Stores, Inc.','Retail'], ['CCI', 'Crown Castle International','Telecommunications'], ['ECL', 'Ecolab Inc.','Manufacturing'], ['KOF', 'Coca Cola Femsa','Manufacturing'], ['UPS', 'United Parcel Service Inc.','Transportation & Logistics'], ['FDX', 'FedEx Corporation'], ['TV', 'Grupo Televisa S.A.','Media'], ['WBA', 'Walgreens Boots Alliance Inc.','Retail'], ['LBTYK', 'Liberty Global','Telecommunications'], ['AN', 'AutoNation Inc.','Retail'], ['LBTYA', 'Liberty Global','Telecommunications'], ['ARCO', 'Arcos Dorados Holdings Inc.'], ['LILA', 'Liberty Global','Telecommunications'], ['PG', 'Procter & Gamble ','Manufacturing'], ['FOXA', 'Twenty-First Century Fox','Business Services'], ['FOX', 'Twenty-First Century Fox','Business Services'], ['PEP', 'Pepsico Inc.','Manufacturing'], ['CSCO', 'Cisco Systems Inc.','Information Technology'], ['ORCL', 'Oracle Corporation','Information Technology'], ['JNJ', 'Johnson & Johnson','Insurance'], ['KO', 'Coca-Cola Company','Manufacturing'], ['SYY', 'Sysco Corporation','Business Services'], ['MSFT', 'Microsoft Corporation','Information Technology'], ['XOM', 'Exxon Mobil Corporation','Oil, Gas, Energy & Utilities'], ['USB', 'U.S. Bancorp'], ['COP', 'ConocoPhillips','Oil, Gas, Energy & Utilities'], ['BK', 'Bank of New York Mellon','Finance'], ['AVP', 'Avon Products Inc.','Manufacturing'], ['STT', 'State Street Corporation','Finance']]
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
    # numshares = int(len(stocks))
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
    allocationArr = np.random.dirichlet(np.ones(numshares),size=1)
    count=0
    for num in range(numshares):
        allocation =  float(allocationArr[0][count])*100.0000
        ticker = str(stocks[num][0])
        companyname = str(stocks[num][1])
        ticker = ticker[0:]
        try:
            sector = str(stocks[num][2])
        except IndexError:
            sector = ""
        randomfloat = str(randint(5,89)) + "." + str(randint(0,99))
        if randint(1,2) == 1:
            multipler = "0." + str(randint(6,9))
        else:
            multipler = str(1) + "." + str(randint(0,3))
        randomfloatTwo = float(randomfloat) * float(multipler)
        randomshares = str(randint(15,15000))
        # randomallocation = allocationArr[count]*100
        cursor = connection.cursor()
        create_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        try:
            cursor.execute("select value from daily_" + str(ticker))
            for sval in dictfetchall[cursor]:
                stock_value = sval['value']
        except:
            try:
                stock_value =  Share(ticker).get_open()
                print("THE STOCK VALUE OF " + str(ticker) + " is  " + str(stock_value))
                if stock_value == None:
                    stock_value = 23.22
            except:
                stock_value = 23.22
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
        cursor.execute("INSERT INTO `portal_stock` (created_date, update_date, ticker, show_id, buy_date, current_price, initial_price, number_of_shares, sell_date, company_name, allocation, sentiment, sector)  VALUES "
                        "('"+str(create_date)+"','"+str(create_date)+"','" + str(ticker) + "','" + str(show_id) + "','2017-07-29','" + str(stock_value) + "','" + str(float(stock_value)*0.9) + "','" + str(randomshares) + "','2016-09-01','" + str(companyname) + "','" + str(allocation) + "','" + str(sentimentavg) + "','" + str(sector) + "')")
        newstocks.append({'ticker':stocks[num][0],'cname':stocks[num][1],'price':str(stock_value),'shares':randomshares,'allocation':allocation})
    # new_investment = request.POST['investingAmount']
    # if request.POST['Market'] == "S&P500":
    #     new_market = "S"
    # elif request.POST['Market'] == "Nasdaq":
    #     new_market = "N"
    # else:
    #     new_market = "D"
    # new_risk = 33

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

