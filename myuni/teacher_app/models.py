from django.db import models



class University(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Teacher(models.Model):
    # Auto-increment 'Numero' for each teacher
    numero = models.AutoField(primary_key=True)

    # Civilité choices
    CIVILITE_CHOICES = [
        ('Monsieur', 'Monsieur'),
        ('Madame', 'Madame'),
        ('Mademoiselle', 'Mademoiselle'),
    ]
    civilite = models.CharField(max_length=25, choices=CIVILITE_CHOICES)

    # Name fields
    nom_prenom = models.CharField(max_length=255)

    # Address fields
    adresse = models.TextField()
    lieu_naissance = models.CharField(max_length=100)
    date_naissance = models.DateField()
    pays = models.CharField(max_length=100)

    # Grade choices
    GRADE_CHOICES = [
        ('Assistant', 'Assistant'),
        ('MAB', 'MAB'),
        ('MAA', 'MAA'),
        ('MCB', 'MCB'),
        ('MCA', 'MCA'),
        ('Professeur', 'Professeur'),
    ]
    grade = models.CharField(max_length=50, choices=GRADE_CHOICES)

    # Specialty field
    SPECIALITE_CHOICES = [
        ('Informatique', 'Informatique'),
        ('Mathématiques', 'Mathématiques'),
        ('Anglais', 'Anglais'),
        ('Autres', 'Autres'),
    ]
    specialite = models.CharField(max_length=50, choices=SPECIALITE_CHOICES)
    university = models.ManyToManyField(University)
     
    #adding the email field
    email = models.EmailField(unique=True,null= False)
    def __str__(self):
        return f"{self.nom_prenom} - {self.numero}"
