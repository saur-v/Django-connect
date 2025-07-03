from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', MyProfileView.as_view(), name='my-profile'),
    path('search/', UserSearchView.as_view(), name='user-search'),
    path('suggested/', SuggestedUsersView.as_view(), name='suggested-users'),
    path('<str:username>/follow/', FollowUserView.as_view(), name='follow'),
    path('<str:username>/unfollow/', UnfollowUserView.as_view(), name='unfollow'),
    path('<str:username>/followers/', FollowersListView.as_view(), name='followers'),
    path('<str:username>/following/', FollowingListView.as_view(), name='following'),
    path('<str:username>/', UserProfileView.as_view(), name='user-profile'),
    
]
