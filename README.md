# Rasa Core Server UI

[Rasa Core](https://core.rasa.ai) uses yaml files to design conversation flow. I wanted a better way to visualize and handle large data sets during bot training and this is where this project comes handy.

## Training your models

After designing your knowledge base, you need to train for it to take effect. 

    python manage.py train


## Test training

Check your trainingdump directory to confirm the exact **YOUR_MODEL_DIRECTORY** value

   python -m rasa_core.run -d trainingdump/dialogue -u trainingdump/models/default/YOUR_MODEL_DIRECTORY/

## Todo list

- Wrapping of Rasa Core and Rasa NLU to this project
- Django admin modelling of NLU training
- Django admin modelling of Rasa core dialog flows i.e stories etc
- Better client UI with good visuals unlike Django admin
- A better way of managing intent, entities and actions records
- A test chat interface of the models
- Package for Docker, dokku and Heroku deployment