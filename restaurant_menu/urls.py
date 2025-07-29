from django.urls import path
from . import views # linked both html files

urlpatterns = [
    # Once user go to home page, will link to the html file in MenuList class in views.py 
    # (triple lines as item inside list, use comma at the end)
    path('', views.MenuList.as_view(), name='home'), # blank space due to pre-setting domain name in mysite
    path('item/<int:pk>/', views.MenuItemDetail.as_view(), name="menu_item") # once user click pasta, jump to url with /item/
]