from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

#User Serializers
class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'email')

#Register Serializers
class RegisterSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'password')
    extra_kwargs = {'password': {'write_only': True}}

  def create(self, validated_data):
    user = User.objects.create_user(validated_data['username'], 
    validated_data['email'], validated_data['password'])
    
    return user

#Login Serializers
class LoginSerializer(serializers.Serializer): #not using modelserializer here since we're not creating a new model here, just want ot validate a user is authenticated
  username = serializers.CharField()
  password = serializers.CharField()

  def validate(self, data):
    user = authenticate(**data)
    if user and user.is_active:
      return user
    raise serializers.ValidationError("incorrect credentials")



