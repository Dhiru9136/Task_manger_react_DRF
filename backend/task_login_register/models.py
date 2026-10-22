from django.db import models

# Create your models here.
class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    email = models.EmailField(max_length=100,null=True)
    f_name = models.CharField(max_length=100)
    l_name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    @property
    def is_authenticated(self):
        return True
    class Meta:
        # managed = False
        db_table = 'Users'


from django.db import models


class Task(models.Model):

    task_id = models.AutoField(primary_key=True)

    id = models.IntegerField()

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=20,default="Pending")

    priority = models.CharField(max_length=20,default="Medium")

    due_date = models.DateField(blank=True,null=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "Tasks"