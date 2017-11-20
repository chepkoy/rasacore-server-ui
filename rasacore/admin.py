# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import nested_admin
from django.contrib import admin
from solo.admin import SingletonModelAdmin

from .models import Intents, Actions, Stories, \
    IntentUserSaysEntities, IntentUserSays, Training, \
    IntentActions, IntentActionsResponses, ResponseButtons, \
    Entities, StoryIntents

# Intent based admins
class IntentUserSaysEntitiesInline(nested_admin.NestedTabularInline):
    model = IntentUserSaysEntities
    readonly_fields = ['start', 'end']
    extra = 1

class IntentUserSaysInline(nested_admin.NestedStackedInline):
    model = IntentUserSays
    inlines = [IntentUserSaysEntitiesInline, ]
    extra = 1

class StoryIntentsAdmin(nested_admin.NestedModelAdmin):
    inlines = [IntentUserSaysInline, ]

# Stories admin
class ResponseButtonsInline(nested_admin.NestedTabularInline):
    model = ResponseButtons
    extra = 1

class IntentActionsResponsesInline(nested_admin.NestedStackedInline):
    model = IntentActionsResponses
    inlines = [ResponseButtonsInline, ]
    extra = 1

class IntentActionsInline(nested_admin.NestedStackedInline):
    model = IntentActions
    inlines = [IntentActionsResponsesInline, ]
    extra = 1

class StoryIntentsInline(nested_admin.NestedStackedInline):
    model = StoryIntents
    inlines = [IntentActionsInline, ]

class StoriesAdmin(nested_admin.NestedModelAdmin):
    inlines = [StoryIntentsInline, ]

class EntitiesAdmin(admin.ModelAdmin):
    list_display = ['name', ]
    search_fields = ['name', ]

admin.site.register(Intents)
admin.site.register(Actions)
admin.site.register(StoryIntents, StoryIntentsAdmin)
admin.site.register(Stories, StoriesAdmin)
admin.site.register(Entities, EntitiesAdmin)
admin.site.register(Training, SingletonModelAdmin)
