from celery import task
from rasacore.training import Train

@task
def do_training():
    """
    Run training instance at the background
    """
    train_cls = Train()
    train_cls.run()