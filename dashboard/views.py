from django.db.models import Count
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from ticket.models import Ticket


@login_required(login_url='login')
def dashboard(request):
    tickets = Ticket.objects.filter(created_by=request.user)
    total_tickets = Ticket.objects.count()
    pending_tickets = Ticket.objects.filter(ticket_status='Pending').count()
    open_tickets = Ticket.objects.filter(ticket_status='Active').count()
    closed_tickets = Ticket.objects.filter(ticket_status='Completed').count()

    context = {
        'tickets': tickets,
        'total_tickets': total_tickets,
        'pending_tickets': pending_tickets,
        'open_tickets': open_tickets,
        'closed_tickets': closed_tickets,
    }


    return render(request, 'dashboard/dashboard.html', context)


def dashboard_view(request):
    context = {
        'labels': ['Open', 'Closed', 'In Progress'],
        'data': [10, 5, 7],
        'followers': 2545,
        'views': 15480,
        'earned': 2545,
        'sales': 16500,
        'income': 25260,
        'expense': 12260,
        'current_year': 98260,
        'yearly_breakup': 36358,
        'total_sales': [1000, 2000, 3000, 4000],
        'revenue_updates': {'footware': 5, 'fashionware': 3}
    }
    return render(request, 'dashboard/dashboard.html', context)