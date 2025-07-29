from django.shortcuts import render
from django.views import generic
from .models import Item, MEAL_TYPE # own created dish class

# Create your views here.
'''
The following page when user click dish title
When user trigger the url, both class html need to activated
'''
class MenuList(generic.ListView):
    queryset = Item.objects.order_by("-date_created") # The Item class from models.py
    template_name = "index.html" # it's menu front page

    '''
    Send backend content to html 
    '''
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["meals"] = MEAL_TYPE # dictionary data structure
        return context

class MenuItemDetail(generic.DeleteView):
    model = Item
    template_name = "menu_item_detail.html" # it's individual item page once user click

'''
The templates directory is updated inside the app directory
We can make common-html-template in django mysite as well
'''