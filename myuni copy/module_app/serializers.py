from rest_framework import serializers
from .models import Module

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'code_module', 'designation_module', 'coefficient', 'volume_horaire', 'filiere']
