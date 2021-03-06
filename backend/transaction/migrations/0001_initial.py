# Generated by Django 2.2.4 on 2019-12-20 04:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ListItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_id', models.CharField(blank=True, max_length=200, null=True)),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
                ('brand', models.CharField(blank=True, max_length=200, null=True)),
                ('unit_price', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('total_price', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('quantity', models.IntegerField(blank=True, null=True)),
                ('specification', models.CharField(blank=True, max_length=200, null=True)),
                ('quality', models.CharField(blank=True, max_length=200, null=True)),
                ('vendor', models.CharField(blank=True, max_length=200, null=True)),
                ('agent', models.CharField(blank=True, max_length=200, null=True)),
                ('receipt_bool', models.BooleanField(blank=True, max_length=200, null=True)),
                ('created_date', models.DateField(auto_now_add=True, null=True)),
                ('updated_date', models.DateField(auto_now=True, null=True)),
            ],
        ),
    ]
