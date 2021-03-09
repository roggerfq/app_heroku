from django.conf.urls import url
from . import views
 
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^login/$', views.login, name='login'),
    url(r'^register/$', views.register, name='register'),
    url(r'^logout/$', views.logout, name='logout'),
    url(r'^home/$', views.home, name='home'),
    url(r'^update/$', views.update, name='update'),
    url(r'^worker/$', views.worker, name='worker'),
    url(r'^worker/getAllUserData$', views.getAllUserData, name='getAllUserData'),
    url(r'^worker/getUserData$', views.getUserData, name='getUserData'),
    url(r'^map/$', views.map, name='map'),
]
