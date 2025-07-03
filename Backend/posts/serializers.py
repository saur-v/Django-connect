from rest_framework import serializers
from .models import *
from users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)

    class Meta:
        model = Comment
        fields = ['id','user','text','created_at']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only = True)  
    comments = CommentSerializer(read_only = True, many = True)     
    likes_count = serializers.SerializerMethodField() 

    class Meta:
        model = Post
        fields = ['id', 'author', 'caption', 'image', 'created_at', 'likes_count', 'comments']

    def get_likes_count(self, obj):
        return obj.total_likes()    