from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import CustomUser
from .serializers import UserSerializer, RegisterStudentSerializer, LoginSerializer
from django.contrib.auth import login, logout,authenticate

# View to fetch user details
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

# Update user view
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, user_id):
        # Ensure only admins can access this view
        if request.user.role != 'Admin':
            return Response({'error': 'Only admins can edit users.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User updated successfully.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete user view
class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        # Ensure only admins can access this view
        if request.user.role != 'Admin':
            return Response({'error': 'Only admins can delete users.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = CustomUser.objects.get(id=user_id)
            user.delete()
            return Response({'message': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

# User list view
class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ensure only admins can access this view
        if request.user.role != 'Admin':
            return Response({'error': 'Access forbidden for non-admins.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Fetch all users
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

# Register student view
class RegisterStudentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'Admin':
            return Response({'error': 'Only admins can register students.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = RegisterStudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Student registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Student-only page
class StudentPageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'User':
            return Response({'error': 'Access forbidden for non-students.'}, status=status.HTTP_403_FORBIDDEN)

        return Response({'message': 'Welcome to the student page!'})

# Admin dashboard
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'Admin':
            return Response({'error': 'Access forbidden for non-admins.'}, status=status.HTTP_403_FORBIDDEN)

        return Response({'message': 'Welcome to the admin dashboard!'})

# Login and logout views remain unchanged

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=email, password=password)
        if user is not None:
            login(request, user)
            return Response({
                'message': 'Logged in successfully!',
                'role': user.role,
                'email': user.email,
            }, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_403_FORBIDDEN)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'api_session' in request.session:
            del request.session['api_session']
        
        return Response({'message': 'Logged out from API successfully!'})
