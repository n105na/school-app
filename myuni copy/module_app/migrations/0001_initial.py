# Generated by Django 5.1.2 on 2024-11-25 21:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('student', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code_module', models.CharField(max_length=50)),
                ('designation_module', models.CharField(max_length=100)),
                ('coefficient', models.FloatField()),
                ('volume_horaire', models.IntegerField()),
                ('filiere', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='student.filiere')),
            ],
        ),
    ]
