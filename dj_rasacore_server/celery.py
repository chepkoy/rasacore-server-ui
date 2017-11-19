from __future__ import absolute_import

import os
from celery import Celery

from django.conf import settings

# set the default Django settings module for the 'celery' program.
BASE_PATH = os.path.dirname(os.path.abspath('manage.py'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dj_rasacore_server.settings')

app = Celery('dj_rasacore_server')

# Using a string here means the worker will not have to
# pickle the object when using Windows.
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
app.conf.broker_url = os.environ.get('RABBITMQ_URL')


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
