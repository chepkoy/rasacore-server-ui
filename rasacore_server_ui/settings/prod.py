from .base import *

import dj_database_url

ALLOWED_HOSTS = [os.environ.get('DOMAIN'), ]

db_from_env = dj_database_url.config(conn_max_age=500)

DATABASES['default'].update(db_from_env)

# Production storage

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

try:
    from .local import *
except ImportError:
    pass