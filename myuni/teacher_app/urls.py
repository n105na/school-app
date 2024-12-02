from django.urls import path
from .views import (
    get_teachers,
    get_teacher_by_id,
    create_teacher,
    update_teacher,
    delete_teacher,
    get_universities,
    create_university
)

urlpatterns = [
    path('teachers/', get_teachers, name='get_teachers'),
    path('teachers/<int:numero>/', get_teacher_by_id, name='get_teacher_by_id'),
    path('teachers/create/', create_teacher, name='create_teacher'),
    path('teachers/<int:numero>/update/', update_teacher, name='update_teacher'),
    path('teachers/delete/<int:numero>/', delete_teacher, name='delete_teacher'),
    path('universities/', get_universities, name='get_universities'),      # GET request
    path('universities/create/', create_university, name='create_university'),
    
]
