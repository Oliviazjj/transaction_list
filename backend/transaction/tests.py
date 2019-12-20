from django.test import TestCase
from transaction.models import ListItem as ListItemModel
import datetime

# listItem tests


class ListItem(TestCase):
        @classmethod
        def setUpTestData(cls):
                # Set up non-modified objects used by all test methods

                item1 = ListItemModel.objects.create(item_id='1234', name='name1', brand='brand1', unit_price=12.0, total_price=120.0, quantity=10, specification='立方米', quality=3, vendor='vendor1', agent='agent1', receipt_bool='True', created_date=datetime.date.today(), updated_date=datetime.date.today())
        
        def test_list_item_setup(self):
                print("Method: test_list_item_setup.")
                item1 = ListItemModel.objects.get(item_id='1234')
                current_date = str(datetime.date.today())
                correct = "Item id:1234, name: name1, brand: brand1, unit_price: 12.00, total_price: 120.00, quantity: 10, specification: 立方米, quality: 3, vendor: vendor1, agent: agent1, receipt_bool:True, created_date: {}, updated_date: {}".format(current_date, current_date)
                self.assertEqual(str(item1), correct)
