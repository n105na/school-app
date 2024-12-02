from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom User Model
class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)  # Allow null/blank
    # Use email as the unique identifier for authentication
    email = models.EmailField(unique=True, max_length=255)

    # Define user roles with clear choices
    ROLE_CHOICES = [
        ('Admin', 'Admin'),  # Admins have access to everything
        ('User', 'User'),  # Regular users (students)
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='User')

    # Set email as the unique field for authentication
    USERNAME_FIELD = 'email'  # Use email instead of username for login
    REQUIRED_FIELDS = []  # Keep username as a required field

    def __str__(self):
        return f"{self.email} ({self.role})"

    @property
    def is_admin(self):
        """Check if the user is an admin."""
        return self.role == 'Admin'

    @property
    def is_student(self):
        """Check if the user is a student."""
        return self.role == 'User'
