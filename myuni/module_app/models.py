# In module_app/models.py
from django.db import models
from student.models import Filiere  # Import Filiere model

class Module(models.Model):
    code_module = models.CharField(max_length=50)
    designation_module = models.CharField(max_length=100)
    coefficient = models.FloatField()
    volume_horaire = models.IntegerField()
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE)  # Foreign key to Filiere
    
    def __str__(self):
        return self.designation_module
