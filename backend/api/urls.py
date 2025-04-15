from django.urls import path
from .engineer_views import add_engineer, get_engineers, delete_engineer  # ✅ include delete
from .views import CustomAuthToken

urlpatterns = [
    path('login/', CustomAuthToken.as_view(), name='api_token_auth'),
    path('add-engineer/', add_engineer, name='add_engineer'),
    path('team/', get_engineers, name='get_engineers'),
    path('delete-engineer/', delete_engineer, name='delete_engineer'),  # ✅ new delete endpoint
]
