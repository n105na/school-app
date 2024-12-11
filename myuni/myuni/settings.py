"""
Django settings for myuni project.

Generated by 'django-admin startproject' using Django 5.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!


import os
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-qp6)i_250^3gzpcv$^y(ifc&s7y_)gmwu^5rph-$3b*y%=e8*2')


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'


ALLOWED_HOSTS = ['*']
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'student',#the students app 
    'teacher_app',
    'module_app',
    'notes',#notes app 
    'user',#the place reposible for auth ...
    'rest_framework_simplejwt',
    'rest_framework.authtoken',

]

AUTH_USER_MODEL = 'user.CustomUser'
LOGOUT_REDIRECT_URL = '/'  


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    #'DEFAULT_PERMISSION_CLASSES': [
     #   'rest_framework.permissions.IsAuthenticated',
    #],
}
SESSION_COOKIE_NAME = 'app_sessionid'

# Use database-backed sessions (default)
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# Optional: Set the session expiration
SESSION_COOKIE_AGE = 1209600 

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # Token expires after 30 minutes
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),     # Refresh token lasts 7 days
    'ROTATE_REFRESH_TOKENS': True,                  # Generate a new refresh token with each use
    'BLACKLIST_AFTER_ROTATION': True,               # Blacklist old refresh tokens
}



MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
      # Session middleware
    #'myuni.middleware.APISessionMiddleware'
]
CSRF_COOKIE_HTTPONLY = False  # Correct this typo

SESSION_COOKIE_SECURE = True  # Use True in production
  # Change to 'None' only if needed
CSRF_COOKIE_SECURE = True  # Use True in production


CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
   
     
        # Another possible variant


]

CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:5500", 
    "http://localhost:5500",
    "http://0.0.0.0:5500", # Frontend origin
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "OPTIONS",
    "DELETE",
    "PUT"
    # Add other methods if needed
]

ROOT_URLCONF = 'myuni.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myuni.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

import os

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'  # URL to serve static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Directory to collect static files

# Optional: Media files if you're using file uploads
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')



# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


#email stuff 
# Email settings in settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'benainibenaini20@gmail.com'  # Replace with your email
EMAIL_HOST_PASSWORD = 'nkaz qeoh kpoc gbrs'  # Replace with your email password

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
#EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
