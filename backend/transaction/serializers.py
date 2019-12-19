# transaction/serializers.py

from rest_framework import serializers
from .models import ListItem

class ListItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = ListItem
    # fields = ('id', 'item_id', 'name', 'brand', 'unit_price', 'total_price', 'specification', 'quality', 'vendor', 'agent', 'receipt_bool', 'created_date')
    fields = '__all__'