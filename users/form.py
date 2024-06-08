from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import PasswordChangeForm
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


class CustomPasswordChangeForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['old_password'].widget.attrs.update({'class': 'form-control'})
        self.fields['new_password1'].widget.attrs.update({'class': 'form-control'})
        self.fields['new_password2'].widget.attrs.update({'class': 'form-control'})

        self.fields['old_password'].label = 'Parola Veche'
        self.fields['new_password1'].label = 'Parola Nouă'
        self.fields['new_password2'].label = 'Confirmă Parola Nouă'

                # Update help texts and error messages to Romanian
        self.fields['new_password1'].help_text = (
            "• Parola nu poate fi prea similară cu alte informații personale.<br>"
            "• Parola trebuie să conțină cel puțin 8 caractere.<br>"
            "• Parola nu poate fi o parolă utilizată frecvent.<br>"
            "• Parola nu poate fi formată doar din cifre."
        )

        self.error_messages['password_mismatch'] = ("Parolele nu se potrivesc.")