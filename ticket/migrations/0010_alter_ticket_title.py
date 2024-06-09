# Generated by Django 5.0.4 on 2024-06-09 08:32

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ticket', '0009_alter_ticket_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='title',
            field=models.CharField(max_length=100, unique=True, validators=[django.core.validators.MaxLengthValidator(100)]),
        ),
    ]
