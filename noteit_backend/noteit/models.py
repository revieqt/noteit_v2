from django.db import models


class Note(models.Model):
    deviceId = models.CharField(max_length=255)
    updatedAt = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    isFavorite = models.BooleanField(default=False)

    class Meta:
        db_table = 'notes'

    def __str__(self):
        return self.title


class Todo(models.Model):
    noteId = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='todos')
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    class Meta:
        db_table = 'todos'

    def __str__(self):
        return self.title
