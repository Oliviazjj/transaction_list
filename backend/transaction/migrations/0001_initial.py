# Generated by Django 2.2.4 on 2019-08-28 06:25

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
                ('item_id', models.CharField(max_length=200)),
                ('name', models.CharField(max_length=200)),
                ('brand', models.CharField(max_length=200)),
                ('unit_price', models.DecimalField(decimal_places=4, max_digits=20)),
                ('total_price', models.DecimalField(decimal_places=4, max_digits=20)),
                ('specification', models.CharField(choices=[('M2', '平方米'), ('M3', '立方米'), ('UKN', '未知')], default='UKN', max_length=10)),
                ('quality', models.BigIntegerField()),
                ('vendor', models.CharField(max_length=200)),
                ('agent', models.CharField(max_length=200)),
                ('receipt_bool', models.BooleanField()),
                ('created_date', models.DateField()),
            ],
        ),
    ]