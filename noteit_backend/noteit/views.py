from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import Note, Todo
from .serializers import NoteSerializer, NoteWithTodosSerializer, TodoSerializer


@api_view(['GET'])
def get_all_notes(request):
    """
    Receive deviceId from query params
    Return all notes for that device
    """
    deviceId = request.query_params.get('deviceId')
    
    if not deviceId:
        return Response(
            {"error": "deviceId is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    notes = Note.objects.filter(deviceId=deviceId).order_by('-updatedAt')
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def view_note(request, noteId):
    """
    Receive noteId from URL parameter
    Return note details including all todos
    """
    try:
        note = Note.objects.get(id=noteId)
    except Note.DoesNotExist:
        return Response(
            {"error": "Note not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = NoteWithTodosSerializer(note)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_note(request):
    """
    Receive all note data from frontend
    Save note and todos to database
    """
    data = request.data
    todos_data = data.pop('todos', [])
    
    serializer = NoteSerializer(data=data)
    if serializer.is_valid():
        note = serializer.save()
        
        for todo_data in todos_data:
            Todo.objects.create(
                noteId=note,
                title=todo_data.get('title', ''),
                completed=todo_data.get('completed', False)
            )
        
        response_serializer = NoteWithTodosSerializer(note)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_note(request, noteId):
    """
    Receive noteId and all note data
    Update the note and its todos
    """
    try:
        note = Note.objects.get(id=noteId)
    except Note.DoesNotExist:
        return Response(
            {"error": "Note not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    data = request.data
    todos_data = data.pop('todos', None)
    
    serializer = NoteSerializer(note, data=data, partial=True)
    if serializer.is_valid():
        note = serializer.save()
        
        if todos_data is not None:
            Todo.objects.filter(noteId=note).delete()
            
            for todo_data in todos_data:
                Todo.objects.create(
                    noteId=note,
                    title=todo_data.get('title', ''),
                    completed=todo_data.get('completed', False)
                )
        
        response_serializer = NoteWithTodosSerializer(note)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_note(request, noteId):
    """
    Receive noteId
    Delete the note (todos cascade delete)
    """
    try:
        note = Note.objects.get(id=noteId)
    except Note.DoesNotExist:
        return Response(
            {"error": "Note not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    note.delete()
    return Response(
        {"message": "Note deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(['PATCH'])
def update_favorite(request, noteId):
    """
    Receive noteId and isFavorite boolean
    Update the isFavorite field
    """
    try:
        note = Note.objects.get(id=noteId)
    except Note.DoesNotExist:
        return Response(
            {"error": "Note not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    isFavorite = request.data.get('isFavorite')
    
    if isFavorite is None:
        return Response(
            {"error": "isFavorite field is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    note.isFavorite = isFavorite
    note.save()
    
    serializer = NoteSerializer(note)
    return Response(serializer.data, status=status.HTTP_200_OK)
