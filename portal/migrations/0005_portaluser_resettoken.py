# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0004_remove_portaluser_password_repeat'),
    ]

    operations = [
        migrations.AddField(
            model_name='portaluser',
            name='resetToken',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
