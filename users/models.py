from django.db import models
from django.contrib.auth.models import AbstractUser
from PIL import Image

class User(AbstractUser):
    is_customer = models.BooleanField(default=False)
    is_engineer = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='profile_images/', default='profile_images/default.png')
    profile_image_admin = models.ImageField(upload_to='profile_images/', default='profile_images/default_admin.png')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Open the uploaded image
        img = Image.open(self.profile_image.path)

        # Resize the image
        if img.height > 34 or img.width > 34:
            output_size = (34, 34)
            img.thumbnail(output_size)
            img.save(self.profile_image.path)  # Save the resized image back to the same path

        # You can add similar resizing logic for profile_image_admin if necessary

    def __str__(self):
        return self.username
