from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class JoinSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(email=validated_data["email"],
                                        username=validated_data["username"],
                                        password=validated_data["password"])

        return user

    class Meta:
        model = User
        fields = ['pk','email','username','password']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
            refresh = self.get_token(self.user)
            data['email'] = self.user.email
            data['refresh'] = str(refresh)
            data['access'] = str(refresh.access_token)
            if self.user.is_active == False:
                print(2)
                data['response'] = 'activate_error'
            else:
                data['response'] = 'complete'
        except Exception as e:
            data['response'] = 'error'
        return data
