
from django.urls import path
from .views import get_sports, get_filieres, create_student,get_student_by_numero, update_student, delete_student, create_sport,create_filieres, create_nationalite,list_nationalites,gender_statistics

urlpatterns = [
    path('sports/', get_sports, name='get_sports'),
    path('sports/create', create_sport, name='create_sport'),
    path('filieres/', get_filieres, name='get_filieres'),
    path('filieres/create', create_filieres, name='create_filieres'),
    path('nationalites/create',create_nationalite, name='create_nationalite'),
    path('nationalites/', list_nationalites, name='list_nationalites'),
    path('student/', create_student, name='create_student'),
    path('students/<int:numero>/', get_student_by_numero, name='get_student_by_numero'),
    path('students/<int:numero>/update/', update_student, name='update_student'),
    path('students/delete/<int:numero>/', delete_student, name='delete_student'),
    path('students/gender-stats/', gender_statistics, name='gender_statistics'),
]

    

