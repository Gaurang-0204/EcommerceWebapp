from rest_framework import serializers
from .models import AnalyticsEvent, AnalyticsSummary, SearchAnalytics

class AnalyticsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsEvent
        fields = ['id', 'user', 'event_type', 'event_data', 'timestamp']


class AnalyticsSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsSummary
        fields = '__all__'


class SearchAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchAnalytics
        fields = ['query', 'result_count', 'timestamp']
