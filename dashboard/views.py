from django.core.paginator import Paginator
from django.db.models.functions import TruncMonth
from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta, datetime

from django.views.decorators.http import require_GET

from dashboard import models
from ticket.models import Ticket
from users.models import User


def home(request):
    return render(request, 'dashboard/home.html')


def dashboard(request):
    return render(request, 'dashboard/dashboard.html')


def ticket_data(request):
    # Query for total, pending, and active tickets by created date
    tickets_by_creation_date = Ticket.objects.extra(select={'date': 'DATE(date_created)'}).values('date').annotate(
        total_count=Count('id'),
        active_count=Count('id', filter=Q(ticket_status='Active'))
    ).order_by('date')

    # Query for completed tickets by closed date
    tickets_by_closed_date = Ticket.objects.extra(select={'closed_date': 'DATE(closed_date)'}).values(
        'closed_date').annotate(
        completed_count=Count('id', filter=Q(ticket_status='Completed'))
    ).order_by('closed_date')

    # Preparing data
    data = {
        "dates": [ticket['date'] for ticket in tickets_by_creation_date],
        "total_counts": [ticket['total_count'] for ticket in tickets_by_creation_date],
        "active_counts": [ticket['active_count'] for ticket in tickets_by_creation_date],
    }

    # Adding completed counts by matching dates
    completed_counts_dict = {ticket['closed_date']: ticket['completed_count'] for ticket in tickets_by_closed_date}
    data["completed_counts"] = [completed_counts_dict.get(date, 0) for date in data["dates"]]

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
    end_date = datetime.now().date()

    if interval == '7_days':
        start_date = end_date - timedelta(days=6)  # Including today
    elif interval == '1_month':
        start_date = end_date - timedelta(days=29)  # Including today
    elif interval == '3_month':
        start_date = end_date - timedelta(days=89)  # Including today
    elif interval == '6_months':
        start_date = end_date - timedelta(days=182)  # Including today
    elif interval == '1_year':
        start_date = end_date - timedelta(days=364)  # Including today
    else:
        return JsonResponse({'error': 'Invalid interval'}, status=400)

    # Fetch tickets within the date range and group them by date
    tickets = Ticket.objects.filter(date_created__date__range=[start_date, end_date]) \
        .extra({'date': "date(date_created)"}) \
        .values('date') \
        .annotate(tickets=Count('id')) \
        .order_by('date')

    # Create a dictionary for all dates in the range, initializing with zero tickets
    date_dict = {start_date + timedelta(days=i): 0 for i in range((end_date - start_date).days + 1)}

    # Update the dictionary with the actual ticket counts
    for ticket in tickets:
        # Convert ticket['date'] to a date object
        ticket_date = datetime.strptime(ticket['date'], '%Y-%m-%d').date()
        date_dict[ticket_date] = ticket['tickets']

    # Prepare the response data
    response_data = [{'date': date.strftime('%Y-%m-%d'), 'tickets': count} for date, count in date_dict.items()]

    return JsonResponse(response_data, safe=False)


def tickets_by_category(request):
    categories = [
        ('Bug', 'Bug'),
        ('Feature Request', 'Cer. Funcț.'),
        ('Customer Support', 'Sup.Clienți'),
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
        ('Very Low', 'F. Scăzut'),
        ('Low', 'Scăzut'),
        ('Medium', 'Medie'),
        ('High', 'Ridicat'),
        ('Very High', 'F. Ridicat'),
    ]

    data = []
    for code, label in priority_choices:
        count = Ticket.objects.filter(priority=code).count()
        data.append({
            'priority': label,
            'count': count,
        })

    return JsonResponse(data, safe=False)


def tickets_assigned_to_users(request):
    users = User.objects.all()
    data = []

    for user in users:
        ticket_count = Ticket.objects.filter(assigned_to=user).count()
        data.append({
            'user': user.username,
            'tickets': ticket_count
        })

    return JsonResponse(data, safe=False)


def tickets_created_by_users(request):
    users = User.objects.all()
    data = []

    for user in users:
        ticket_count = Ticket.objects.filter(created_by=user).count()
        data.append({
            'user': user.username,
            'tickets': ticket_count
        })

    return JsonResponse(data, safe=False)


def ticket_resolution_times(request):
    tickets = Ticket.objects.filter(closed_date__isnull=False)
    data = []

    for ticket in tickets:
        resolution_time = (ticket.closed_date - ticket.date_created).total_seconds() / 3600  # Resolution time in hours
        data.append({
            'title': ticket.title,
            'resolution_time': resolution_time
        })

    return JsonResponse(data, safe=False)


def ticket_summary(request, metric):
    if metric == 'totalTickets':
        count = Ticket.objects.count()
    elif metric == 'resolvedTickets':
        count = Ticket.objects.filter(is_resolved=True).count()
    elif metric == 'pendingTickets':
        count = Ticket.objects.filter(ticket_status='Pending').count()
    elif metric == 'activeTickets':
        count = Ticket.objects.filter(ticket_status='Active').count()
    else:
        return JsonResponse({'error': 'Invalid metric'}, status=400)

    return JsonResponse(count, safe=False)


def tickets_calendar_data(request):
    today = timezone.now().date()
    start_date = today - timezone.timedelta(days=365)  # Last 1 year
    tickets = Ticket.objects.filter(date_created__date__gte=start_date)

    data = {}
    for ticket in tickets:
        date_str = ticket.date_created.strftime('%Y-%m-%d')
        if date_str in data:
            data[date_str] += 1
        else:
            data[date_str] = 1

    return JsonResponse(data)


def user_stats(request):
    customers_count = User.objects.filter(is_customer=True).count()
    engineers_count = User.objects.filter(is_engineer=True).count()
    admins_count = User.objects.filter(is_admin=True).count()

    data = {
        'customers': customers_count,
        'engineers': engineers_count,
        'admins': admins_count,
    }

    return JsonResponse(data, safe=False)


@require_GET
def user_stats_trends(request):
    days = int(request.GET.get('days', 30))  # Default to last 30 days if not provided

    # Get the current date
    today = timezone.now().date()

    # Get data for the specified number of days
    data = []
    for i in range(days):
        date = today - timezone.timedelta(days=i)

        customers_count = User.objects.filter(is_customer=True, date_joined__date=date).count()
        engineers_count = User.objects.filter(is_engineer=True, date_joined__date=date).count()
        admins_count = User.objects.filter(is_admin=True, date_joined__date=date).count()

        data.append({
            'date': date.strftime('%Y-%m-%d'),  # Ensure the date is in YYYY-MM-DD format
            'customers': customers_count,
            'engineers': engineers_count,
            'admins': admins_count,
        })

    # Ensure the data is sorted by date
    data.sort(key=lambda x: x['date'])

    return JsonResponse(data, safe=False)


def ticket_table_data(request):
    tickets = Ticket.objects.all().order_by('-date_created')
    paginator = Paginator(tickets, 3)  # Show 3 tickets per page

    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    tickets_list = list(page_obj.object_list.values(
        'id', 'title', 'description', 'priority', 'category',
        'created_by__username', 'date_created', 'assigned_to__username',
        'is_resolved', 'accepted_date', 'closed_date', 'ticket_status', 'updated_at'
    ))

    response = {
        'tickets': tickets_list,
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number
    }

    return JsonResponse(response)


@require_GET
def tickets_progress(request):
    total_tickets = Ticket.objects.exclude(ticket_status='Completed').count()
    completed_tickets = Ticket.objects.filter(ticket_status='Completed').count()
    active_tickets = Ticket.objects.filter(ticket_status='Active').count()
    pending_tickets = Ticket.objects.filter(ticket_status='Pending').count()

    if total_tickets + completed_tickets > 0:
        completed_percentage = (completed_tickets / (total_tickets + completed_tickets)) * 100
        pending_percentage = (pending_tickets / (total_tickets + completed_tickets)) * 100
        active_percentage = (active_tickets / (total_tickets + completed_tickets)) * 100
    else:
        completed_percentage = 0
        pending_percentage = 0
        active_percentage = 0

    data = {
        'total_tickets': total_tickets + completed_tickets,
        'completed_tickets': completed_tickets,
        'completed_percentage': completed_percentage,
        'pending_percentage': pending_percentage,
        'active_percentage': active_percentage
    }

    return JsonResponse(data)
