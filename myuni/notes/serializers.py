# notes_app/serializers.py
from rest_framework import serializers
from student.models import Student, Filiere
from module_app.models import Module
from .models import Note


class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = ['id', 'name']  # Include both id and name of filiere

class StudentSerializer(serializers.ModelSerializer):
    filiere = FiliereSerializer()  # Nest FiliereSerializer here

    class Meta:
        model = Student
        fields = ['numero', 'civilite', 'nom_prenom', 'filiere']

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['code_module', 'designation_module', 'coefficient']

class NoteSerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    module = ModuleSerializer()

    class Meta:
        model = Note
        fields = ['student', 'module', 'note']


class NoteUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['note']  # Only allow updating the note


class ModuleNoteSerializer(serializers.ModelSerializer):
    code_module = serializers.CharField(source='module.code_module')
    name = serializers.CharField(source='module.designation_module')
    note = serializers.DecimalField(source='note', max_digits=5, decimal_places=2)  # Corrected to reference `note`

    class Meta:
        model = Note
        fields = ['code_module', 'name', 'note']

# notes_app/serializers.py
class StudentDetailSerializer(serializers.Serializer):
    numero = serializers.CharField(source='student.numero')
    nom_prenom = serializers.CharField(source='student.nom_prenom')
    filiere = serializers.CharField(source='student.filiere')
    image = serializers.ImageField(source='student.image')
    modules = ModuleNoteSerializer(source='note', many=True)  # Will iterate over notes

    class Meta:
        fields = ['numero', 'nom_prenom', 'filiere', 'image', 'modules']
from rest_framework import serializers
from .models import Note
from student.models import Student

class BulletinNoteSerializer(serializers.ModelSerializer):
    module_name = serializers.CharField(source='module.designation_module')
    module_code = serializers.CharField(source='module.code_module')
    module_coefficient = serializers.IntegerField(source='module.coefficient')

    class Meta:
        model = Note
        fields = ['note', 'module_name', 'module_code', 'module_coefficient']

class BulletinSerializer(serializers.ModelSerializer):
    notes = BulletinNoteSerializer(source='note_set', many=True)  # Assuming related_name="note_set"

    class Meta:
        model = Student
        fields = ['nom_prenom', 'email', 'notes']
