from django.urls import path
from . import views

urlpatterns = [
    path('notes/', views.get_all_notes, name='get_all_notes'),
    path('notes/<int:noteId>/', views.view_note, name='view_note'),
    path('notes/create/', views.create_note, name='create_note'),
    path('notes/<int:noteId>/update/', views.update_note, name='update_note'),
    path('notes/<int:noteId>/delete/', views.delete_note, name='delete_note'),
    path('notes/<int:noteId>/favorite/', views.update_favorite, name='update_favorite'),
]