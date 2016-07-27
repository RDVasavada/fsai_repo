from portal import views
from django.conf.urls import patterns, url, include
from django.conf import settings
from django.conf.urls import patterns, url

urlpatterns = patterns('',

    #User Authentication based views
    (r'^/?$', views.main),
    (r'^login/?$', views.loginview),
    (r'^logout/?$', views.logoutview),
    (r'^register/?$', views.register),
    (r'^recover_password/?$', views.recover_password),
    (r'^new_password/(?P<token>w+)/?$', views.new_password),
    (r'^email_sent/?$', views.email_sent),


    #General User Pages
    (r'^user/dashboard/?$', views.dashboard),
    (r'^user/portfolio/?$', views.portfolio),
    (r'^user/portfolio_settings/?$', views.portfolio_settings),
    (r'^user/portfolio_optimize/?$', views.portfolio_optimize),
    (r'^user/my_portfolios/?$', views.my_portfolios),
    (r'^user/Individual_portfolio/?$', views.Individual_portfolio),
    (r'^user/news_portal/?$', views.news_portal),
<<<<<<< HEAD
=======
    
>>>>>>> 7fe12ebeefab88a96bbb047be6b2b9923d8b1b9e


)

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
