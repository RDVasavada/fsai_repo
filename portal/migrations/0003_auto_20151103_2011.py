# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0002_portfolio_stock'),
    ]

    operations = [
        migrations.AddField(
            model_name='portaluser',
            name='address',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='portaluser',
            name='phone',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='portaluser',
            name='reason',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='portaluser',
            name='password_repeat',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
