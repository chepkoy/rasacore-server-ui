from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response

from .tasks import do_training

from .models import Actions, Entities, Intents, \
    IntentUserSays, IntentUserSaysEntities, Stories, \
    IntentActions, IntentActionsResponses, ResponseButtons, \
    StoryIntents, Training

from .serializers import ActionsSer, EntitiesSer, IntentsSer, \
    IntentUserSaysSer, IntentUserSaysEntitiesSer, StoriesSer, \
    IntentActionsSer, IntentActionsResponsesSer, ResponseButtonsSer, \
    TrainingSer, StoryIntentsSer, StoryIntentsSer

class StoriesViewSet(viewsets.ModelViewSet):
    queryset = Stories.objects.all()
    serializer_class = StoriesSer

class StoryIntentsViewSet(viewsets.ModelViewSet):
    queryset = StoryIntents.objects.all()
    serializer_class = StoryIntentsSer
    filter_fields = ['story', ]

class IntentsViewSet(viewsets.ModelViewSet):
    queryset = Intents.objects.all()
    serializer_class = IntentsSer

class IntentUserSaysViewSet(viewsets.ModelViewSet):
    queryset = IntentUserSays.objects.all()
    serializer_class = IntentUserSaysSer
    filter_fields = ['intent', ]

class IntentActionsViewSet(viewsets.ModelViewSet):
    queryset = IntentActions.objects.all()
    serializer_class = IntentActionsSer
    filter_fields = ['intent', ]

@api_view(http_method_names=['post', ])
def trainView(request):
    """
    Start training queue
    """
    try:
        do_training.delay()
        return Response({'status': 'success'})
    except Exception as ex:
        return Response({'status': 'error', 'detail': str(ex)}, 400)
