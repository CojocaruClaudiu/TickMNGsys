from django.urls import path
from . import views

urlpatterns = [
    path('register-customer/', views.register_customer, name='register-customer'),
    path('register-engineer/', views.register_engineer, name='register-engineer'),
    path('register-admin/', views.register_admin, name='register-admin'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('settings/', views.settings, name='settings'),
]