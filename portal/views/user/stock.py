from portal.models.data.portfolio import Portfolio
from portal.models.data.stock import Stock
import requests
#from portal.views.user.portfolio import dictfetchall
from django.db import connection

def get_stocks_by_portfolio(request, portfolio_id):
   print(portfolio_id)
   cursor = connection.cursor()
   cursor.execute("select ticker, current_price, initial_price, ticker, "
                  "buy_date, sell_date, "
                  "TRUNCATE(((current_price-initial_price)/initial_price) * 100, 2) "
                  "as gain from portal_stock where show_id=" + str(portfolio_id))
   stocks = dictfetchall(cursor)
   #stocks = Stock.objects.filter(show=portfolio_id)
   #print("Printing portfolios")
   #print(stocks)
   return stocks

def dictfetchall(cursor):
   "Returns all rows from a cursor as a dict"
   desc = cursor.description
   return [
       dict(zip([col[0] for col in desc], row))
       for row in cursor.fetchall()
   ]