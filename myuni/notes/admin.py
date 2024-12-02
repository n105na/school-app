from django.contrib import admin
from .models import Note

class NoteAdmin(admin.ModelAdmin):
    # Specify the fields to be displayed in the list view
    list_display = ('student__numero', 'student', 'student__filiere','module__code_module','module', 'note')
    
    # Optionally, you can add filters and search functionality
    list_filter = ('module',)
    search_fields = ('student__numero', 'module__code_module')

    # If you want to make the fields editable directly from the list view
    list_editable = ('note',)

    # Optionally, you can customize the ordering of the list
    ordering = ('student',)

# Register the custom admin class with the Note model
admin.site.register(Note, NoteAdmin)
