web: gunicorn dj_rasacore_server.wsgi --log-file - --timeout=60

worker: celery worker --app=dj_rasacore_server --loglevel debug
