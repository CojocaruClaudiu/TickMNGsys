from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from .form import RegisterCustomerForm, RegisterEngineerForm, RegisterAdminForm, ProfileImageForm, \
    CustomPasswordChangeForm


def register_customer(request):
    if request.method == 'POST':
        form = RegisterCustomerForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_customer = True
            user.save()
            messages.info(request, 'Contul tau a fost inregistrat cu succes!')
            return redirect('login')
        else:
            messages.warning(request, 'Formularul nu este valid!')
            return redirect('register-customer')
    else:
        form = RegisterCustomerForm()
    return render(request, 'users/register_customer.html', {'form': form})


def register_engineer(request):
    if request.method == 'POST':
        form = RegisterEngineerForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_engineer = True
            user.save()
            messages.info(request, 'Contul de inginer a fost înregistrat cu succes!')
            return redirect('login')
        else:
            messages.warning(request, 'Formularul nu este valid!')
            return redirect('register-engineer')
    else:
        form = RegisterEngineerForm()
    return render(request, 'users/register_engineer.html', {'form': form})


def register_admin(request):
    if request.method == 'POST':
        form = RegisterAdminForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_admin = True
            user.save()
            messages.info(request, 'Contul de administrator a fost înregistrat cu succes!')
            return redirect('login')
        else:
            messages.warning(request, 'Formularul nu este valid!')
            return redirect('register-admin')
    else:
        form = RegisterAdminForm()
    return render(request, 'users/register_admin.html', {'form': form})


def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember_me = request.POST.get('remember_me')  # Get the remember me value

        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_active:
            login(request, user)

            if remember_me:
                request.session.set_expiry(1209600)  # 2 weeks
            else:
                request.session.set_expiry(0)  # Browser session

            messages.info(request, 'Autentificare reușită!')
            return redirect('dashboard')
        else:
            messages.warning(request, 'Nume de utilizator sau parolă incorectă!')
            return redirect('login')
    else:
        return render(request, 'users/login.html')


def logout_user(request):
    logout(request)
    messages.info(request, 'Deconectare reușită!')
    return redirect('login')


def profile(request):
    if request.method == 'POST':
        form = ProfileImageForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = ProfileImageForm(instance=request.user)
    return render(request, 'users/profile.html', {'form': form})


def settings(request):
    return render(request, 'users/settings.html')


def change_password(request):
    if request.method == 'POST':
        form = CustomPasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Parola a fost schimbată cu succes!')
            return redirect('profile')
        else:
            messages.warning(request, 'Formularul nu este valid!')
            return redirect('change_password')
    else:
        form = CustomPasswordChangeForm(request.user)
    return render(request, 'users/change_password.html', {'form': form})


def forgot_password(request):
    return render(request, 'users/forgot_password.html')
