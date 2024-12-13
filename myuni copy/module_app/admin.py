from django.contrib import admin
from .models import Module

class ModuleAdmin(admin.ModelAdmin):
    # Specify the fields to be displayed in the list view
    list_display = ('id', 'code_module','designation_module', 'coefficient', 'filiere')  # Add any other relevant fields

    # Optionally, you can add filters and search functionality
    list_filter = ('filiere',)  # Filter by 'filiere' if it's a field in your Module model
    search_fields = ('code_module', 'filiere__name')  # Adjust if you have a related name for filiere

    # Optionally, you can customize the ordering of the list
    ordering = ('code_module',)

# Register the custom admin class with the Module model
admin.site.register(Module, ModuleAdmin)
