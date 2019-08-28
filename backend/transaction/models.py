from django.db import models

# Create your models here.

SPECIFICATION_CHOICES = (
        ('SM', '平方米'),
        ('CM', '立方米'),
        ('UNKNOWN', '未知'),
    )

class ListItem(models.Model):
	
	
	item_id = models.CharField(max_length=200)
	name = models.CharField(max_length=200)
	brand = models.CharField(max_length=200)
	unit_price = models.DecimalField(max_digits=20, decimal_places=4)
	total_price = models.DecimalField(max_digits=20, decimal_places=4)
	specification = models.CharField(max_length=10, choices=SPECIFICATION_CHOICES, default='UNKNOWN')
	quality = models.BigIntegerField()
	vendor = models.CharField(max_length=200)
	agent = models.CharField(max_length=200)
	receipt_bool = models.BooleanField()
	created_date = models.DateField()


	def __str__(self):
		"""A string representation of the model."""
		return 'Item id:{}, name: {}, brand: {}, unit_price: {}, total_price: {}, specification: {}, quality: {}, vendor: {}, agent: {}, receipt_bool:{}, created_date: {}'.format(self.id, self.name, self.brand, self.unit_price, self.total_price, self.specification, self.quality, self.vendor, self.agent, self.receipt_bool, self.created_date)
