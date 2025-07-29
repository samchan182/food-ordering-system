from django.db import models
from django.contrib.auth.models import User

# Create your models here.

MEAL_TYPE = (
    ("Starters", "Starters"), # first one is backend, second one is frontend
    ("salads", "Salads"),
    ("main_dishes", "Main_dishes"),
    ("desserts", "Desserts")
)

STATUS = (
    (0, "Unavailable"),
    (1, "Available")
)

'''
Create a class to inherience models class from django.db
In database crated by django, the table name will be project_name + Item (class name)
'''
class Item(models.Model):
    meal = models.CharField(max_length=1000, unique=True) # create category in database
    description = models.CharField(max_length=2000) # not unique, same meal might be same ingredients
    price = models.DecimalField(max_digits=10, decimal_places=2)
    meal_type = models.CharField(max_length=200, choices=MEAL_TYPE) # they can choose by drop-down list
    '''
    An User is pre-setting table data structure like Item
    '''
    author = models.ForeignKey(User, on_delete=models.PROTECT) # if user delete the choice
    status = models.IntegerField(choices=STATUS, default=1) # dish is not available anymore
    date_created = models.DateTimeField(auto_created=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.meal # will be presented by meal name

'''
Successfully run will create database table in db.sqlite3 table
Migration means the database is sync with your created model
'''