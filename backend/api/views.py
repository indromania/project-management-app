from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response

# ✅ Custom login view to return Auth Token
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = AuthTokenSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)

        # 👇 You could optionally return user info too, like email or role
        return Response({
            'token': token.key,
            # 'email': user.email,
            # 'role': user.last_name  # Only if needed
        })
from django.contrib.auth.models import User  # Add this import at the top if not already present
from django.utils.timezone import localtime  # Import localtime for timezone conversion

engineer_list = []  # Initialize the list to store engineer data
users = User.objects.all()  # Fetch all users from the database
for user in users:
    engineer_list.append({
        "name": user.first_name,
        "email": user.email,
        "stack": user.last_name,  # ✅ fetch role from last_name
        "created": localtime(user.date_joined).strftime("%Y-%m-%d %H:%M:%S")
    })