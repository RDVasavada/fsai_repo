import os
import re
import django

# where django lives
DJANGO_ROOT = os.path.dirname(os.path.realpath(django.__file__))
# where the site/app lives
SITE_ROOT = os.path.dirname(os.path.realpath(__file__))
# where our python modules live
IMPORT_ROOT = SITE_ROOT.replace('/DjangoApp/root', '')
# where the project lives
PROJECT_ROOT = SITE_ROOT.replace('/root', '')

STATIC_ROOT = IMPORT_ROOT + '/portal/static/'
# The root folder
FOLDER_ROOT = SITE_ROOT.rsplit('/', 1)[0]
# Folder where our static html resources are
RESOURCE_PATH = FOLDER_ROOT + '/portal/templates/resources'
# Template folder path
TEMPLATE_PATH = FOLDER_ROOT + '/portal/templates'

# import our app's python modules
import sys
# sys.path.append(IMPORT_ROOT)

DEBUG = True
TEMPLATE_DEBUG = DEBUG
THUMBNAIL_DEBUG = True

ADMINS = (
    ('', ''),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        #Postgres
        #'ENGINE': 'django.db.backends.postgresql_psycopg2',

        #Mysql
        'ENGINE': 'django.db.backends.mysql',

        'NAME': 'fsai',
        # The following settings are not used with sqlite3:
        'USER': 'root',
        'PASSWORD': '',
        'PORT': '',
        'OPTIONS'  : {
        #'init_command' : 'SET storage_engine=MyISAM',
         },
    }
}

ALLOWED_HOSTS = ['localhost']

TIME_ZONE = 'US/Mountain'

LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# set to false unitl naive datetime upload figured out
USE_TZ = False

MEDIA_ROOT = os.path.join(SITE_ROOT, "media")

MEDIA_URL = '/media/'

LOGIN_REDIRECT_URL = '/dashboard/'
LOGIN_URL = '/login/'

STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    RESOURCE_PATH,
)

AUTH_USER_MODEL = 'portal.PortalUser'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
 #   'django.contrib.staticfiles.finders.DefaultStorageFinder',

)

SECRET_KEY = ']W3?93?4((3)41{D!#^62o9~#=#&{;'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.request',
    'django.contrib.messages.context_processors.messages'
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # uncomment to disable all csrf verification (testing)
    # 'portal.disable-csrf.DisableCSRF',
)

ROOT_URLCONF = 'root.urls'

WSGI_APPLICATION = 'root.wsgi.application'

TEMPLATE_DIRS = (
    TEMPLATE_PATH,
    RESOURCE_PATH,
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django_extensions',
    'portal',
)


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'console':{
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': True,
        },
        # Might as well log any errors anywhere else in Django
        'django': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        # Your own app - this assumes all your logger names start with "myapp."
        'myapp': {
            'handlers': ['console'],
            'level': 'WARNING', # Or maybe INFO or DEBUG
            'propagate': False
        },
    }
}

GRAPH_MODELS = {
  'all_applications': True,
  'group_models': True,
}

DEFAULT_FROM_EMAIL = "fsairecovery@gmail.com"
SERVER_EMAIL = DEFAULT_FROM_EMAIL

# Uncomment and populate with proper connection parameters
# for enable email sending. EMAIL_HOST_USER should end by @domain.tld
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_USE_TLS = True
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USERNAME = "fsairecovery"
EMAIL_HOST_USER = "fsairecovery@gmail.com"
EMAIL_HOST_PASSWORD = "7MCGH772bn8h"
EMAIL_PORT = 587

##############################################
# 2.5MB - 2621440
# 5MB - 5242880
# 10MB - 10485760
# 20MB - 20971520
# 50MB - 5242880
# 100MB 104857600
# 250MB - 214958080
# 500MB - 429916160
FILE_UPLOAD_MAX_MEMORY_SIZE = "429916160"

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
   'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}
