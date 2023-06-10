from django.contrib.auth import get_user_model
from rest_framework import serializers
from ..models import Team, MTeamUser
from .users import UserSerializers


User = get_user_model()


class TeamCreateSerializers(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ["id","name", "num_members", "description"]





# class LeaderSerializers(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields=["name"]

class TeamSerializers(serializers.ModelSerializer):
    leader = UserSerializers()
    class Meta:
        model = Team
        fields = ["id","name", "num_members", "description","leader"]


class TeamDetailSerializers(serializers.ModelSerializer):
    leader = UserSerializers()
    ranking = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ["id", "name", "num_members", "description", "leader","ranking"]

    def get_ranking(self, team):
        teams = Team.objects.all().order_by("id")

        return list(teams).index(team)


class MTeamUserSerializers(serializers.ModelSerializer):
    team = TeamSerializers()
    user = UserSerializers()
    class Meta:
        model = MTeamUser
        fields = ["team", "user"]
