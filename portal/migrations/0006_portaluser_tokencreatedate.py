# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0005_portaluser_resettoken'),
    ]

    operations = [
        migrations.AddField(
            model_name='portaluser',
            name='tokenCreateDate',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
