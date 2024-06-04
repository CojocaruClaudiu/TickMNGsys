from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # Home page
    path('dashboard/', views.dashboard, name='dashboard'),  # Dashboard page
]