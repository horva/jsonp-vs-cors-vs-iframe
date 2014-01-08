from django.contrib.auth.models import User
from django.db import models


class Post(models.Model):
    author = models.ForeignKey(User, editable=False)
    title = models.CharField(max_length=255)
    text = models.TextField()
    updated = models.DateTimeField(auto_now=True)
