# Generated by Django 2.2.4 on 2019-08-28 06:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transaction', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listitem',
            name='specification',
            field=models.CharField(choices=[('SM', '平方米'), ('CM', '立方米'), ('UNKNOWN', '未知')], default='UNKNOWN', max_length=10),
        ),
    ]
