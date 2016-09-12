from django.db import models

class BaseModel(models.Model):
    """ The Basic Model Everything Extends, gives us some fun methods and properties"""

    created_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    @classmethod
    def get_random_number_of(cls, number_of):
        ''' Returns a random list of objects /number_of/ long '''
        return cls.objects.order_by('?')[:number_of].all()
