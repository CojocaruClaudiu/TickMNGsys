from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_customer = models.BooleanField(default=False)
    is_engineer = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)  # New field for admin users
    profile_image = models.ImageField(upload_to='profile_images/', default='profile_images/default.png')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
