from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import localtime

# POST: Add new engineer (Admin only)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_engineer(request):
    data = request.data
    name = data.get('name')
    email = data.get('email')
    role = data.get('role')

    if not all([name, email, role]):
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({"error": "Engineer with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=email,
        email=email,
        first_name=name,
        last_name=role,  # Storing role temporarily in last_name
        password='Pa@123456'
    )
    user.save()

    return Response({"message": "Engineer created successfully"}, status=status.HTTP_201_CREATED)

# GET: Retrieve team list
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_engineers(request):
    users = User.objects.all()
    engineer_list = []

    for user in users:
        engineer_list.append({
            "name": user.first_name,
            "email": user.email,
            "stack": user.last_name or "backend/frontend",  # fallback
            "created": localtime(user.date_joined).strftime("%Y-%m-%d %H:%M:%S")
        })

    return Response(engineer_list)

# DELETE: Remove engineer by email (query param)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_engineer(request):
    email = request.query_params.get('email')
    if not email:
        return Response({"error": "Email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=email)
        user.delete()
        return Response({"message": "Engineer deleted successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Engineer not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
