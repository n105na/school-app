from rest_framework import serializers
from .models import Teacher, University

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name']

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['numero', 'civilite', 'nom_prenom', 'adresse', 'lieu_naissance', 'date_naissance', 'pays', 'grade', 'specialite', 'email']
        