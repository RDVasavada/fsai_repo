import argparse
from time import sleep
import getpass
from django.views.decorators.csrf import csrf_exempt
# from selenium import webdriver
# from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup
from django.http import JsonResponse
import guru_config as config

#==================================================================================================
@csrf_exempt
def guru_scrape(request, guru_id):
    # print(config)
    # payload = stain()
    payload = [
        {'High':16.0, 'Date': '2006-12-29'},
        {'High':15.3, 'Date': '2007-12-31'},
        {'High':-30.6, 'Date': '2008-12-31'},
        {'High':39.2, 'Date': '2010-12-31'},
        {'High':36.0, 'Date': '2013-12-31'},
        {'High':84.2, 'Date': '2014-12-31'},
        {'High':4.0, 'Date': '2015-12-31'},
    ]
    return JsonResponse({'data':payload})

def login(my_username, my_password):
    """ Login to Quantopian."""

    print "Logging in..."
    browser = webdriver.Firefox()
    browser.get(config.URL_QUANTOPIAN)

    unsuccessful = True
    while unsuccessful:
        try:
            sleep(1)
            username = browser.find_element_by_id("user_email")
            username.send_keys("adam@ailabs.co")
            password = browser.find_element_by_id("user_password")
            password.send_keys("AILABS_2016")
            browser.find_element_by_id(config.BUTTON_ID).click()
            unsuccessful = False
        except NoSuchElementException:
            print "\tretry page load...\n"
    assert browser.current_url != config.URL_QUANTOPIAN, "Login failed."
    return browser


def fetch_returns(browser, url_list):
    """ Fetch returns from each of the algorithms from Quantopian."""

    return_list = []
    for url in url_list:
        unsuccessful = True
        while unsuccessful:
            browser.get(url)
            for element in browser.find_elements_by_css_selector("span.cm-string"):
                item = str(element.text)
                if item == "'Bill_Gates.csv'":
                    browser.execute_script("arguments[0].innerText = \'Robert_Bruce.csv\'",element)
            count = 0
            for element in browser.find_elements_by_css_selector("div.code_cell"):
                count += 1
                if count == 7:
                    element.click()
                    NEXT_BUTTON_XPATH = '//button[@title="run cell, select below"]'
                    TOP_BUTTON_XPATH = '//h1[@id="Guru-Portfolios"]'
                    SAVE_BUTTON_XPATH = '//button[@title="Save and Checkpoint"]'
                    save = browser.find_element_by_xpath(SAVE_BUTTON_XPATH)
                    top = browser.find_element_by_xpath(TOP_BUTTON_XPATH)
                    top.click()
                    button = browser.find_element_by_xpath(NEXT_BUTTON_XPATH)
                    button.click()
                    button.click()
                    button.click()
                    button.click()
                    button.click()
                    button.click()
                    button.click()
                    button.click()
                    element.click()
                    button.click()
                    sleep(5)
                    newhtml = browser.page_source
                    newsoup = BeautifulSoup(newhtml, "html.parser")
                    dataframe = str(newsoup.find("div",{"class":"output_subarea"}))
                    dataframe = dataframe.split(",",1)
                    date = ""
                    datearr = []
                    returnarr = []
                    startyear = []
                    endyear = []
                    for table in dataframe:
                        newstr = table.split("\\n")
                        # if len(date) > 3:
                        #     print("date is defined!, second loop")
                        #     for tr in newstr:
                        #         tablearr = tr.split()
                        #         tablearr.pop(0)
                        #         tablearr.pop(0)
                        #         tablearr.pop(0)
                        #         tablearr.pop(0)
                        #         tablearr.pop(0)
                        #         tablearr.pop(0)
                        #         count = 0
                        #         for item in tablearr:
                        #             count += 1
                        #             if count == 1:
                        #                 tablearr.pop(0)
                        #             if count == 2:
                        #                 tablearr.pop(0)
                        #             if count == 3:
                        #                 datearr.append(tablearr.pop(0))
                        #             if count == 4:
                        #                 returnarr.append(tablearr.pop(0))
                        #             if count == 5:
                        #                 startyear.append(tablearr.pop(0))
                        #             if count == 6:
                        #                 endyear.append(tablearr.pop(0))
                        #                 tablearr.pop(0)
                        #                 count = 0
                        # datearr = []
                        # returnarr = []
                        # startarr = []
                        # endarr = []
                        # bool = 1
                        # newstr.pop(0)
                        tableonestr = str(newstr)[132:]
                        tableone = tableonestr.split('\\n')
                        rtn = []
                        for item in tableone:

                            rtn.append(item.split().pop(0).pop(0).pop(1))
                        return rtn
                            # if bool == 1:
                            #     tablearr = tr.split()
                            #     tablearr.pop(0)
                            #     tablearr.pop(0)
                            #     tablearr.pop(0)
                            #     tablearr.pop(0)
                            #     tablearr.pop(0)
                            #     tablearr.pop(0)
                            #     tablearr.pop(0)
                            #     tablearr.pop(0)                            
                            #     tablearr.pop(0)
                            #     bool == 0
                            # count = 0
                            # for piece in tablearr:
                            #     count += 1
                            #     if count == 1:
                            #         tablearr.pop(0)
                            #     if count == 2:
                            #         tablearr.pop(0)
                            #     if count == 3:
                            #         datearr.append(tablearr.pop(0))
                            #     if count == 4:
                            #         returnarr.append(tablearr.pop(0))
                            #     if count == 5:
                            #         startarr.append(tablearr.pop(0))
                            #     if count == 6:
                            #         endarr.append(tablearr.pop(0))
                            #         tablearr.pop(0)
                                    # count = 1
                        # print(returnarr)
                                # elif date == str(piece)
                                #     else 
                                # elif ""
                                #         #go back to quantopia
                                # if str(piece) in "<div class=\"output_subarea output_text output_result\"><pre>( PortfolioID Snapshot_date Portfolio_return Start_year End_year symbol_final weight Min_weight Max_weight":
                                #     print("na")
                                # else:
                                #     if str(piece).isalpha():
                                #         print(str(piece))
                    save.click()
                    browser.get("https://www.portfoliovisualizer.com/optimize-portfolio")
                    url = "https://www.portfoliovisualizer.com/optimize-portfolio"
                    browser.get(url)
                    sleep(1)
                    browser.execute_script("addAssetRows(10)")
                    browser.execute_script("addAssetRows(10)")
                    browser.execute_script("addAssetRows(10)")
                    browser.execute_script("addAssetRows(10)")
                    return "asdf"
    return "Not found"


def output(return_list):
    """ Write to log file, and print rankings."""

    print "Writing to log file..." 

def scrape(url_list):
    """ Primary scraping function."""

    my_username = "simon.frank@rwth-aachen.de"
    my_password = "AILAB_2016"

    browser = login(my_username, my_password)
    return_list = fetch_returns(browser, url_list)
    # browser.close()
    return return_list
#==================================================================================================

def stain():
    url_list = config.URL_ALGO_LIST
    return(scrape(url_list))

if __name__ == "__stain__":
    stain()
