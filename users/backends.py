from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User

class PersonalizedLoginBackend:
    """
    Authenticate against the settings ADMIN_LOGIN and ADMIN_PASSWORD.

    Use the login name and a hash of the password. For example:

    ADMIN_LOGIN = 'admin'
    ADMIN_PASSWORD = 'pbkdf2_sha256$30000$Vo0VlMnkR4Bk$qEvtdyZRWTcOsCnI/oQ7fVOu1XAURIZYoOZ3iq8Dr4M='
    """

    def authenticate(self, request, username=None, password=None):
        print("ffffffffff")
        try:
             print("existe")
             #user = User.objects.get(username=username)
             user = User.objects.get(username=request.POST['username'], password=request.POST['password'])
             
        except User.DoesNotExist:
             print("noooo  existe")
             '''
                # Create a new user. There's no need to set a password
                # because only the password from settings.py is checked.
             user = User(username=username)
             user.is_staff = True
             user.is_superuser = True
             user.save()
             '''
             user = None
             
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
