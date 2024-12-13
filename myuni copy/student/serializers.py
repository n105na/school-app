from rest_framework import serializers
from .models import Student, Sport, Filiere, Nationalite



class NationaliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationalite
        fields = ['id', 'code_nationalite', 'name']


class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name']

class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = ['id', 'name']

class StudentSerializer(serializers.ModelSerializer):
    sports = serializers.PrimaryKeyRelatedField(many=True, queryset=Sport.objects.all())
    filiere = serializers.PrimaryKeyRelatedField(queryset=Filiere.objects.all())

    class Meta:
        model = Student
        fields = ['numero', 'civilite', 'nom_prenom', 'adresse', 'localite', 'no_postal', 'country', 'student_image', 'platform', 'application', 'sports', 'filiere']
