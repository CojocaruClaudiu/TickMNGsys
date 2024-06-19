from django.urls import path
from . import views
from .views import ticket_status_data, tickets_by_category, tickets_by_priority, tickets_assigned_to_users, \
    tickets_created_by_users, ticket_resolution_times

urlpatterns = [
    path('', views.home, name='home'),  # Home page
    path('dashboard/', views.dashboard, name='dashboard'),  # Dashboard page
    path('api/ticket_data/', views.ticket_data, name='ticket_data'),  # API endpoint for ticket data
    path('api/ticket_status_data/', ticket_status_data, name='ticket_status_data'),
    path('api/tickets_created/', views.tickets_created, name='tickets_created_last_7_days'),
    path('api/tickets_by_category/', tickets_by_category, name='tickets_by_category'),  # API endpoint for tickets by category
    path('api/tickets_by_priority/', tickets_by_priority, name='tickets_by_priority'),  # API endpoint for tickets by priority
    path('api/tickets_assigned_to_users/', tickets_assigned_to_users, name='tickets_assigned_to_users'),
    path('api/tickets_created_by_users/', tickets_created_by_users, name='tickets_created_by_users'),
    path('api/ticket_resolution_times/', ticket_resolution_times, name='ticket_resolution_times'),

]
