from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Teacher, University
from .serializers import TeacherSerializer, UniversitySerializer
from django.http import JsonResponse


@api_view(['GET'])
def get_universities(request):
    universities = University.objects.all().values('id', 'name')  # Fetching universities with ID and name
    return JsonResponse(list(universities), safe=False)

@api_view(['POST'])
def create_university(request):
    serializer = UniversitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Save the university data
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_teachers(request):
    teachers = Teacher.objects.all().values('numero', 'nom_prenom', 'civilite')  # Fetching teachers with id, name, and civility
    return JsonResponse(list(teachers), safe=False)



@api_view(['POST'])
def create_teacher(request):
    serializer = TeacherSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Save the teacher data
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_teacher_by_id(request, numero):
    try:
        teacher = Teacher.objects.get(numero=numero)
        serializer = TeacherSerializer(teacher)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Teacher.DoesNotExist:
        return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_teacher(request, numero):
    try:
        teacher = Teacher.objects.get(numero=numero)
    except Teacher.DoesNotExist:
        return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = TeacherSerializer(teacher, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_teacher(request, numero):
    try:
        teacher = Teacher.objects.get(numero=numero)
        teacher.delete()  # This will delete the teacher record
        return Response({'message': 'Teacher deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Teacher.DoesNotExist:
        return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)
