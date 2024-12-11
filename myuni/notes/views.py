# notes_app/views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Note
from .serializers import (
    StudentSerializer, ModuleSerializer, 
    NoteSerializer, NoteUpdateSerializer,
    BulletinSerializer,
)
from student.models import Student
from module_app.models import Module
from collections import defaultdict
from django.db.models import Avg, Min, Max, Sum
from django.core.mail import send_mail
from django.conf import settings
from .serializers import BulletinSerializer
from rest_framework.decorators import api_view
from django.core.mail import EmailMessage
from notes.models import Note

@api_view(['POST'])
def send_student_bulletin(request, numero):
    """
    Send the student bulletin with a table in the email body.
    """
    try:
        # Get the student and their notes
        student = Student.objects.get(numero=numero)
        notes = Note.objects.filter(student=student).select_related('module')

        # Generate the table rows for notes
        table_rows = ""
        for note in notes:
            table_rows += f"""
            <tr>
                <td>{note.module.code_module}</td>
                <td>{note.module.designation_module}</td>
                <td>{note.module.coefficient}</td>
                <td>{note.note}</td>
            </tr>
            """

        # HTML content for the email
        email_content = f"""
        <html>
        <body>
            <h2>Student Bulletin</h2>
            <p><strong>Student Name:</strong> {student.nom_prenom}</p>
            <p><strong>Filiere:</strong> {student.filiere.name}</p>
            <p><strong>Student Number:</strong> {student.numero}</p>
            
            <h3>Notes:</h3>
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>Module Code</th>
                        <th>Module Name</th>
                        <th>Coefficient</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {table_rows}
                </tbody>
            </table>
        </body>
        </html>
        """

        # Send the email
        email = EmailMessage(
            subject="Student Bulletin",
            body=email_content,
            from_email="benainibenaini20@gmail.com",  # Replace with your email
            to=["benaini2021@gmail.com"],  # Replace with the recipient's email
        )
        email.content_subtype = "html"  # Set the content type to HTML
        email.send()

        return Response({"message": "Bulletin sent successfully!"}, status=200)

    except Student.DoesNotExist:
        return Response({"error": "Student not found."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])

def get_student_bulletin(request, numero):
    try:
        student = Student.objects.get(numero=numero)
        

        notes = Note.objects.filter(student=student).select_related('module')

        student_data = {
            'nom_prenom': student.nom_prenom,
            'civilite' : student.civilite,
            'filiere': student.filiere.name,
            'student_image': student.student_image.url if student.student_image else None,  # Return the image URL
            'notes': [{
                'module': {
                    'designation_module': note.module.designation_module,
                    'code_module': note.module.code_module,
                    'coefficient': note.module.coefficient,
                },
                'note': note.note,
                'student': {
                    'numero': student.numero,
                    'nom_prenom':student.nom_prenom,
                    'filiere': {
                        'name': student.filiere.name
                    }
                }
            } for note in notes]
        }
        return Response(student_data)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)
    


import base64
from django.core.mail import EmailMessage
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def send_admis_nonadmis_chart(request):
    try:
        admis_count = request.data.get('admis_count')
        non_admis_count = request.data.get('non_admis_count')
        recipient_email = request.data.get('email', 'benaini2021@gmail.com')

        # Create HTML content for the email
        html_content = f"""
        <html>
            <body>
                <h3>Admis and Non Admis Statistics</h3>
                <p>Here is the chart representation:</p>
                <img src="cid:chart_image" alt="Chart Image" />
                <p>Admis: {admis_count}, Non Admis: {non_admis_count}</p>
            </body>
        </html>
        """

        # Generate a base64-encoded image of the chart
        chart_data = request.data.get('chart_image_base64')  # Base64 image from the frontend
        image_data = base64.b64decode(chart_data.split(',')[1])  # Decode the base64 string

        # Email configuration
        email = EmailMessage(
            subject="Admis and Non Admis Chart",
            body=html_content,
            from_email="benainibenaini20@example.com",
            to=[recipient_email],
        )
        email.content_subtype = "html"  # Set to HTML content

        # Attach the chart image
        email.attach("chart.png", image_data, "image/png")
        email.send()

        return Response({"message": "Email sent successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_moyenne_generale_stats(request):
    """
    Retrieve and return the list of students' moyenne générale, which is used to calculate
    the number of admis and non admis students.
    """
    students = Student.objects.all()  # Get all unique students
    
    student_moyennes = []
    
    for student in students:
        # Get all notes for the current student
        student_notes = Note.objects.filter(student=student)
        
        # Calculate weighted moyenne générale for the student
        total_weighted_notes = 0
        total_coefficients = 0
        
        for student_note in student_notes:
            total_weighted_notes += student_note.note * student_note.module.coefficient
            total_coefficients += student_note.module.coefficient
        
        moyenne_generale = total_weighted_notes / total_coefficients if total_coefficients else None
        
        # Store the student's moyenne générale
        student_moyennes.append({
            "num_etudiant": student.numero,
            "nom_prenom": student.nom_prenom,
            "moyenne_generale": moyenne_generale
        })
    
    return Response(student_moyennes)

  


from teacher_app.models import Teacher

from django.core.mail import send_mail
from django.http import JsonResponse
from django.db.models import Sum
from collections import defaultdict

from rest_framework.decorators import api_view



@api_view(['POST'])
def send_emails_to_teachers(request):
    """
    Sends an email to all teachers in the database with PV data included.
    """
    try:
        # Fetch all teachers with email addresses
        teachers = Teacher.objects.all()
        email_addresses = [teacher.email for teacher in teachers if teacher.email]

        # Retrieve PV data
        notes = Note.objects.select_related('student', 'module', 'student__filiere').all()

        filiere_data = defaultdict(list)
        for note in notes:
            student_notes = Note.objects.filter(student=note.student)
            total_weighted_notes = 0
            total_coefficients = 0
            for student_note in student_notes:
                total_weighted_notes += student_note.note * student_note.module.coefficient
                total_coefficients += student_note.module.coefficient
            moyenne_generale = total_weighted_notes / total_coefficients if total_coefficients else None
            note_info = {
                "num_etudiant": note.student.numero,
                "nom_prenom": note.student.nom_prenom,
                "moyenne_generale": moyenne_generale
            }
            filiere_name = note.student.filiere.name if note.student.filiere else "N/A"
            filiere_data[filiere_name].append(note_info)

        result = []
        for filiere, notes in filiere_data.items():
            moyennes = [note["moyenne_generale"] for note in notes if note["moyenne_generale"] is not None]
            filiere_stats = {
                "filiere": filiere,
                "notes": notes,
                "moyenne_generale": sum(moyennes) / len(moyennes) if moyennes else None,
                "moyenne_min": min(moyennes) if moyennes else None,
                "moyenne_max": max(moyennes) if moyennes else None
            }
            result.append(filiere_stats)

        # Format PV data into the email content as an HTML table
        pv_message = "<h3>Performance View (PV)</h3>"
        
        for filiere_stats in result:
            # Add filière information
            pv_message += f"<h4>Filière: {filiere_stats['filiere']}</h4>"
            pv_message += f"<p>Moyenne Générale: {filiere_stats['moyenne_generale']:.2f} (Min: {filiere_stats['moyenne_min']:.2f}, Max: {filiere_stats['moyenne_max']:.2f})</p>"
            
            # Create a table for students
            pv_message += "<table border='1' style='border-collapse: collapse; width: 100%;'>"
            pv_message += "<thead><tr><th>Num Étudiant</th><th>Nom Étudiant</th><th>Moyenne Générale</th></tr></thead><tbody>"
            
            # Create a set to store unique students
            student_map = {note["num_etudiant"]: note for note in filiere_stats['notes']}

            for student in student_map.values():
                pv_message += "<tr>"
                pv_message += f"<td>{student['num_etudiant']}</td>"
                pv_message += f"<td>{student['nom_prenom']}</td>"
                pv_message += f"<td>{student['moyenne_generale']:.2f}</td>"
                pv_message += "</tr>"

            pv_message += "</tbody></table>"

        # Email content
        subject = "Performance Bulletin"
        message = f"Dear Teacher,<br><br>Here is the latest performance bulletin.<br><br>{pv_message}<br><br>Best Regards,<br>School Administration"
        sender_email = "Amina Benaini"  # Replace with your email

        # Send the email with HTML content
        send_mail(subject, message, sender_email, email_addresses, fail_silently=False, html_message=message)

        return JsonResponse({"message": "Emails sent successfully to all teachers."}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['GET'])
def list_notes_view(request):
    """
    Retrieve and return the list of notes grouped by filière.
    This combined view includes student and module details and can be used
    for both 'afficher list' and 'PV' (Performance View).
    """
    notes = Note.objects.select_related('student', 'module', 'student__filiere').all()

    # Dictionary to group notes by filière
    filiere_data = defaultdict(list)

    for note in notes:
        # Calculate moyenne générale per student considering coefficients
        student_notes = Note.objects.filter(student=note.student)
        
        # Weighted moyenne calculation based on coefficient
        total_weighted_notes = 0
        total_coefficients = 0
        
        for student_note in student_notes:
            total_weighted_notes += student_note.note * student_note.module.coefficient
            total_coefficients += student_note.module.coefficient
        
        moyenne_generale = total_weighted_notes / total_coefficients if total_coefficients else None
        
        # Detailed structure of each student's note
        note_info = {
            "num_etudiant": note.student.numero,
            "nom_prenom": note.student.nom_prenom,
            "nom_module": note.module.designation_module,   # Module name
            "code_module": note.module.code_module,         # Module code
            "coefficient": note.module.coefficient,         # Module coefficient
            "note": note.note,                              # Student's note
            "moyenne_generale": moyenne_generale            # Student's average
        }

        # Group by filière name
        filiere_name = note.student.filiere.name if note.student.filiere else "N/A"
        filiere_data[filiere_name].append(note_info)

    # Calculating overall moyenne, min, and max for each filière
    result = []
    for filiere, notes in filiere_data.items():
        # Calculate average, minimum, and maximum moyennes for each filière
        moyennes = [note["moyenne_generale"] for note in notes if note["moyenne_generale"] is not None]
        
        filiere_stats = {
            "filiere": filiere,
            "notes": notes,  # List of notes with student and module details for 'afficher list'
            "moyenne_generale": sum(moyennes) / len(moyennes) if moyennes else None,
            "moyenne_min": min(moyennes) if moyennes else None,
            "moyenne_max": max(moyennes) if moyennes else None
        }
        result.append(filiere_stats)

    return Response(result, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_note_view(request, numero, code_module):
    """
    Deletes a note if it exists for a given student number and module code.
    If it doesn't exist, returns an error message.
    """
    try:
        # Retrieve the student and module based on provided identifiers
        student = Student.objects.get(numero=numero)
        module = Module.objects.get(code_module=code_module)
        
        # Find the note based on student and module
        note = Note.objects.filter(student=student, module=module).first()
        
        if note:
            # Capture details before deletion for response data
            note_data = {
                "code_module": note.module.code_module,
                "coefficient": note.module.coefficient,  # Assuming coefficient is in Module
                "note": note.note
            }
            note.delete()  # Delete the note
            return Response({
                "message": "Note supprimée avec succès.",
                "note_data": note_data
            }, status=status.HTTP_200_OK)
        
        else:
            # Return an error message if the note doesn't exist
            return Response({"message": "Note inexistante pour ce module."}, status=status.HTTP_404_NOT_FOUND)
    
    except Student.DoesNotExist:
        return Response({"error": "Etudiant Inexistant"}, status=status.HTTP_404_NOT_FOUND)
    except Module.DoesNotExist:
        return Response({"error": "Module Inexistant"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Handle unexpected exceptions
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def note_view(request, numero, code_module):
    try:
        # Retrieve the student and module based on the provided identifiers
        student = get_object_or_404(Student, numero=numero)
        module = get_object_or_404(Module, code_module=code_module)

        # Retrieve the note for the specified student and module
        note = Note.objects.filter(student=student, module=module)

        if note.exists():
            serializer = NoteSerializer(note, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No note found for this student and module."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
def modify_note(request, numero, code_module):
    student = get_object_or_404(Student, numero=numero)
    module = get_object_or_404(Module, code_module=code_module)

    note, created = Note.objects.get_or_create(student=student, module=module)

    if request.method == 'GET':
        if not created:
            serializer = NoteUpdateSerializer(note)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Note not yet entered for this module."}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'PUT':
        serializer = NoteUpdateSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_note(request):
    try:
        student_id = request.data.get('student_id')
        code_module = request.data.get('code_module')
        note_value = request.data.get('note')

        student = get_object_or_404(Student, numero=student_id)
        module = get_object_or_404(Module, code_module=code_module)

        note = Note.objects.create(student=student, module=module, note=note_value)
        serializer = NoteSerializer(note)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def student_details(request, numero):
    student = get_object_or_404(Student, numero=numero)
    
    student_data = StudentSerializer(student).data
    modules = Module.objects.filter(filiere=student.filiere)
    module_data = ModuleSerializer(modules, many=True).data

    response_data = {
        "student": student_data,
        "student_image": student.student_image.url if student.student_image else None,  # Return the image URL
        "modules": module_data

    }
    
    return Response(response_data, status=status.HTTP_200_OK)
