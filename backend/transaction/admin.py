from django.contrib import admin

# Register your models here.
from .models import ListItem # add this

class ListItemAdmin(admin.ModelAdmin):  # add this
  list_display = ('item_id', 'name', 'brand', 'unit_price', 'total_price', 'specification', 'quality', 'vendor', 'agent', 'receipt_bool', 'created_date')

# Register your models here.
admin.site.register(ListItem, ListItemAdmin) # add this