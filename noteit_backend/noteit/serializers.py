from rest_framework import serializers
from .models import Note, Todo


class TodoSerializer(serializers.ModelSerializer):
    noteId = serializers.IntegerField(source='noteId_id', read_only=True)
    title = serializers.CharField(max_length=255)
    completed = serializers.BooleanField()

    class Meta:
        model = Todo
        fields = ['id', 'noteId', 'title', 'completed']


class NoteSerializer(serializers.ModelSerializer):
    deviceId = serializers.CharField(max_length=255)
    updatedAt = serializers.DateTimeField(read_only=True)
    title = serializers.CharField(max_length=255)
    content = serializers.CharField()
    isFavorite = serializers.BooleanField()

    class Meta:
        model = Note
        fields = ['id', 'deviceId', 'updatedAt', 'title', 'content', 'isFavorite']


class NoteWithTodosSerializer(serializers.ModelSerializer):
    deviceId = serializers.CharField(max_length=255)
    updatedAt = serializers.DateTimeField(read_only=True)
    title = serializers.CharField(max_length=255)
    content = serializers.CharField()
    isFavorite = serializers.BooleanField()
    todos = TodoSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'deviceId', 'updatedAt', 'title', 'content', 'isFavorite', 'todos']
