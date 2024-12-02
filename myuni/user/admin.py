from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # Define the fields to display in the admin list view
    list_display = ('id', 'email', 'username', 'role', 'is_staff', 'is_active')

    # Add filtering options in the admin panel
    list_filter = ('role', 'is_staff', 'is_active')

    # Add search functionality for specific fields
    search_fields = ('email', 'username')

    # Customize how fields are grouped in the detail view
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password', 'role')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Fields to display when creating a new user in the admin panel
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role'),
        }),
    )

    # Enable sorting by specific fields
    ordering = ('email',)

# Register the CustomUser model with the customized admin view
admin.site.register(CustomUser, CustomUserAdmin)
