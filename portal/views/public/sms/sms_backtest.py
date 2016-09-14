from django.http import HttpResponse
from django.http import JsonResponse
import urllib2
import requests
import json
from portal.models.data.portfolio import Portfolio
from portal.models.user.portal_user import PortalUser
from datetime import datetime
from prophet import Prophet
from prophet.data import YahooCloseData
from prophet.analyze import default_analyzers
from prophet.orders import Orders

class OrderGenerator(object):

    def run(self, prices, timestamp, cash, **kwargs):
        symbol = "AAPL"
        orders = Orders()
        if (prices.loc[timestamp, symbol] * 100) < cash:
            orders.add_order(symbol, 100)

        return orders
        
def sms_backtest(id, q):

    prophet = Prophet()
    prophet.set_universe(['AAPL', 'XOM'])

    prophet.register_data_generators(YahooCloseData())
    prophet.set_order_generator(OrderGenerator())
    backtest = prophet.run_backtest(start=datetime(2010, 1, 1))

    prophet.register_portfolio_analyzers(default_analyzers)
    analysis = prophet.analyze_backtest(backtest)
    print(analysis)
    today = datetime(2014, 11, 10)
    print(prophet.generate_orders(today))
    # all_portfolios = Portfolio.objects.filter(user__id=1)
    # print(all_portfolios)
    # for port in all_portfolios:
    #     portName = port.name
    #     print(portName)
    company_name = "sms_backtest"
    returnString = str(company_name)
    return returnString
    