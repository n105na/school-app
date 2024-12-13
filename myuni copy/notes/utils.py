from django.core.mail import send_mail
from django.conf import settings

def send_bulletin_email(bulletin_content):
    subject = "Student Bulletin"
    plain_message = f"Dear Student,\n\nHere is your bulletin:\n\n{bulletin_content}"

    send_mail(
        subject,
        plain_message,
        settings.EMAIL_HOST_USER,
        ['benainibenaini20t@gmail.com'],  # Replace with the email address to send to
        fail_silently=False,
    )
