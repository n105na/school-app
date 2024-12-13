from django.contrib import admin
from .models import Teacher, University

class TeacherAdmin(admin.ModelAdmin):
    list_display = (
        'numero',          # Display the teacher's number
        'civilite',       # Display the civility
        'nom_prenom',     # Display the name
        'grade',          # Display the grade
        'specialite', 
        'university__name',
        'email',      # Display the specialty
    )
    
    list_filter = ('grade', 'specialite')
        # Add filters for grade and specialty

# Register your models with the customized admin classes
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(University)
