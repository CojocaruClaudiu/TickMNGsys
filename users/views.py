from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .form import RegisterCustomerForm
from .form import ProfileImageForm


def register_customer(request):
    if request.method == 'POST':
        form = RegisterCustomerForm(request.POST)
        if form.is_valid():
            var = form.save(commit=False)
            var.is_customer = True
            var.save()
            messages.info(request, 'Contul tau a fost inregistrat cu succes!')
            return redirect('login')
        else:
            messages.warning(request, 'Form is not valid!')
            return redirect('register-customer')
    else:
        form = RegisterCustomerForm()
        context = {'form': form}
        return render(request, 'users/register_customer.html', context)


def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_active:
            login(request, user)
            messages.info(request, 'Login succesful!')
            return redirect('dashboard')
        else:
            messages.warning(request, 'Username or password incorrect!')
            return redirect('login')
    else:
        return render(request, 'users/login.html')


def logout_user(request):
    logout(request)
    messages.info(request, 'Logout successful!')
    return redirect('login')


def profile(request):
    return render(request, 'users/profile.html')


def settings(request):
    return render(request, 'users/settings.html')

def profile(request):
    if request.method == 'POST':
        form = ProfileImageForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('profile')  # Redirect to a success page or the same profile page
    else:
        form = ProfileImageForm(instance=request.user)
    
    return render(request, 'users/profile.html', {'form': form})