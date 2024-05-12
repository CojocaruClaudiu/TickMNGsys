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