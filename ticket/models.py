import uuid
from django.db import models
from users.models import User
from django.urls import reverse


class Ticket(models.Model):
    PRIORITY_CHOICES = (
        ('Very Low', 'Foarte Scăzut'),
        ('Low', 'Scăzut'),
        ('Medium', 'Mediu'),
        ('High', 'Ridicat'),
        ('Very High', 'Foarte Ridicat'),
    )

    CATEGORY_CHOICES = (
        ('Bug', 'Bug'),
        ('Feature Request', 'Cerere Funcționalitate'),
        ('Customer Support', 'Suport Client'),
        ('Sales', 'Vânzări'),
        ('Feedback', 'Feedback'),
        ('Other', 'Altele'),
    )
    
    status_choices = (
        ('Active', 'Activ'),
        ('Completed', 'Completat'),
        ('Pending', 'În așteptare'),
    )

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    priority = models.CharField(max_length=9, choices=PRIORITY_CHOICES, default='Low')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='Other')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_by', editable=False)
    date_created = models.DateTimeField(auto_now_add=True)
    assigned_to = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='assigned_to')
    is_resolved = models.BooleanField(default=False)
    accepted_date = models.DateTimeField(null=True, blank=True)
    closed_date = models.DateTimeField(null=True, blank=True)
    ticket_status = models.CharField(max_length=20, choices=status_choices)

    def __str__(self):
        return f"{self.title} ({self.get_priority_display()})"

    def get_absolute_url(self):
        return reverse('ticket-detail', kwargs={'pk': self.pk})

    class Meta:
        verbose_name_plural = "Tickets"
