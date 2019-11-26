from django.db import models
from transaction.constants import *

# Create your models here.


class ListItem(models.Model):
	item_id = models.CharField(max_length=200)
	name = models.CharField(null=True, max_length=200)
	brand = models.CharField(null=True, max_length=200)
	unit_price = models.DecimalField(max_digits=5, decimal_places=2, null=True)
	total_price = models.DecimalField(max_digits=5, decimal_places=2, null=True)
	quantity = models.IntegerField(null=True)
	specification = models.CharField(max_length=200, null=True)
	quality = models.CharField(max_length=200, null=True)
	vendor = models.CharField(null=True, max_length=200)
	agent = models.CharField(null=True, max_length=200)
	receipt_bool = models.BooleanField(blank=True)
	created_date = models.DateField(null=True, blank=True)


	def __str__(self):
		"""A string representation of the model."""
		return 'Item id:{}, name: {}, brand: {}, unit_price: {}, total_price: {}, quantity: {}, specification: {}, quality: {}, vendor: {}, agent: {}, receipt_bool:{}, created_date: {}'.format(self.item_id, self.name, self.brand, self.unit_price, self.total_price, self.quantity, self.specification, self.quality, self.vendor, self.agent, self.receipt_bool, self.created_date)
