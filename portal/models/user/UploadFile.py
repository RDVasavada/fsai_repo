from django.db import models
 
 
class UploadFile(models.Model):
   docfile = models.FileField(upload_to='documents/%Y/%m/%d')
   def __str__(self):
      return str(self.docfile) 

    