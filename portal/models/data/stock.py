from django.db import models

from portal.models.base import BaseModel
from portal.models.data.portfolio import Portfolio

class Stock(BaseModel):  
    ticker = models.TextField()
    company_name = models.TextField()
    show = models.ForeignKey(Portfolio)
    buy_date = models.DateField(null=True)
    sell_date = models.DateField(null=True)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    initial_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    allocation = models.TextField()
    sentiment = models.TextField()
    company_name = models.TextField()
    number_of_shares = models.IntegerField(default=0)

    class Meta:
        app_label = 'portal'

# mysql -u root -p fsai -e "CREATE TABLE portal_stock (id int(11) NOT NULL AUTO_INCREMENT,created_date datetime ,update_date datetime ,ticker longtext NOT NULL,show_id int(2) UNSIGNED NOT NULL,buy_date date DEFAULT NULL,current_price decimal(10,2) NOT NULL,initial_price decimal(10,2) NOT NULL,number_of_shares int(11) NOT NULL,sell_date date DEFAULT NULL,company_name varchar(50) NOT NULL,allocation decimal(11,11) NOT NULL,PRIMARY KEY (id), FOREIGN KEY (show_id) REFERENCES portal_portfolio (id)) ENGINE=InnoDB AUTO_INCREMENT=2704 DEFAULT CHARSET=latin1"

# mysql -u root -p fsai -e "ALTER TABLE portal_portfolio MODIFY investing_amount varchar(255) not null"
# # Enter password:
# mysql -u root -p fsai -e "ALTER TABLE portal_portfolio MODIFY num_stocks  varchar(255) not null"
# # Enter password:
# mysql -u root -p fsai -e "ALTER TABLE portal_stock MODIFY number_of_shares  varchar(255) not null"
# git clone