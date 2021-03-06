# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from solo.models import SingletonModel
from ordered_model.models import OrderedModel
from django.db.models.signals import post_save

class Actions(models.Model):
    name = models.SlugField(max_length=70, unique=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'Action'
        verbose_name_plural = 'Actions'

class Entities(models.Model):
    name = models.SlugField(max_length=70, unique=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'Entity'
        verbose_name_plural = 'Entities'

class Intents(models.Model):
    name = models.SlugField(max_length=70, unique=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = 'Intent'
        verbose_name_plural = 'Intents'

class Stories(models.Model):
    title = models.CharField(max_length=70)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __unicode__(self):
        return self.title

    class Meta:
        ordering = ('-created_at', )
        verbose_name = 'Story'
        verbose_name_plural = 'Stories'

class StoryIntents(models.Model):
    intent = models.ForeignKey(Intents, related_name="stories")
    story = models.ForeignKey(Stories, related_name="intents")

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ('-created_at', )
        verbose_name = 'Intent'
        verbose_name_plural = 'Intents'

class IntentUserSays(models.Model):
    """
    NLU user says examples. Examples of conversation texts users have with the bot
    """
    story_intent = models.ForeignKey(StoryIntents, related_name='usersays')
    text = models.CharField(max_length=240)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        ordering = ('-created_at', )
        verbose_name = 'Intent User Say'
        verbose_name_plural = 'Intent User Says'

class IntentUserSaysEntities(models.Model):
    usersay = models.ForeignKey(IntentUserSays, related_name='entities')
    entity = models.ForeignKey(Entities, related_name='intent_entities')
    value = models.CharField(max_length=140)
    # TODO: Change synonyms field to Postgres array field
    synonyms = models.CharField(max_length=400, blank=True, null=True, help_text="Add multiple value synonyms separated by commas")
    start = models.IntegerField(default=0, editable=False)
    end = models.IntegerField(default=0, editable=False)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        ordering = ('-created_at', )
        verbose_name = 'User Says Entity'
        verbose_name_plural = 'User Says Entities'

class IntentActions(OrderedModel):
    story_intent = models.ForeignKey(StoryIntents, related_name='actions')
    action = models.ForeignKey(Actions, related_name='intent_actions')

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __unicode__(self):
        return "%s (%s)" % (self.action, self.intent)

    class Meta(OrderedModel.Meta):
        pass

class IntentActionsResponses(models.Model):
    intent_action = models.ForeignKey(IntentActions, related_name='responses')
    text = models.CharField(max_length=240)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __unicode__(self):
        return '%s response' % self.intent_action

    class Meta:
        ordering = ('-created_at', )
        verbose_name = 'Action response'
        verbose_name_plural = 'Action responses'

class ResponseButtons(models.Model):
    response = models.ForeignKey(IntentActionsResponses, related_name='buttons')
    title =  models.CharField(max_length=20)
    payload =  models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        ordering = ('-created_at', )
        verbose_name = 'Button'
        verbose_name_plural = 'Buttons'

class Training(SingletonModel):
    PIPELINE_CHOICES = (
        ('spacy_sklearn', 'Spacy-Sklearn'), 
    )
    pipeline = models.CharField(max_length=70, choices=PIPELINE_CHOICES, default='spacy_sklearn')

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __unicode__(self):
        return u"Training"

    class Meta:
        verbose_name = "Training"


def on_user_entities_save(sender, instance, created, **kwargs):
    try:
        if instance.value and instance.usersay.text:
            example_text = instance.usersay.text
            start = example_text.find(instance.value)
            end = len(instance.value) + start
            if (instance.start != start) and (instance.end != end):
                instance.start = start
                instance.end = end
                instance.save()
    except Exception as ex:
        print(str(ex))
post_save.connect(on_user_entities_save, sender=IntentUserSaysEntities)