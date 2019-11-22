from django.db import models
from transaction.constants import *

# Create your models here.

class ListItem(models.Model):
	item_id = models.CharField(max_length=200)
	name = models.CharField(max_length=200)
	brand = models.CharField(max_length=200)
	unit_price = models.DecimalField(..., max_digits=5, decimal_places=2)
	total_price = models.DecimalField(..., max_digits=5, decimal_places=2)
	specification = models.CharField(max_length=200)
	quality = models.CharField(max_length=200)
	vendor = models.CharField(null=True, max_length=200)
	agent = models.CharField(null=True, max_length=200)
	receipt_bool = models.BooleanField()
	created_date = models.DateField(null=True, blank=True)


	def __str__(self):
		"""A string representation of the model."""
		return 'Item id:{}, name: {}, brand: {}, unit_price: {}, total_price: {}, specification: {}, quality: {}, vendor: {}, agent: {}, receipt_bool:{}, created_date: {}'.format(self.item_id, self.name, self.brand, self.unit_price, self.total_price, self.specification, self.quality, self.vendor, self.agent, self.receipt_bool, self.created_date)
