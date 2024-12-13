from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Student, Sport, Filiere, Nationalite
from .serializers import StudentSerializer, SportSerializer,FiliereSerializer,NationaliteSerializer
from django.http import JsonResponse


from django.db.models import Count


@api_view(['GET'])
def gender_statistics(request):
    # Query for male and female students based on 'civilite'
    male_count = Student.objects.filter(civilite='Monsieur').count()
    female_count = Student.objects.filter(civilite__in=['Madame', 'Mademoiselle']).count()

    # Return the data as JSON
    data = {
        'male': male_count,
        'female': female_count
    }
    return JsonResponse(data)

@api_view(['POST'])
def create_nationalite(request):
    serializer = NationaliteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to list all nationalités
@api_view(['GET'])
def list_nationalites(request):
    nationalites = Nationalite.objects.all()
    serializer = NationaliteSerializer(nationalites, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_sport(request):
    serializer = SportSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def get_sports(request):
    sports = Sport.objects.all().values('id', 'name')  # Fetching sports with id and name
    return JsonResponse(list(sports), safe=False)
@api_view(['POST'])
def create_filieres(request):
    serializer = FiliereSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def get_filieres(request):
    filieres = Filiere.objects.all().values('id', 'name')  # Fetching filieres with id and name
    return JsonResponse(list(filieres), safe=False)

@api_view(['POST'])
def create_student(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Numero will auto-increment on save
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_student_by_numero(request, numero):
    try:
        student = Student.objects.get(numero=numero)
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_student(request, numero):
    try:
        student = Student.objects.get(numero=numero)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = StudentSerializer(student, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_student(request, numero):
    try:
        student = Student.objects.get(numero=numero)
        student.delete()  # This will delete the student record
        return Response({'message': 'Student deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
