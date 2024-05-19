from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User


class RegisterCustomerForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['email', 'username']


class RegisterEngineerForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['email', 'username']


class RegisterAdminForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['email', 'username']


class ProfileImageForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['profile_image']

        widgets = {
            'profile_image': forms.FileInput(attrs={'class': 'form-control'}),
        }
