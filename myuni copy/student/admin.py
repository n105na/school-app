from django.contrib import admin
from .models import Student,Sport, Filiere,Nationalite

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('numero', 'nom_prenom', 'civilite','filiere__name','sports__name')  # Customize this to show fields you want in the admin panel


admin.site.register(Sport)

# Register the Filiere model
admin.site.register(Filiere)

@admin.register(Nationalite)
class NationaliteAdmin(admin.ModelAdmin):
    list_display = ('id', 'code_nationalite', 'name')  # Columns to display in the admin list view
    search_fields = ('code_nationalite', 'name')