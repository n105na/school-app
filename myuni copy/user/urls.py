from django.urls import path
from .views import (
    RegisterStudentView,
    StudentPageView,
    AdminDashboardView,
    UserListView,
    LoginView,
    LogoutView,
    UpdateUserView,
    DeleteUserView,
    UserDetailView,
)

urlpatterns = [
    path('register-student/', RegisterStudentView.as_view(), name='register-student'),
    path('student-page/', StudentPageView.as_view(), name='student-page'),
    path('admin-dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('list/', UserListView.as_view(), name='user-list'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('<int:user_id>/update/', UpdateUserView.as_view(), name='update-user'),  # Update user
    path('<int:user_id>/delete/', DeleteUserView.as_view(), name='delete-user'),  # Delete user
    path('<int:user_id>/', UserDetailView.as_view(), name='user'),  # Delete user

]



