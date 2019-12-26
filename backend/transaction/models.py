from django.db import models

# Create your models here.


class ListItem(models.Model):
	item_id = models.CharField(max_length=200, null=True, blank=True)
	name = models.CharField(null=True, max_length=200, blank=True)
	brand = models.CharField(null=True, max_length=200, blank=True)
	unit_price = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
	total_price = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
	quantity = models.IntegerField(null=True, blank=True)
	specification = models.CharField(max_length=200, null=True, blank=True)
	quality = models.CharField(max_length=200, null=True, blank=True)
	vendor = models.CharField(null=True, max_length=200, blank=True)
	agent = models.CharField(null=True, max_length=200, blank=True)
	receipt_bool = models.BooleanField(null=True, max_length=200, blank=True)
	created_date = models.DateField(null=True, blank=True, auto_now_add=True)
	updated_date = models.DateField(null=True, blank=True, auto_now_add=True)


	def __str__(self):
		"""A string representation of the model."""
		return 'Item id:{}, name: {}, brand: {}, unit_price: {}, total_price: {}, quantity: {}, specification: {}, quality: {}, vendor: {}, agent: {}, receipt_bool:{}, created_date: {}, updated_date: {}'.format(self.item_id, self.name, self.brand, self.unit_price, self.total_price, self.quantity, self.specification, self.quality, self.vendor, self.agent, self.receipt_bool, self.created_date, self.updated_date)
