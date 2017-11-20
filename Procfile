web: gunicorn rasacore_server_ui.wsgi --log-file - --timeout=60

worker: celery worker --app=rasacore_server_ui --loglevel debug

# TODO: Add server worker for chat interface
# ex. python -m rasa_core.server -d trainingdump/dialogue/ -u trainingdump/models/default/model_20171120-044045/ --cors=*