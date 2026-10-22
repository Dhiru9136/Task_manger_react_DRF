from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CreateUserSerializer, TaskSerializer
from .models import User,Task
from rest_framework import permissions,authentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated
from datetime import datetime, timedelta

import jwt

class CreateUserView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        serializer = CreateUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully.",
                             "status": status.HTTP_201_CREATED})
        
        return Response(serializer.errors, status=400)
    def get(self, request):
        users = User.objects.all()
        serializer = CreateUserSerializer(users, many=True)
        return Response(serializer.data)


class LogInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = User.objects.filter(
            username=username,
            password=password
        ).first()

        if user is None:
            return Response(
                {"message": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful",
                "username": user.username,
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
            },
            status=status.HTTP_200_OK
        )

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CreateUserSerializer(user)
        return Response(serializer.data)

    
class TaskView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        if not request.user.is_authenticated:
            return Response(
            {"message": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED
        )

        title = request.data.get("title")
        description = request.data.get("description", "")
        status_value = request.data.get("status", "Pending")
        priority = request.data.get("priority", "Medium")
        due_date_str = request.data.get("due_date") or None

        if not title:
            return Response(
            {"message": "Task title is required."},
            status=status.HTTP_400_BAD_REQUEST
            )

        task = Task.objects.create(
            title=title,
            id=request.user.id,
            description=description,
            status=status_value,
            priority=priority,
            due_date=due_date_str
        )

        return Response(
        {
            "message": f"Hello, {request.user.username}!",
            "task_id": task.id,
            "user_id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
            "due_date": task.due_date
        },
        status=status.HTTP_201_CREATED
    )



    
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"message": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        if not request.user.is_active:
            return Response({"message": "User is inactive."}, status=status.HTTP_403_FORBIDDEN)
        
        tasks = Task.objects.filter(id=request.user.id,is_active=True)
        if not tasks.exists():
            return Response(
            {"message": "No tasks found for this user."},
            status=status.HTTP_200_OK
        )
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)