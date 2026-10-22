from django.contrib import admin
from django.urls import path,include
from .views import CreateUserView,LogInView,TaskView,ProfileView

urlpatterns = [
    # path('__debug__/', include('debug_toolbar.urls')),
    # path("users/", views.create_user, name="create_user"),
    # path("get-users/", views.get_users, name="get_users"),
    path("register", CreateUserView.as_view(), name="users_api"),
    path("login",LogInView.as_view(),name="login_api"),
    path("task_view",TaskView.as_view(),name="taskView"),
    path("task_view/<int:task_id>",TaskView.as_view(),name="taskDetail"),
    path("profile",ProfileView.as_view(),name="profile_api"),
]