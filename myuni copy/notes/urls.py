# notes_app/urls.py
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('student/<int:numero>/', views.student_details, name='student_details'),
    path('create/', views.create_note, name='create_note'),
    path('modify/<int:numero>/<str:code_module>/', views.modify_note, name='modify_note'), #this too
    path('student/<int:numero>/<str:code_module>/', views.note_view, name='note-view'),#this is working
    #path('student/<int:numero>/details/', views.student_detail_api, name='student_detail_api'),
    #path('student/<int:numero>/module_notes/', views.student_details_with_modules, name='student_details_with_modules'),##this is not working for some reason 
    path('delete/<int:numero>/<str:code_module>/', views.delete_note_view, name='delete_note'),
    path('student/list/', views.list_notes_view, name='list_notes'),
    path('student/bull/<int:numero>/', views.get_student_bulletin, name='student_bulletin'), 
    path('moyenne-generale/', views.get_moyenne_generale_stats, name='get_moyenne_generale_stats'),
    path('send_bulletin/<str:numero>/', views.send_student_bulletin, name='send_student_bulletin'),
    path('send-email/', views.send_admis_nonadmis_chart, name='send-email'),
    path('send-emails/', views.send_emails_to_teachers, name='send_emails_to_teachers'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)