from django.shortcuts import render
import random
from rest_framework import generics, permissions
from .models import *
from posts.models import *
from posts.serializers import *
from .serializers import *
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'User registered successfully'}, status=201)

class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser] 

    def get_object(self):
        return self.request.user.profile
    
    def get_serializer_context(self):
        return {'request': self.request}

    
class FollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target_user = get_object_or_404(CustomUser, username=username)

        if target_user == request.user:
            return Response({'detail': 'You cannot follow yourself.'}, status=400)

        obj, created = Follow.objects.get_or_create(
            follower=request.user, following=target_user)

        if not created:
            return Response({'detail': 'Already following.'}, status=200)

        return Response({'detail': f'Now following {username}.'}, status=201)

class UnfollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target_user = get_object_or_404(CustomUser, username=username)

        follow_obj = Follow.objects.filter(follower=request.user, following=target_user)
        if follow_obj.exists():
            follow_obj.delete()
            return Response({'detail': f'Unfollowed {username}.'}, status=200)

        return Response({'detail': 'You were not following this user.'}, status=400)

class FollowersListView(generics.ListAPIView):
    serializer_class = FollowSerializer

    def get_queryset(self):
        user = get_object_or_404(CustomUser, username=self.kwargs['username'])
        return Follow.objects.filter(following=user)

class FollowingListView(generics.ListAPIView):
    serializer_class = FollowSerializer

    def get_queryset(self):
        user = get_object_or_404(CustomUser, username=self.kwargs['username'])
        return Follow.objects.filter(follower=user)  


class UserSearchView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        return CustomUser.objects.filter(username__icontains=query)
    

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, username):
        user = get_object_or_404(CustomUser, username=username)
        profile = get_object_or_404(Profile, user=user)

        posts = Post.objects.filter(author=user).order_by('-created_at')
        serialized_posts = PostSerializer(posts, many=True, context={'request': request}).data
        profile_data = ProfileSerializer(profile, context={'request': request}).data

        is_following = Follow.objects.filter(follower=request.user, following=user).exists()

        return Response({
            **profile_data,
            "posts": serialized_posts,
            "followers_count": Follow.objects.filter(following=user).count(),
            "following_count": Follow.objects.filter(follower=user).count(),
            "is_following": is_following,
            "is_self": request.user == user,
        })




class SuggestedUsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        current_user = request.user
        already_following_ids = Follow.objects.filter(follower=current_user).values_list('following__id', flat=True)

        # Get profiles of users not already followed
        suggestions = Profile.objects.exclude(user__id__in=already_following_ids).exclude(user=current_user)

        # Randomly pick up to 5 profiles
        random_profiles = random.sample(list(suggestions), min(5, suggestions.count()))

        # Use ProfileSerializer with request context for full image URLs
        serializer = ProfileSerializer(random_profiles, many=True, context={'request': request})
        return Response(serializer.data)
