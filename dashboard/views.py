from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from ticket.models import Ticket


def home(request):
    return render(request, 'dashboard/home.html')


def dashboard(request):
    return render(request, 'dashboard/dashboard.html')


def ticket_data(request):
    tickets = Ticket.objects.extra(select={'date': 'DATE(date_created)'}).values('date').annotate(
        count=Count('id')).order_by('date')
    data = {
        "dates": [ticket['date'] for ticket in tickets],
        "counts": [ticket['count'] for ticket in tickets],
    }
    return JsonResponse(data)


def ticket_status_data(request):
    active_count = Ticket.objects.filter(ticket_status='Active').count()
    pending_count = Ticket.objects.filter(ticket_status='Pending').count()
    completed_count = Ticket.objects.filter(ticket_status='Completed').count()

    data = {
        'active': active_count,
        'pending': pending_count,
        'completed': completed_count,
    }
    return JsonResponse(data)


def tickets_created(request):
    interval = request.GET.get('interval', '7_days')  # Default to '7_days' if not provided
    today = timezone.now().date()

    if interval == '3_days':
        last_days = [today - timedelta(days=i) for i in range(3)]
    elif interval == '7_days':
        last_days = [today - timedelta(days=i) for i in range(7)]
    elif interval == '1_month':
        last_days = [today - timedelta(days=i) for i in range(30)]
    elif interval == '6_months':
        last_days = [today - timedelta(days=i) for i in range(180)]
    elif interval == '1_year':
        last_days = [today - timedelta(days=i) for i in range(365)]
    else:
        return JsonResponse({'error': 'Invalid interval'}, status=400)

    ticket_data = []

    for day in last_days:
        count = Ticket.objects.filter(date_created__date=day).count()
        ticket_data.append({
            'date': day.strftime('%Y-%m-%d'),
            'tickets': count
        })

    return JsonResponse(ticket_data, safe=False)


def tickets_by_category(request):
    categories = [
        ('Bug', 'Bug'),
        ('Feature Request', 'Cerere Funcționalitate'),
        ('Customer Support', 'Suport Client'),
        ('Sales', 'Vânzări'),
        ('Feedback', 'Feedback'),
        ('Other', 'Altele'),
    ]

    data = []
    for code, label in categories:
        count = Ticket.objects.filter(category=code).count()
        data.append({
            'category': label,
            'count': count,
        })

    return JsonResponse(data, safe=False)


def tickets_by_priority(request):
    priority_choices = [
        ('Very Low', 'Foarte Scăzut'),
        ('Low', 'Scăzut'),
        ('Medium', 'Mediu'),
        ('High', 'Ridicat'),
        ('Very High', 'Foarte Ridicat'),
    ]

    data = []
    for code, label in priority_choices:
        count = Ticket.objects.filter(priority=code).count()
        data.append({
            'priority': label,
            'count': count,
        })

    return JsonResponse(data, safe=False)