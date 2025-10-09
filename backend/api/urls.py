from django.urls import path
from . import views

urlpatterns = [
    path("image-pdf/", views.process_image, name="process image")
]