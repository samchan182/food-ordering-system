from django.contrib import admin
from .models import Item

# Register your models here.

'''
Customise the admin page by pre-setting django
'''
class MenuItemAdmin(admin.ModelAdmin):
    '''Adding the functions in admin page'''
    list_display = ("meal", "status") # show the fields 
    list_filter = ("status",)
    search_fields = ("meals", "description")

'''
Linked both class into admin page
'''
admin.site.register(Item, MenuItemAdmin)

'''
The adding item format is all configured in the models.py in app directory
'''