# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.auth.models
import django.utils.timezone
from django.conf import settings
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='PortalUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, max_length=30, validators=[django.core.validators.RegexValidator('^[\\w.@+-]+$', 'Enter a valid username. This value may contain only letters, numbers and @/./+/-/_ characters.', 'invalid')], help_text='Required. 30 characters or fewer. Letters, digits and @/./+/-/_ only.', unique=True, verbose_name='username')),
                ('first_name', models.CharField(max_length=30, verbose_name='first name', blank=True)),
                ('last_name', models.CharField(max_length=30, verbose_name='last name', blank=True)),
                ('email', models.EmailField(max_length=254, verbose_name='email address', blank=True)),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('phone', models.CharField(max_length=255, null=True, blank=True)),
                ('address', models.CharField(max_length=255, null=True, blank=True)),
                ('reason', models.CharField(max_length=255, null=True, blank=True)),
                ('resetToken', models.CharField(max_length=255, null=True, blank=True)),
                ('connections', models.CharField(max_length=255, null=True, blank=True)),
                ('picture_url', models.CharField(max_length=255, null=True, blank=True)),
                ('tokenCreateDate', models.DateTimeField(null=True, blank=True)),
                ('confirm_email', models.CharField(max_length=255, null=True, blank=True)),
                ('confirm_phone', models.CharField(max_length=255, null=True, blank=True)),
                ('firmname', models.CharField(max_length=255, null=True, blank=True)),
                ('firmsize', models.CharField(max_length=255, null=True, blank=True)),
                ('assets', models.CharField(max_length=255, null=True, blank=True)),
                ('pin_number', models.IntegerField()),
                ('groups', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Group', blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Permission', blank=True, help_text='Specific permissions for this user.', verbose_name='user permissions')),
            ],
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('investing_amount', models.TextField()),
                ('num_stocks', models.IntegerField()),
                ('expected_risk', models.IntegerField()),
                ('brokerage_account', models.IntegerField()),
                ('retirement_account', models.IntegerField()),
                ('age', models.IntegerField()),
                ('household_salary', models.IntegerField()),
                ('household_income', models.IntegerField()),
                ('ss_income', models.IntegerField()),
                ('name', models.TextField()),
                ('client_name', models.TextField()),
                ('description', models.TextField()),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('ticker', models.TextField()),
                ('buy_date', models.DateField(null=True)),
                ('sell_date', models.DateField(null=True)),
                ('current_price', models.DecimalField(default=0, max_digits=10, decimal_places=2)),
                ('initial_price', models.DecimalField(default=0, max_digits=10, decimal_places=2)),
                ('allocation', models.TextField()),
                ('sentiment', models.TextField()),
                ('company_name', models.TextField()),
                ('sector', models.TextField()),
                ('number_of_shares', models.IntegerField(default=0)),
                ('show', models.ForeignKey(to='portal.Portfolio')),
            ],
        ),
        migrations.CreateModel(
            name='UploadFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('docfile', models.FileField(upload_to=b'documents/%Y/%m/%d')),
            ],
        ),
    ]
