from django.db import models # type: ignore




class Sport(models.Model):
   
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class Filiere(models.Model):
   
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    


class Nationalite(models.Model):
    code_nationalite = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Student(models.Model):
    # Auto-increment 'Numero' after a successful creation
    numero = models.AutoField(primary_key=True)  # This will act as the student's unique ID and auto-increment

    # Civilité choices
    CIVILITE_CHOICES = [
        ('Monsieur', 'Monsieur'),
        ('Madame', 'Madame'),
        ('Mademoiselle', 'Mademoiselle'),
    ]
    civilite = models.CharField(max_length=25, choices=CIVILITE_CHOICES)

    # Nom/Prénom (full name)
    nom_prenom = models.CharField(max_length=255)

    # Adresse, Localité, and No Postal fields
    adresse = models.TextField()
    localite = models.CharField(max_length=100)
    no_postal = models.CharField(max_length=20)

    # Pays (Country)
    country = models.CharField(max_length=100)

    # Image of the student
    student_image = models.ImageField(upload_to='student_images/', blank=True, null=True)

    
    PLATFORM_CHOICES = [
        ('windows', 'Windows'),
        ('macintoch', 'Macintosh'),
        ('unix', 'Unix'),
    ]
    platform = models.CharField(max_length=255, choices=PLATFORM_CHOICES)

    # Applications (allow multiple choices)
    APPLICATION_CHOICES = [
        ('Bureautique', 'Bureautique'),
        ('Daw', 'Daw'),
        ('Poo', 'Poo'),
        ('SGBD', 'SGBD'),
        ('Internet', 'Internet'),
        ('System', 'System'),
    ]
    
    application = models.CharField(max_length=255, choices=APPLICATION_CHOICES)

    sports = models.ManyToManyField(Sport)
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE, null=True)
    #one to one relationship with the user model
    #user = models.OneToOneField(User,null=True,blank=True, on_delete=models.CASCADE)

    
    def __str__(self):
        return f"{self.nom_prenom} - {self.numero}"
    



    
