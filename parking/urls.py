from django.conf.urls import include, url
from django.contrib import admin
from . import views
 
urlpatterns = [
    url(r'^$', views.index_redirect, name='index_redirect'),
    url(r'^users/', include('users.urls')),
    url(r'^admin/', admin.site.urls),
]
