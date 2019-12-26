from django.shortcuts import render
from rest_framework import viewsets, permissions          
from .serializers import ListItemSerializer      
from .models import ListItem 
from rest_framework.permissions import IsAuthenticated

class TransactionView(viewsets.ModelViewSet):       
  serializer_class = ListItemSerializer          
  permission_classes = [permissions.IsAuthenticated]  

  def get_queryset(self): 
        return self.request.user.transactions.all()

  def perform_create(self, serializer): 
        serializer.save(owner=self.request.user)

