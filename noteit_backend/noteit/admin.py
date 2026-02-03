from django.contrib import admin
from .models import Note, Todo


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'deviceId', 'updatedAt', 'isFavorite')
    list_filter = ('isFavorite', 'updatedAt')
    search_fields = ('title', 'content', 'deviceId')
    ordering = ('-updatedAt',)


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'noteId', 'completed')
    list_filter = ('completed', 'noteId')
    search_fields = ('title',)

