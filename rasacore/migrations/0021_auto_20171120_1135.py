# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-20 11:35
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rasacore', '0020_auto_20171119_1301'),
    ]

    operations = [
        migrations.CreateModel(
            name='StoryIntents',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'ordering': ('-created_at',),
                'verbose_name': 'Intent',
                'verbose_name_plural': 'Intents',
            },
        ),
        migrations.AlterModelOptions(
            name='intents',
            options={'verbose_name': 'Intent', 'verbose_name_plural': 'Intents'},
        ),
        migrations.RemoveField(
            model_name='intentactions',
            name='intent',
        ),
        migrations.RemoveField(
            model_name='intents',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='intents',
            name='story',
        ),
        migrations.RemoveField(
            model_name='intents',
            name='updated_at',
        ),
        migrations.RemoveField(
            model_name='intentusersays',
            name='intent',
        ),
        migrations.AddField(
            model_name='storyintents',
            name='intent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stories', to='rasacore.Intents'),
        ),
        migrations.AddField(
            model_name='storyintents',
            name='story',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='intents', to='rasacore.Stories'),
        ),
        migrations.AddField(
            model_name='intentactions',
            name='story_intent',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='actions', to='rasacore.StoryIntents'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='intentusersays',
            name='story_intent',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='usersays', to='rasacore.StoryIntents'),
            preserve_default=False,
        ),
    ]