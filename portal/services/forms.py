from django import forms

 
class UploadFileForm(forms.Form):
    docfile = forms.FileField(
        label='Select a file'
    )
    class Meta:
        model = 'UploadFile'
        fields = '__all__' # Or a list of the fields that you want to include in your form