from django.db import models

from portal.models.base import BaseModel

class Portfolio(BaseModel):
    investing_amount = models.TextField()
    num_stocks = models.IntegerField()
    expected_risk = models.IntegerField()
    brokerage_account = models.IntegerField()
    retirement_account = models.IntegerField()
    age = models.IntegerField()
    household_salary = models.IntegerField()
    household_income = models.IntegerField()
    ss_income = models.IntegerField()
    name = models.TextField()
    client_name = models.TextField()
    description = models.TextField()
    user = models.ForeignKey('portal.PortalUser')
    phone_number = models.TextField()

    # timeframe = models.TextField()
    # control_market = models.CharField(max_length=1,
        # choices=(('S', 'S&P 500'), ('N', 'Nasdaq'), ('D', 'Dow Jones'), ('Y', 'NYSE')), default='S', null=True, blank=True)

    # investment = models.FloatField()


    #def __init__(self):
        #super(self)

    '''
    def __init__(self, name=name, description=description, risk=risk, timeframe=timeframe, control_market=control_market,
                 inv destment=investment, user=user):
        super(Portfolio, self).__init__(name=name, description=description, risk=risk, timeframe=timeframe, control_market=control_market,
                 investment=investment, user=user)
        self.name = name
        self.description = description
        self.risk = risk
        self.timeframe = timeframe
        self.control_market = control_market
        self.investment = investment
        self.user = user
    '''

    class Meta:
        app_label = 'portal'


# mysql -u root -p fsai -e "drop table portal_portfolio"



#  mysql -u root -p fsai -e "CREATE TABLE portal_portfolio (id INT(2) UNSIGNED AUTO_INCREMENT, investing_amount INT(22) NOT NULL , num_stocks int(22) NOT NULL , expected_risk int(22) NOT NULL , brokerage_account int(22) NOT NULL , retirement_account int(22) NOT NULL , age int(3) NOT NULL , household_salary int(11) NOT NULL , household_income int(22) NOT NULL , ss_income INT(22) NOT NULL , name VARCHAR(100) NOT NULL, created_date datetime(6), update_date datetime(6), client_name VARCHAR(100) NOT NULL, description VARCHAR(255) NOT NULL, PRIMARY KEY (id), user_id int not null, FOREIGN KEY fk_cat(user_id) REFERENCES portal_portaluser(id) ON UPDATE CASCADE ON DELETE RESTRICT)"
