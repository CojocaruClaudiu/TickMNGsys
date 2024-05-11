# Generated by Django 5.0.4 on 2024-04-27 15:11

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ticket', '0002_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='ticket',
            options={'verbose_name_plural': 'Tickets'},
        ),
        migrations.AddField(
            model_name='ticket',
            name='category',
            field=models.CharField(choices=[('Bug', 'Bug'), ('Feature Request', 'Feature Request'), ('Customer Support', 'Customer Support'), ('Other', 'Other')], default='Other', max_length=20),
        ),
        migrations.AddField(
            model_name='ticket',
            name='priority',
            field=models.CharField(choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')], default='Low', max_length=6),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='ticket_number',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
    ]