# Generated by Django 5.0.4 on 2024-05-09 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(default='Default_pfp.svg.png', upload_to='profile_images/'),
        ),
    ]