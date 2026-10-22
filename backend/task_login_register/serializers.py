from rest_framework import serializers
from .models import User,Task


class CreateUserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User  
        fields = [
            'id',
            'username',
            'email',
            'password',
            'password2',
            'f_name',
            'l_name',
            'mobile'
        ]
    def validate(self, data):
            if data['password'] != data['password2']:
                raise serializers.ValidationError("Passwords do not match.")
            return data
    def create(self, validated_data):
            validated_data.pop('password2')

            user = User.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                f_name=validated_data['f_name'],
                l_name=validated_data['l_name'],
                mobile=validated_data['mobile']
            )
            return user

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'