from django.shortcuts import render
from rest_framework import viewsets          
from .serializers import ListItemSerializer      
from .models import ListItem 

class TransactionView(viewsets.ModelViewSet):       
  serializer_class = ListItemSerializer          
  queryset = ListItem.objects.all()  
