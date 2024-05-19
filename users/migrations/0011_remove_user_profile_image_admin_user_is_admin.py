# Generated by Django 5.0.4 on 2024-05-18 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_user_profile_image_admin'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='profile_image_admin',
        ),
        migrations.AddField(
            model_name='user',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
    ]