from portal import views
from django.conf.urls import patterns, url, include
from django.conf import settings
from django.conf.urls import patterns, url
from django.db import connection
import quandl
import pandas as pd
import time
import datetime


urlpatterns = patterns('',
    url(r'^upload/$', 'portal.views.upload', name='upload'),
    url(r'^cropload/$', 'portal.views.cropload', name='cropload'),
    (r'^/?$', views.main),
    (r'^splash/?$', views.splash),
    (r'^login/?$', views.loginview),
    (r'^logout/?$', views.logoutview),
    (r'^register/?$', views.register),
    (r'^recover_password/?$', views.recover_password),
    (r'^new_password/(?P<token>\w+)/?$', views.new_password),
    (r'^email_sent/?$', views.email_sent),
    (r'^sms/?$', views.sms),
    (r'^getsms/?$', views.getsms),
    (r'^chat_portal/?$', views.chat_portal),
    (r'^sms/sms_symbolexchange/?$', views.sms_symbolexchange),

    #General User Pages
    (r'^user/dashboard/?$', views.dashboard),
    (r'^user/dashboard/skip?$', views.dashboardskip),
    (r'^user/portfolio_chart/(?P<portfolio_id>[0-9]+)/?$', views.portfolio_chart), 
    (r'^user/removeportfolio/(?P<portfolio_id>[0-9]+)/?$', views.removeportfolio), 
    (r'^user/saveportfolio/(?P<portfolio_id>[0-9]+)/?$', views.saveportfolio), 
    (r'^user/stock_chart/(?P<stock_name>\w{0,50})/$', views.stock_chart), 
    (r'^user/portfolio/?$', views.portfolio),
    (r'^user/portfolio_settings/?$', views.portfolio_settings),
    (r'^user/guru_settings/?$', views.guru_settings),
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

def BuildStockDatabase():
    cursor = connection.cursor();
    cursor.execute("select distinct ticker from portal_stock")
    for item in dictfetchall(cursor):
        try:
            print(item)
            # cursor.execute("DROP TABLE stock_" + str(item['ticker']) + "")
            # cursor.execute("CREATE TABLE IF NOT EXISTS stock_" + str(item['ticker']) + " ("
            #                 "`id`INTEGER(2) UNSIGNED AUTO_INCREMENT,"
            #                 "`last_date` DATETIME,"
            #                 "`Adj_Open` VARCHAR(255),"
            #                 "`Adj_High` VARCHAR(255),"
            #                 "`Adj_Low` VARCHAR(255),"
            #                 "`Adj_Close` VARCHAR(255),"
            #                 "`Adj_Volume` VARCHAR(255),"
            #                 "PRIMARY KEY (id) );")
            # # cursor.execute("SELECT last_date FROM stock_" + str(item['ticker']) + " WHERE last_date IN ("
            # #                     "SELECT MAX( last_date ) "
            # #                         "FROM stock_" + str(item['ticker']) + ""
            # #                 ")"
            # #                 "ORDER BY last_date DESC" )
            # # lasttime = dictfetchall(cursor)
            # # for t in lasttime:
            # #     print(t)
            # a = quandl.get(["EOD/" + str(item['ticker']) ])
            # # for item in a['EOD/' + str(item['ticker']) + " - Adj_Close"]):
            # for c in a.index.tolist():
            #     # originaltime = c
            #     # c = str(c)
            #     # c = datetime.datetime.strptime(c, "%Y-%m-%d %H:%M:%S.%f")
            #     # today = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
            #     # dt = datetime.datetime.strptime(today, "%Y-%m-%d %H:%M:%S.%f")
            #     # if c > dt:
            #     c = pd.to_datetime(c)
            #     adj_open = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Open"]
            #     adj_high = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_High"]
            #     adj_low = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Low"]
            #     adj_close = a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Close"]
            #     adj_volume = str(a.loc[c]['EOD/' + str(item['ticker']) + " - Adj_Volume"])
            #     print(adj_volume)
            #     print(adj_open, adj_high, adj_close, adj_volume)
            #     cursor.execute("INSERT INTO stock_" + str(item['ticker']) + " (last_date, Adj_Open, Adj_High, Adj_Low, Adj_Close, Adj_Volume) VALUES"
            #                 " ('" + str(c) + "','" + str(adj_open) + "','" + str(adj_high) + "','" +str(adj_low) + "','" +str(adj_close) + "','" +str(1.0) + "');")
        except:
            print("err")         
            #     cursor.execute("INSERT INTO stock_" + str(item['ticker']))
            #     print(str(c) + " is over " + str(dt))
            # else:
            #     print(str(c) + "is under " + str(dt))
    # try:

    # print(a.index)
        # except: xX
        #     print("b")
        # cursor.execute("DROP TABLE stock_" + str(item['ticker']) + "")
def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]

BuildStockDatabase()

# lets us serve our media
if settings.DEBUG:
    from django.views.static import serve
    _media_url = settings.MEDIA_URL
    if _media_url.startswith('/'):
        _media_url = _media_url[1:]
        urlpatterns += patterns('',
                                (r'^%s(?P<path>.*)$' % _media_url,
                                serve,
                                {'document_root': settings.MEDIA_ROOT}))
    del(_media_url, serve)
if settings.DEBUG:
    urlpatterns += patterns('django.views.static',
        (r'media/(?P<path>.*)', 'serve', {'document_root': settings.MEDIA_ROOT}),
    )
