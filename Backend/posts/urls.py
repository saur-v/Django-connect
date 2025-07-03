from django.urls import path
from .views import *

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('<int:post_id>/like/', LikeToggleView.as_view(), name='post-like'),
    path('<int:post_id>/comment/', CommentCreateView.as_view(), name='post-comment'),
    path('feed/', FeedView.as_view(), name='feed'),
    path('explore/', PublicFeedView.as_view(), name='public-feed'),
]