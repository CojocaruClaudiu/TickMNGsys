from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        *UserAdmin.fieldsets,
        (
            'Custom Field Heading',
            {
                'fields': (
                    'is_customer',
                    'is_engineer',
                    'is_admin',  # Add the is_admin field here
                ),
            },
        ),
    )

    list_display = ('username', 'email', 'is_admin', 'is_customer', 'is_engineer', 'is_staff', 'is_active')
    list_filter = ('is_admin', 'is_customer', 'is_engineer', 'is_staff', 'is_active')


admin.site.register(User, CustomUserAdmin)
