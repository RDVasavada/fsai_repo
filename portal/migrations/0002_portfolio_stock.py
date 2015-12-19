# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('name', models.TextField()),
                ('description', models.TextField()),
                ('risk', models.IntegerField()),
                ('timeframe', models.TextField()),
                ('control_market', models.CharField(default=b'S', max_length=1, null=True, blank=True, choices=[(b'S', b'S&P 500'), (b'N', b'Nasdaq'), (b'D', b'Dow Jones')])),
                ('investment', models.FloatField()),
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
                ('show', models.ForeignKey(to='portal.Portfolio')),
            ],
        ),
    ]
