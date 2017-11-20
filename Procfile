web: gunicorn dj_rasacore_server.wsgi --log-file - --timeout=60

worker: celery worker --app=dj_rasacore_server --loglevel debug

#python -m rasa_core.server -d trainingdump/dialogue/ -u trainingdump/models/default/model_20171120-044045/ --cors *