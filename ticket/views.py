import datetime
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Ticket
from .form import CreateTicketForm, UpdateTicketForm
from users.models import User
from django.db.models import Count
from django.contrib.auth.decorators import login_required

# vizualizarea detaliilor unui bilet


@login_required
def ticket_details(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    t = User.objects.get(pk=ticket.created_by.id)
    tickets_per_user = t.created_by.all()
    context = {'ticket': ticket, 'tickets_per_user': tickets_per_user}
    return render(request, 'ticket/ticket_details.html', context)


# crearea unui bilet
@login_required
def create_ticket(request):
    if request.method == 'POST':
        form = CreateTicketForm(request.POST)
        if form.is_valid():
            var = form.save(commit=False)
            var.created_by = request.user
            var.ticket_status = 'Pending'
            var.save()
            messages.info(request, "Biletul dumneavoastră a fost trimis cu succes. Un inginer va fi asignat în curând!")
            return redirect('dashboard')
        else:
            messages.warning(request, 'Ceva nu a mers bine. Vă rugăm să încercați din nou!')
            return redirect('create-ticket')
    else:
        form = CreateTicketForm()
        context = {'form': form}
        return render(request, 'ticket/create_ticket.html', context)


# actualizarea unui bilet
@login_required
def update_ticket(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    if not ticket.is_resolved:
        if request.method == 'POST':
            form = UpdateTicketForm(request.POST, instance=ticket)
            if form.is_valid():
                form.save()
                messages.info(request, "Modificările la biletul dumneavoastră au fost actualizate cu succes. Modificările au fost salvate!")
                return redirect('dashboard')
            else:
                messages.warning(request, 'Ceva nu a mers bine. Vă rugăm să încercați din nou!')
                return redirect('create-ticket')
        else:
            form = UpdateTicketForm(instance=ticket)
            context = {'form': form}
            return render(request, 'ticket/update_ticket.html', context)
    else:
        return messages.warning(request, 'Nu puteți face modificări!')


# vizualizarea tuturor biletelor create
@login_required
def all_tickets(request):
    if request.user.is_superuser:  # Admin users see all tickets
        tickets = Ticket.objects.all()
    else:  # Non-admin users see only their tickets
        tickets = Ticket.objects.filter(created_by=request.user)

    total_tickets = tickets.count()
    pending_tickets = tickets.filter(ticket_status='Pending').count()
    open_tickets = tickets.filter(ticket_status='Active').count()
    closed_tickets = tickets.filter(ticket_status='Completed').count()

    context = {
        'tickets': tickets,
        'total_tickets': total_tickets,
        'pending_tickets': pending_tickets,
        'open_tickets': open_tickets,
        'closed_tickets': closed_tickets
    }
    return render(request, 'ticket/all_tickets.html', context)

# Pentru ingineri
@login_required
def ticket_queue(request):
    tickets = Ticket.objects.filter(ticket_status='Pending')
    context = {'tickets': tickets}
    return render(request, 'ticket/ticket_queue.html', context)


@login_required
def accept_ticket(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    ticket.assigned_to = request.user
    ticket.ticket_status = 'Active'
    ticket.accepted_date = datetime. datetime.now()
    ticket.save()
    messages.info(request, "Biletul dumneavoastră a fost acceptat cu succes.")
    return redirect('workspace')


@login_required
def close_ticket(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    ticket.ticket_status = 'Completed'
    ticket.is_resolved = True
    ticket.closed_date = datetime. datetime.now()
    ticket.save()
    messages.info(request, "Biletul dumneavoastră a fost rezolvat cu succes.")
    return redirect('ticket-queue')


# biletul la care lucrează inginerul
@login_required
def workspace(request):
    tickets = Ticket.objects.filter(assigned_to=request.user, is_resolved=False)
    context = {'tickets': tickets}
    return render(request, 'ticket/workspace.html', context)


# toate biletelor închise/rezolvate
@login_required
def all_closed_tickets(request):
    tickets = Ticket.objects.filter(assigned_to=request.user, is_resolved=True)
    context = {'tickets': tickets}
    return render(request, 'ticket/all_closed_tickets.html', context)


@login_required
def delete_ticket(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    ticket.delete()
    messages.info(request, "Biletul dumneavoastră a fost șters cu succes.")
    return redirect('all-tickets')

# dashboard


@login_required
def dashboard(request):
    if request.user.is_superuser:  # Check if user is an admin
        tickets_query = Ticket.objects.all()
    else:
        tickets_query = Ticket.objects.filter(created_by=request.user)

    total_tickets = tickets_query.count()
    pending_tickets = tickets_query.filter(ticket_status='Pending').count()
    open_tickets = tickets_query.filter(ticket_status='Active').count()
    closed_tickets = tickets_query.filter(ticket_status='Completed').count()

    # Prepare chart data for ticket statuses
    ticket_status_counts = tickets_query.values('ticket_status').annotate(total=Count('id')).order_by('ticket_status')
    labels = [status['ticket_status'] for status in ticket_status_counts]
    data = [status['total'] for status in ticket_status_counts]

    context = {
        'total_tickets': total_tickets,
        'pending_tickets': pending_tickets,
        'open_tickets': open_tickets,
        'closed_tickets': closed_tickets,
        'labels': labels,
        'data': data,
    }

    return render(request, 'dashboard/dashboard.html', context)