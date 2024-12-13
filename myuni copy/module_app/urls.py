
from django.urls import path
from . import views

urlpatterns = [
    path('modules/', views.list_modules, name='list_modules'),  # GET all modules
    path('modules/create/', views.create_module, name='create_module'),  # POST create a module
    path('modules/<int:pk>/', views.get_module, name='get_module'),  # GET single module by ID
    path('modules/<int:pk>/update/', views.update_module, name='update_module'),  # PUT update module
    path('modules/<int:pk>/delete/', views.delete_module, name='delete_module'),  # DELETE module
]
