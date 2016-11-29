from portal import views
from django.conf.urls import patterns, url, include
from django.conf import settings
from django.conf.urls import patterns, url
from django.db import connection
import quandl
quandl.ApiConfig.api_key = 'X8CjGKTPEqTuto2v_Q94'
import pandas as pd
import time
from yahoo_finance import Share
import datetime
import requests
from time import gmtime, strftime
import after_response
import logging
logging.basicConfig()

urlpatterns = patterns('',
    url(r'^upload/$', 'portal.views.upload', name='upload'),
    url(r'^cropload/$', 'portal.views.cropload', name='cropload'),
    (r'^/?$', views.main),
    (r'^splash/?$', views.splash),
    (r'^pre_login/?$', views.pre_login),
    (r'^login/?$', views.loginview),
    (r'^logout/?$', views.logoutview),
    (r'^register/?$', views.register),
    (r'^username_exist/(?P<username>\w{0,50})/$', views.username_exist),
    (r'^email_exist/(?P<email>\w{0,50}@\w{0,50}.\w{0,50})/$', views.email_exist),
    (r'^recover_password/?$', views.recover_password),
    (r'^new_password/(?P<token>\w+)/?$', views.new_password),
    (r'^email_sent/?$', views.email_sent),
    (r'^sms/?$', views.sms),
    (r'^getsms/?$', views.getsms),
    (r'^user/dashboard/marketnews/?$', views.marketnews),
    (r'^user/dashboard/top_picks/?$', views.top_picks),
    (r'^user/dashboard/portfolio_value/?$', views.portfolio_value),
    (r'^user/dashboard/get_gain/?$', views.get_gain),
    (r'^user/dashboard/your_sentiment/?$', views.your_sentiment),
    (r'^user/dashboard/performance_chart/?$', views.performance_chart),
    (r'^user/dashboard/performance_line_chart/?$', views.performance_line_chart),
    (r'^chat_portal/?$', views.chat_portal),
    (r'^user/scatter/(?P<stock_name>.+)/$', views.scatter),
    (r'^user/sentiment_data/(?P<stock_name>\w{0,50})/$', views.sentiment_data),
    (r'^user/portfolio_sentiment_data/(?P<portfolio_id>[0-9]+)/?$', views.portfolio_sentiment_data), 
    (r'^user/portfolio_chart/(?P<portfolio_id>[0-9]+)/?$', views.portfolio_chart), 
    (r'^sms/sms_symbolexchange/?$', views.sms_symbolexchange),
    (r'^user/confirm_phone/(?P<code>\w{0,999999})/$', views.confirm_phone), 
    (r'^user/confirmed_phone/?$', views.confirmed_phone),
    (r'^user/resend_phone/?$', views.resend_phone),

    #General User Pages
    (r'^user/dashboard/?$', views.dashboard),
    (r'^user/dashboard/skip?$', views.dashboardskip),
    (r'^user/portfolio_chart/(?P<portfolio_id>[0-9]+)/?$', views.portfolio_chart), 
    (r'^user/removeportfolio/(?P<portfolio_id>[0-9]+)/?$', views.removeportfolio), 
    (r'^user/saveportfolio/(?P<portfolio_id>[0-9]+)/?$', views.saveportfolio), 
    (r'^user/stock_chart/(?P<stock_name>\w{0,50})/$', views.stock_chart), 
    (r'^user/ndx_chart/$', views.ndx_chart), 
    (r'^user/portfolio/?$', views.portfolio),
    (r'^user/portfolio_settings/?$', views.portfolio_settings),
    (r'^user/portfolio_exist/(?P<portname>.+)/?$', views.portfolio_exist),
    (r'^user/guru_settings/?$', views.guru_settings),
    (r'^user/guru_settings/save_guru/?$', views.save_guru),
    (r'^user/guru_scrape/(?P<guru_id>[0-9]+)/?$', views.guru_scrape), 
    (r'^user/guru_optimize/?$', views.guru_optimize),
    (r'^user/guru_portfolio/(?P<guru_id>[0-9]+)/?$', views.guru_portfolio), 
    (r'^user/portfolio_optimize/?$', views.portfolio_optimize),
    (r'^user/save_portfolio/?$', views.save_portfolio),
    (r'^user/my_portfolios/?$', views.my_portfolios),
    (r'^user/individual_portfolio/(?P<portfolio_id>[0-9]+)/?$', views.individual_portfolio),    
    (r'^user/individual_sentiment/(?P<portfolio_id>[0-9]+)/?$', views.individual_sentiment),    
    (r'^user/individual_stock/(?P<stock_name>\w{0,50})/$', views.individual_stock),
    (r'^user/news_portal/?$', views.news_portal),
    (r'^user/news_portal/getnews/?$', views.getnews),
    (r'^user/news_portal/get_stock_news/(?P<stock_name>\w{0,50})/$', views.get_stock_news),
    (r'^user/news_portal/get_stock_sentiment/(?P<stock_name>\w{0,50})/$', views.get_stock_sentiment),
    (r'^user/news_portal/stock_sentiment_graph/(?P<stock_name>\w{0,50})/$', views.stock_sentiment_graph),
    (r'^user/news_portal/get_portfolio_news/(?P<port_id>.+)/$', views.get_portfolio_news),
    (r'^user/news_portal/get_portfolio_sentiment/(?P<port_id>.+)/$', views.get_portfolio_sentiment),
    (r'^user/news_portal/portfolio_sentiment_data/(?P<id>[0-9]+)/?$', views.portfolio_sentiment_data),    
    (r'^user/top_portfolios/?$', views.top_portfolios),
    (r'^user/search_portfolio/?$', views.search_portfolio),
    (r'^user/backtest/(?P<port_id>[0-9]+)/?$', views.backtest), 
    (r'^user/support/?$', views.support),

    (r'^user/inbox/?$', views.inbox),    

    #twilio views
    (r'^user/addconnection/?$', views.addconnection),   
    (r'^user/removeconnection/?$', views.removeconnection),   
    (r'^user/getconnections/?$', views.getconnections),   
    (r'^user/getmsg/?$', views.getmsg),   
    (r'^user/delmsg/?$', views.delmsg),   
    (r'^user/sendmsg/?$', views.sendmsg),   
    (r'^user/delfriend/?$', views.delfriend),  
)

#BRBB
def BuildStockDatabase():
    cursor = connection.cursor();
    cursor.execute("select distinct ticker from portal_stock")
    for item in dictfetchall(cursor):
        try:
            cursor.execute("DROP TABLE stock_" + str(item['ticker']) + "")
        except:
            print("oh well couldnt drop")
        cursor.execute("CREATE TABLE IF NOT EXISTS stock_" + str(item['ticker']) + " ("
                        "`id`INTEGER(2) UNSIGNED AUTO_INCREMENT,"
                        "`last_date` DATETIME,"
                        "`Adj_Open` VARCHAR(255),"
                        "`Adj_High` VARCHAR(255),"
                        "`Adj_Low` VARCHAR(255),"
                        "`Adj_Close` VARCHAR(255),"
                        "`Adj_Volume` VARCHAR(255),"
                        "PRIMARY KEY (id) );")
        try:
            a = quandl.get(["EOD/" + str(item['ticker']) ])
            for c in a.index.tolist():
                c = pd.to_datetime(c)
                adj_open = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Open"]
                adj_high = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_High"]
                adj_low = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Low"]
                adj_close = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Close"]
                adj_volume = str(a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Volume"])
                cursor.execute("INSERT INTO stock_" + str(item['ticker']) + " (last_date, Adj_Open, Adj_High, Adj_Low, Adj_Close, Adj_Volume) VALUES"
                            " ('" + str(c) + "','" + str(adj_open) + "','" + str(adj_high) + "','" +str(adj_low) + "','" +str(adj_close) + "','" +str(1.0) + "');")
                print(item['ticker'])
        except:
            print("error again")

def BuildSF1Database():
    cursor = connection.cursor();
    cursor.execute("select distinct ticker from portal_stock")
    for item in dictfetchall(cursor):
        d = "SF1/" + str(item['ticker']) + "_DIVYIELD"
        try:
            d_data = quandl.get(d,start_date="2004-01-01", end_date="2016-11-10")
            cursor.execute("CREATE TABLE IF NOT EXISTS SF1_" + str(item['ticker']) + "_DIVYIELD ("
                            "`id`INTEGER(2) UNSIGNED AUTO_INCREMENT,"
                            "`last_date` DATETIME,"
                            "`value` VARCHAR(255),"
                            "PRIMARY KEY (id) );") 
            datearr=[]   
            for a in d_data.index.tolist():
                datearr.append(pd.to_datetime(a))
            for a in d_data['Value']:
                cursor.execute("INSERT INTO SF1_" + str(item['ticker']) + "_DIVYIELD (last_date, value) VALUES "
                                "('" + str(datearr.pop(0)) + "','" + str(a) + "')")
        except:
            print("no quandl")


        mkt = "SF1/" + str(item['ticker']) + "_MARKETCAP"
        try:
            mkt_data = quandl.get(mkt,start_date="2004-01-01", end_date="2016-11-10")
            cursor.execute("CREATE TABLE IF NOT EXISTS SF1_" + str(item['ticker']) + "_MARKETCAP ("
                            "`id`INTEGER(2) UNSIGNED AUTO_INCREMENT,"
                            "`last_date` DATETIME,"
                            "`value` VARCHAR(255),"
                            "PRIMARY KEY (id) );") 
            datearr=[]   
            for a in mkt_data.index.tolist():
                datearr.append(pd.to_datetime(a))
            for a in mkt_data['Value']:
                cursor.execute("INSERT INTO SF1_" + str(item['ticker']) + "_MARKETCAP (last_date, value) VALUES "
                                "('" + str(datearr.pop(0)) + "','" + str(a) + "')")
        except:
            print("no quandl")

        nm = "SF1/" + str(item['ticker']) + "_NETMARGIN_ART"
        try:
            nm_data = quandl.get(nm,start_date="2004-01-01", end_date="2016-11-10")  
            cursor.execute("CREATE TABLE IF NOT EXISTS SF1_" + str(item['ticker']) + "_NETMARGIN ("
                            "`id`INTEGER(2) UNSIGNED AUTO_INCREMENT,"
                            "`last_date` DATETIME,"
                            "`value` VARCHAR(255),"
                            "PRIMARY KEY (id) );") 
            datearr=[]   
            for a in nm_data.index.tolist():
                datearr.append(pd.to_datetime(a))
            for a in nm_data['Value']:
                cursor.execute("INSERT INTO SF1_" + str(item['ticker']) + "_NETMARGIN (last_date, value) VALUES "
                                "('" + str(datearr.pop(0)) + "','" + str(a) + "')")
        except:
            print("no quandl")
        pb = "SF1/" + str(item['ticker']) + "_PB_ARY"
        try:
            pb_data = quandl.get(pb,start_date="2004-01-01", end_date="2016-11-10") 
            cursor.execute("CREATE TABLE IF NOT EXISTS SF1_" + str(item['ticker']) + "_PB ("
                            "`id`INTEGER(2) UNSIGNED AUTO_INCREMENT,"
                            "`last_date` DATETIME,"
                            "`value` VARCHAR(255),"
                            "PRIMARY KEY (id) );") 
            datearr=[]   
            for a in pb_data.index.tolist():
                datearr.append(pd.to_datetime(a))
            for a in pb_data['Value']:
                cursor.execute("INSERT INTO SF1_" + str(item['ticker']) + "_PB (last_date, value) VALUES "
                                "('" + str(datearr.pop(0)) + "','" + str(a) + "')")
        except:
            print("no quandl")
        pe = "SF1/" + str(item['ticker']) + "_PE_ART"
        try:
            pe_data = quandl.get(pe,start_date="2004-01-01", end_date="2016-11-10")
            cursor.execute("CREATE TABLE IF NOT EXISTS SF1_" + str(item['ticker']) + "_PE ("
                            "`id`INTEGER(2) UNSIGNED AUTO_INCREMENT,"
                            "`last_date` DATETIME,"
                            "`value` VARCHAR(255),"
                            "PRIMARY KEY (id) );") 
            datearr=[]   
            for a in pe_data.index.tolist():
                datearr.append(pd.to_datetime(a))
            for a in pe_data['Value']:
                cursor.execute("INSERT INTO SF1_" + str(item['ticker']) + "_PE (last_date, value) VALUES "
                                "('" + str(datearr.pop(0)) + "','" + str(a) + "')")
        except:
            print("no quandl")
        epusd = "SF1/" + str(item['ticker']) + "_EPSUSD_ART"
        try:
            epusd_data = quandl.get(epusd,start_date="2004-01-01", end_date="2016-11-10")
            cursor.execute("CREATE TABLE IF NOT EXISTS SF1_" + str(item['ticker']) + "_EPUSD ("
                            "`id`INTEGER(2) UNSIGNED AUTO_INCREMENT,"
                            "`last_date` DATETIME,"
                            "`value` VARCHAR(255),"
                            "PRIMARY KEY (id) );") 
            datearr=[]   
            for a in epusd_data.index.tolist():
                datearr.append(pd.to_datetime(a))
            for a in epusd_data['Value']:
                cursor.execute("INSERT INTO SF1_" + str(item['ticker']) + "_EPUSD (last_date, value) VALUES "
                                "('" + str(datearr.pop(0)) + "','" + str(a) + "')")
        except:
            print("no quandl")
            
def RefreshDB():
    cursor = connection.cursor();
    cursor.execute("select distinct ticker from portal_stock")
    for item in dictfetchall(cursor):
        atime = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        stock_ticker = item['ticker']
        cursor.execute("select last_date from stock_"+str(stock_ticker)+" order by last_date DESC LIMIT 1")
        for last_date in dictfetchall(cursor):
            if time.strptime(atime, "%Y-%m-%d %H:%M:%S") > time.strptime(str(last_date['last_date']), "%Y-%m-%d %H:%M:%S"):
                starttime = str(last_date['last_date'])[0:10]
                endtime = strftime("%Y-%m-%d", gmtime())
                print(str(stock_ticker))
                print(starttime)
                print(endtime)
                a = quandl.get(["EOD/" + str(stock_ticker)], start_date=endttime, end_date=endtime)
                print(a)
                for c in a.index.tolist():
                    c = pd.to_datetime(c)
                    adj_open = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Open"]
                    adj_high = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_High"]
                    adj_low = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Low"]
                    adj_close = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Close"]
                    print(adj_close)
                    print(c)
                    adj_volume = str(a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Volume"])
                    cursor.execute("INSERT INTO stock_" + str(item['ticker']) + " (last_date, Adj_Open, Adj_High, Adj_Low, Adj_Close, Adj_Volume) VALUES"
                                " ('" + str(c) + "','" + str(adj_open) + "','" + str(adj_high) + "','" +str(adj_low) + "','" +str(adj_close) + "','" +str(1.0) + "');")
@after_response.enable
def Update_DB_Dispatcher():
    RefreshDB()
    for i in xrange(0,365):
        print("Your Database Dispatcher is now turned on!")
        t = datetime.datetime.today()
        future = datetime.datetime(t.year,t.month,t.day,2,0)
        if t.hour >= 2:
            future += datetime.timedelta(days=1)
        print("Going to sleep until " + str(future-t) + ", and then I will refresh your database!")
        time.sleep((future-t).seconds)
        RefreshDB()

@after_response.enable
def RefreshStockPrices():
    cursor = connection.cursor();
    cursor.execute("select distinct ticker from portal_stock")
    for table_stock in dictfetchall(cursor):
        try:
            cursor.execute("select * from daily_" + str(table_stock['ticker']))
        except:
            cursor.execute("CREATE TABLE IF NOT EXISTS daily_" + str(table_stock['ticker']) + " ("
                            "`id`INTEGER(1) DEFAULT 1,"
                            "`value` VARCHAR(12),"
                            "PRIMARY KEY (id) );")
            cursor.execute("INSERT into daily_" + str(table_stock['ticker']) + " (value) VALUES ('0') ")
        try:
            stock_share = Share(str(table_stock['ticker']))
            stock_value = stock_share.get_open()
            print(stock_value)
            update_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
            cursor.execute("UPDATE daily_" + str(table_stock['ticker']) + " SET value = " + str(stock_value) + " WHERE id = 1")
            cursor.execute("UPDATE portal_stock SET current_price = " + str(stock_value) + " WHERE ticker = '" + str(table_stock['ticker']) + "'")
            cursor.execute("UPDATE portal_stock SET update_date = '" + str(update_time) + "' WHERE ticker = '" + str(table_stock['ticker']) + "'")
            print(str(table_stock['ticker'])+ " updated to : " + str(stock_value))
        except:
            print("error updating" + str(table_stock['ticker']))
@after_response.enable
def Update_Stocks_Dispatcher():
    print("Your Stock Price Dispatcher is now turned on!")
    RefreshStockPrices()
    print("Going to sleep for an 15 minutes, and then I will refresh your database!")
    for i in xrange(0,365):
        time.sleep(360)
        RefreshStockPrices()

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]
# BuildStockDatabase()
# BuildSF1Database()
# Update_DB_Dispatcher.after_response()
# Update_Stocks_Dispatcher.after_response()


# lets us serve our media
if settings.DEBUG:
    from django.views.static import serve
    # urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    _media_url = settings.MEDIA_URL
    if _media_url.startswith('/'):
        _media_url = _media_url[1:]
        urlpatterns += patterns('',
                                (r'^%s(?P<path>.*)$' % _media_url,
                                serve,
                                {'document_root': settings.MEDIA_ROOT}))
    del(_media_url, serve)