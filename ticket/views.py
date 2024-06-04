import datetime
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Ticket
from .form import CreateTicketForm, UpdateTicketForm
from users.models import User
from django.db.models import Count
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
from django.contrib.auth.decorators import login_required



# vizualizarea detaliilor unui bilet


@login_required
def ticket_details(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    t = ticket.created_by
    tickets_per_user = t.tickets_created.all()
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
    # Get the status filter from the request
    status_filter = request.GET.get('status', 'all')

    # Determine the base queryset based on the user's role
    if request.user.is_superuser:  # Admin users see all tickets
        base_queryset = Ticket.objects.all()
    else:  # Non-admin users see only their tickets
        base_queryset = Ticket.objects.filter(created_by=request.user)

    # Calculate the counts for each ticket type
    total_tickets = base_queryset.count()
    pending_tickets = base_queryset.filter(ticket_status='Pending').count()
    open_tickets = base_queryset.filter(ticket_status='Active').count()
    closed_tickets = base_queryset.filter(ticket_status='Completed').count()

    # Apply status filter to the base queryset
    if status_filter != 'all':
        tickets_list = base_queryset.filter(ticket_status=status_filter.capitalize())
    else:
        tickets_list = base_queryset

    # Setup pagination
    paginator = Paginator(tickets_list, 8)  # Show 8 tickets per page
    page = request.GET.get('page')
    try:
        tickets = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        tickets = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        tickets = paginator.page(paginator.num_pages)

    context = {
        'tickets': tickets,
        'total_tickets': total_tickets,
        'pending_tickets': pending_tickets,
        'open_tickets': open_tickets,
        'closed_tickets': closed_tickets,
        'page': page,
        'status_filter': status_filter,
    }
    return render(request, 'ticket/all_tickets.html', context)


# Pentru ingineri
@login_required
def ticket_queue(request):
    # Filter tickets to only include pending ones
    tickets = Ticket.objects.filter(ticket_status='Pending')
    pending_tickets_count = tickets.count()
    
    engineers = User.objects.filter(is_engineer=True)  # Fetch all users who are engineers

    paginator = Paginator(tickets, 8)  # Show 8 tickets per page
    page = request.GET.get('page')
    try:
        tickets = paginator.page(page)
    except PageNotAnInteger:
        tickets = paginator.page(1)
    except EmptyPage:
        tickets = paginator.page(paginator.num_pages)

    context = {
        'tickets': tickets,
        'pending_tickets': pending_tickets_count,
        'page': page,
        'engineers': engineers,  # Add engineers to context
    }
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
    tickets = Ticket.objects.filter(is_resolved=False, ticket_status='Active').order_by('date_created')
    open_tickets = tickets.count()

    paginator = Paginator(tickets, 8)  # Show 8 tickets per page
    page = request.GET.get('page')
    try:
        tickets = paginator.page(page)
    except PageNotAnInteger:
        tickets = paginator.page(1)
    except EmptyPage:
        tickets = paginator.page(paginator.num_pages)
    context = {
        'tickets': tickets,
        'open_tickets': open_tickets,
        'page': page,
    }
    return render(request, 'ticket/workspace.html', context)


# toate biletelor închise/rezolvate
def all_closed_tickets(request):
    tickets = Ticket.objects.filter(is_resolved=True).order_by('closed_date')
    closed_tickets = tickets.count()

    paginator = Paginator(tickets, 8)  # Show 8 tickets per page
    page = request.GET.get('page')
    try:
        tickets = paginator.page(page)
    except PageNotAnInteger:
        tickets = paginator.page(1)
    except EmptyPage:
        tickets = paginator.page(paginator.num_pages)

    context = {
        'tickets': tickets,
        'closed_tickets': closed_tickets,
        'page': page,
    }
    return render(request, 'ticket/all_closed_tickets.html', context)


@login_required
def delete_ticket(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    ticket.delete()
    messages.info(request, "Biletul dumneavoastră a fost șters cu succes.")
    return redirect('all-tickets')




