from django.http import HttpResponse
from django.http import JsonResponse
import urllib2
import requests
import json

def sms_symbolexchange(company):
    # print(str(company))
    # response = requests.get("http://chstocksearch.herokuapp.com/api/"+str(company))
    response = requests.get("https://s.yimg.com/aq/autoc?query="+str(company)+"&region=US&lang=en-US").json()
    # print(response)
    company_name = response['ResultSet']['Result'][0]['name']
    # print(company_name)
    # try:
    #     print(response['ResultSet']['Result'][0]['symbol'])
    #     # company_name = response.json()[0]['company']
    #     # returnString = "The company name for " + str(company) + " is " + company_name + " . "
    #     returnString = "The symbol for " + str(company) + " is " + response['ResultSet']['Result'][0]['symbol'] + " . "
    # except IndexError:
    #     company_name = response.json()[0]['company']
    #     returnString = "The company name for " + str(company) + " is " + company_name + " . "
        # response = requests.get("https://s.yimg.com/aq/autoc?query="+str(company)+"&region=US&lang=en-US").json()
        # print(response['ResultSet']['Result'][0]['symbol'])
        # returnString = "asdf"
        # returnString = "The symbol for " + str(company) + " is " + response['ResultSet']['Result'][0]['symbol'] + " . "
    returnString = str(company_name)
    return returnString
    