from django.db import models
from users.models import User
from django.urls import reverse
from django.core.validators import MaxLengthValidator
from django.utils.text import slugify
from django.core.exceptions import ValidationError
import uuid

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

    STATUS_CHOICES = (
        ('Active', 'Activ'),
        ('Completed', 'Completat'),
        ('Pending', 'În așteptare'),
    )

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, validators=[MaxLengthValidator(100)], unique=True)
    description = models.TextField()
    priority = models.CharField(max_length=9, choices=PRIORITY_CHOICES, default='Low')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='Other')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets_created', editable=False)
    date_created = models.DateTimeField(auto_now_add=True)
    assigned_to = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='tickets_assigned')
    is_resolved = models.BooleanField(default=False)
    accepted_date = models.DateTimeField(null=True, blank=True)
    closed_date = models.DateTimeField(null=True, blank=True)
    ticket_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.get_priority_display()})"

    def get_absolute_url(self):
        return reverse('ticket-detail', kwargs={'pk': self.pk})


    def change_status(self, new_status):
        if new_status not in dict(self.STATUS_CHOICES):
            raise ValidationError('Invalid status')
        self.ticket_status = new_status
        self.save()

    class Meta:
        verbose_name = "Ticket"
        verbose_name_plural = "Tickets"
        ordering = ['-date_created']
        unique_together = ('title', 'created_by')
        indexes = [
            models.Index(fields=['priority']),
            models.Index(fields=['category']),
            models.Index(fields=['ticket_status']),
            models.Index(fields=['date_created']),
            models.Index(fields=['updated_at']),
        ]
