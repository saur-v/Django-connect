from django.db import models
from users.models import *

# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='post')
    caption = models.TextField(blank=True)
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def total_likes(self):
        return self.likes.count()
    
    def __str__(self):
        return f"{self.author.username}'s post"
    

class Like(models.Model):
    user = models.ForeignKey(CustomUser , on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)    

    class Meta:
        unique_together = ('post','user')


class Comment(models.Model):
    user = models.ForeignKey(CustomUser , on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)    
    text = models.TextField()      
