from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model

user = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ['id','username','email']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  

    class Meta:
        model = Profile
        fields = ['id','user','bio','profile_pic']  

    def get_profile_pic(self, obj):
        request = self.context.get('request')
        if obj.profile_pic:
            return request.build_absolute_uri(obj.profile_pic.url)
        return None    


class FollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']
