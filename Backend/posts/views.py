from django.shortcuts import render
from rest_framework import generics, permissions, status
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
# Create your views here.

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  

    def delete(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author != request.user:
            return Response({'detail': 'Not authorized to delete this post.'}, status=403)
        return super().delete(request, *args, **kwargs) 


class LikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        
        post = get_object_or_404(Post, id = post_id)
        like, created = Like.objects.get_or_create(user = request.user , post = post)
        
        if not created:
            like.delete()
            return Response({"message": "Unliked"}, status=status.HTTP_200_OK)
        return Response({"message": "Liked"}, status=status.HTTP_201_CREATED)
    

class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, id=post_id)
        serializer.save(user=self.request.user, post=post)


class FeedView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get list of user IDs the current user is following
        following_ids = self.request.user.following.values_list('following_id', flat=True)
        return Post.objects.filter(author__id__in=following_ids).order_by('-created_at')


class PublicFeedView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Post.objects.all().order_by('-created_at')

        if self.request.user.is_authenticated:     
            following_users = Follow.objects.filter(follower=self.request.user).values_list('following', flat=True)

            queryset = queryset.exclude(author__in=list(following_users) + [self.request.user.id])

        return queryset