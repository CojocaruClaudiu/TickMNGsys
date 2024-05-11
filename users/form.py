from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class RegisterCustomerForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['email', 'username']

class ProfileImageForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['profile_image']  # Ensure this includes any image fields you need

        widgets = {
            'profile_image': forms.FileInput(attrs={'class': 'form-control'}),
        }