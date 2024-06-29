import datetime

from django.db.models import Q
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Ticket
from .form import CreateTicketForm, UpdateTicketForm
from users.models import User
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.decorators import login_required


# vizualizarea detaliilor unui tichet


@login_required
def ticket_details(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    t = ticket.created_by
    tickets_per_user = t.tickets_created.all()
    context = {'ticket': ticket, 'tickets_per_user': tickets_per_user}
    return render(request, 'ticket/ticket_details.html', context)


# crearea unui tichet
@login_required
def create_ticket(request):
    if request.method == 'POST':
        form = CreateTicketForm(request.POST)
        if form.is_valid():
            var = form.save(commit=False)
            var.created_by = request.user
            var.ticket_status = 'Pending'
            var.save()
            messages.info(request,
                          "Tichetul dumneavoastră a fost trimis cu succes. Un inginer va fi asignat în curând!")
            return redirect('dashboard')
        else:
            messages.warning(request, 'Ceva nu a mers bine. Vă rugăm să încercați din nou!')
            return redirect('create-ticket')
    else:
        form = CreateTicketForm()
        context = {'form': form}
        return render(request, 'ticket/create_ticket.html', context)


# actualizarea unui tichet
@login_required
def update_ticket(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    if not ticket.is_resolved:
        if request.method == 'POST':
            form = UpdateTicketForm(request.POST, instance=ticket)
            if form.is_valid():
                form.save()
                messages.info(request,
                              "Modificările la tichetul dumneavoastră au fost actualizate cu succes. Modificările au "
                              "fost salvate!")
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


# vizualizarea tuturor tichetelor create
@login_required
def all_tickets(request):
    # Get filter parameters from the request
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('search', '')
    date_filter = request.GET.get('date', '')
    assigned_to_filter = request.GET.get('assigned_to', '')
    priority_filter = request.GET.get('priority', '')
    category_filter = request.GET.get('category', '')

    # Determine the base queryset based on the user's role
    if request.user.is_superuser or request.user.is_engineer:  # Admin users and engineers see all tickets
        base_queryset = Ticket.objects.all()
    else:  # Non-admin, non-engineer users see only their tickets
        base_queryset = Ticket.objects.filter(created_by=request.user)

    # Apply filters to the queryset
    if status_filter and status_filter != 'all':
        base_queryset = base_queryset.filter(ticket_status=status_filter)
    if date_filter:
        base_queryset = base_queryset.filter(date_created__date=date_filter)
    if assigned_to_filter:
        base_queryset = base_queryset.filter(assigned_to__username__icontains=assigned_to_filter)
    if priority_filter:
        base_queryset = base_queryset.filter(priority=priority_filter)
    if category_filter:
        base_queryset = base_queryset.filter(category=category_filter)
    if search_query:
        base_queryset = base_queryset.filter(Q(title__icontains=search_query) | Q(id__icontains=search_query))

    # Calculate the counts for each ticket type
    total_tickets = base_queryset.count()
    pending_tickets = base_queryset.filter(ticket_status='Pending').count()
    open_tickets = base_queryset.filter(ticket_status='Active').count()
    closed_tickets = base_queryset.filter(ticket_status='Completed').count()

    # Setup pagination
    paginator = Paginator(base_queryset, 8)  # Show 8 tickets per page
    page = request.GET.get('page')
    try:
        tickets = paginator.page(page)
    except PageNotAnInteger:
        tickets = paginator.page(1)
    except EmptyPage:
        tickets = paginator.page(paginator.num_pages)

    context = {
        'tickets': tickets,
        'total_tickets': total_tickets,
        'pending_tickets': pending_tickets,
        'open_tickets': open_tickets,
        'closed_tickets': closed_tickets,
        'page': page,
        'status_filter': status_filter,
        'search_query': search_query,  # Add search query to context
        'date_filter': date_filter,
        'assigned_to_filter': assigned_to_filter,
        'priority_filter': priority_filter,
        'category_filter': category_filter,
    }

    return render(request, 'ticket/all_tickets.html', context)


# Pentru ingineri
@login_required
def ticket_queue(request):
    # Get filtering parameters
    date = request.GET.get('date')
    created_by = request.GET.get('created_by')
    priority = request.GET.get('priority')
    category = request.GET.get('category')
    status = request.GET.get('status')
    search_query = request.GET.get('search', '')

    # Filter tickets to only include pending ones and apply additional filters
    tickets = Ticket.objects.filter(ticket_status='Pending')

    if date:
        tickets = tickets.filter(date_created=date)
    if created_by:
        tickets = tickets.filter(created_by__username__icontains=created_by)
    if priority:
        tickets = tickets.filter(priority=priority)
    if category:
        tickets = tickets.filter(category=category)
    if status:
        tickets = tickets.filter(ticket_status=status)
    if search_query:
        tickets = tickets.filter(Q(title__icontains=search_query) | Q(id__icontains=search_query))

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

    # Check if the user is a superuser or an admin
    is_admin = request.user.is_superuser or request.user.is_admin

    context = {
        'tickets': tickets,
        'pending_tickets': pending_tickets_count,
        'page': page,
        'engineers': engineers,  # Add engineers to context
        'is_admin': is_admin,  # Add admin status to context
    }
    return render(request, 'ticket/ticket_queue.html', context)


@login_required
def assign_ticket(request, pk):
    if request.method == 'POST':
        ticket = Ticket.objects.get(pk=pk)
        engineer_id = request.POST.get('engineer_id')
        if engineer_id:
            engineer = User.objects.get(pk=engineer_id)
            ticket.assigned_to = engineer
            ticket.ticket_status = 'Active'
            ticket.accepted_date = datetime.datetime.now()
            ticket.save()
            messages.info(request, f"Tichetul a fost asignat cu succes inginerului {engineer.username}.")
        else:
            messages.warning(request, "Nu a fost selectat niciun inginer.")
        return redirect('ticket-queue')
    else:
        messages.warning(request, "Cererea nu este validă.")
        return redirect('ticket-queue')


@login_required
def accept_ticket(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    ticket.assigned_to = request.user
    ticket.ticket_status = 'Active'
    ticket.accepted_date = datetime.datetime.now()
    ticket.save()
    messages.info(request, "Tichetul dumneavoastră a fost acceptat cu succes.")
    return redirect('workspace')


@login_required
def close_ticket(request, pk):
    ticket = Ticket.objects.get(pk=pk)
    ticket.ticket_status = 'Completed'
    ticket.is_resolved = True
    ticket.closed_date = datetime.datetime.now()
    ticket.save()
    messages.info(request, "Tichetul dumneavoastră a fost rezolvat cu succes.")
    return redirect('ticket-queue')


# tichetul la care lucrează inginerul
@login_required
def workspace(request):
    # Get filtering parameters
    date = request.GET.get('date')
    assigned_to = request.GET.get('assigned_to')
    priority = request.GET.get('priority')
    category = request.GET.get('category')
    search_query = request.GET.get('search', '')

    # Filter tickets based on user role and additional filters
    if request.user.is_superuser or request.user.is_admin:
        tickets = Ticket.objects.filter(is_resolved=False, ticket_status='Active')
    elif request.user.is_engineer:
        tickets = Ticket.objects.filter(is_resolved=False, ticket_status='Active', assigned_to=request.user)
    else:
        tickets = Ticket.objects.none()

    if date:
        tickets = tickets.filter(date_created=date)
    if assigned_to:
        tickets = tickets.filter(assigned_to__username__icontains=assigned_to)
    if priority:
        tickets = tickets.filter(priority=priority)
    if category:
        tickets = tickets.filter(category=category)
    if search_query:
        tickets = tickets.filter(Q(title__icontains=search_query) | Q(id__icontains=search_query))

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
        'search_query': search_query,  # Add search query to context
    }
    return render(request, 'ticket/workspace.html', context)


# toate tichetelor închise/rezolvate
@login_required
def all_closed_tickets(request):
    # Get filtering parameters
    closed_date = request.GET.get('closed_date')
    assigned_to = request.GET.get('assigned_to')
    priority = request.GET.get('priority')
    category = request.GET.get('category')
    search_query = request.GET.get('search', '')

    # Filter tickets to only include closed ones and apply additional filters
    tickets = Ticket.objects.filter(is_resolved=True)

    if closed_date:
        tickets = tickets.filter(closed_date=closed_date)
    if assigned_to:
        tickets = tickets.filter(assigned_to__username__icontains=assigned_to)
    if priority:
        tickets = tickets.filter(priority=priority)
    if category:
        tickets = tickets.filter(category=category)
    if search_query:
        tickets = tickets.filter(Q(title__icontains=search_query) | Q(id__icontains=search_query))

    tickets = tickets.order_by('closed_date')
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
    messages.info(request, "Tichetul dumneavoastră a fost șters cu succes.")
    return redirect('all-tickets')
