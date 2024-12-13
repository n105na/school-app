# notes_app/models.py
from django.db import models
from student.models import Student
from module_app.models import Module

class Note(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    note = models.FloatField()
    #user = models.ForeignKey('users.User', on_delete=models.CASCADE)  
    def __str__(self):
        return f"Note for {self.student.nom_prenom} in {self.module.designation_module}: {self.note}"
