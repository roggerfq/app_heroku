from django.shortcuts import render, redirect, HttpResponseRedirect
from .models import Member, ParkingLot, Coordinate, Setting

#from .models import Users
from django.contrib.auth.models import User
# Create your views here.
from django.http import HttpResponse

#from django.contrib import auth
from django.contrib.auth import authenticate
from django.contrib.auth import login as do_login
from django.contrib.auth import logout as do_logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserCreationForm

import json

def index(request):
    if request.method == 'POST':
        #user = User(nameorganization=request.POST['nameorganization'], username=request.POST['username'], password=request.POST['password'], lat=request.POST['lat'], lon=request.POST['lon'], zoom_level=request.POST['zoom_level'])
        user = User.objects.create_user(username=request.POST['username'], email=request.POST['email'], password=request.POST['password'])
        user.save()
        #return redirect('/')
        #user = Users.objects.get(username=request.POST['username'], password=request.POST['password'])
        print(user)
        return render(request, 'users/home.html', {'member': user})
    else:
        return render(request, 'users/index.html')
 
def login(request):
    print(request)
    if request.method == 'POST':
       print("post")
            
       username = request.POST['username']
       password = request.POST['password']
       print(username)
       print(password)

       form = AuthenticationForm()
       form = AuthenticationForm(data=request.POST)
       if(form.is_valid()):
          username = form.cleaned_data['username']
          password = form.cleaned_data['password']
          user = authenticate(username=username, password=password)
          if user is not None:
             do_login(request, user)
             if(user.is_superuser):
                return redirect('/admin')
             else:
                return redirect('/users/home')
          
       context = {'msg': 'Invalid username or password'}
       return render(request, 'users/login.html', context)

    return render(request, 'users/login.html')

def register(request):

    if request.method == 'POST':
        print("post in register")
        ############here we must create new user#############
        
        print(request.POST)
         
        user = User.objects.create_user(username=request.POST['username'], email=request.POST['email'], password=request.POST['password'])
        #user.save()
       
        nameorganization = request.POST['nameorganization']
        lat = float(request.POST['lat'])
        lon = float(request.POST['lon'])
        zoom_level = int(request.POST['zoom_level'])
        print(nameorganization)
        print(lat)
        print(lon)
        print(zoom_level)
        member = Member(user = user, nameorganization = nameorganization, lat = lat, lon = lon, zoom_level = zoom_level)
        
        member.save()
        #####################################################

        return redirect('/users/login')    
    else:
        if(request.user.is_authenticated):
           return redirect('/users/home')
        else:
           return render(request, 'users/register.html')    


def logout(request):
    do_logout(request)
    print(request.user)
    print(request.user.is_authenticated)
    return redirect('/users/login')




def home(request):
    print(request.user)
    print(request.user.is_authenticated)
    if(request.user.is_authenticated):
        user = User.objects.get(id=request.user.id)
        if(user.is_superuser):
            return redirect('/admin')
        else:
            print("email:" + str(user.email))
            member = Member.objects.get(user=user)
            data =  member.to_json()

            dict_settings = dict()
            for setting in  Setting.objects.all():
                dict_settings[setting.key] = setting.value

            settings = json.dumps(dict_settings)

            return render(request, 'users/app.html', {'user': user, 'member': member, 'data': data, 'settings': settings})
    else:
        return redirect('/users/login')


def update(request):

    if(request.method == 'POST'):

            if(request.user.is_authenticated):
                
               data = json.loads(request.POST['data'])

               listParkingLots = data['data_listParkingLots']

               user = User.objects.get(id=request.user.id)
               member = Member.objects.get(user=user)
 
               listParkingLotsNotRemove = []
               for data_parkingLot in listParkingLots:
                   #print(parkingLot)
                   id_local = data_parkingLot['id']
                   listParkingLotsNotRemove.append(id_local)
                   url_video = data_parkingLot['str_url'] 
                   lat = data_parkingLot['coordinate'][0]
                   lon = data_parkingLot['coordinate'][1]
                   zoom_level = data_parkingLot['zoom']

                   try:
                          #if object exist then only modify it
                          parkingLot = ParkingLot.objects.get(member=member, id_local=id_local)
                          parkingLot.lat = lat
                          parkingLot.lon = lon
                          parkingLot.zoom_level = zoom_level
                          parkingLot.save()

                   except ParkingLot.DoesNotExist:
                          print("new ParkingLot")
                          parkingLot = ParkingLot(member=member, id_local=id_local, url_video=url_video, lat=lat, lon=lon, zoom_level=zoom_level)
                          parkingLot.save()

                   listPoly = data_parkingLot['listPoly']
                   #print(listPoly)

                   listCoordinatesNotRemove = []

                   for data_poly in listPoly:
                       print(data_poly)
                       id_local = data_poly['id']
                       listCoordinatesNotRemove.append(id_local)
                       lat = data_poly['lat']
                       lon = data_poly['lon']
                       print(lat)
                       print(lon)
                       polygon = data_poly['polyPoints']
                       status = False
                        
                       try:
                              #if object exist then only modify it
                              coordinate = Coordinate.objects.get(parkingLot=parkingLot, id_local=id_local)
                              coordinate.lat = lat
                              coordinate.lon = lon
                              coordinate.polygon = polygon
                              coordinate.save()

                       except Coordinate.DoesNotExist:
                              print("new coordinate")
                              coordinate = Coordinate(parkingLot=parkingLot, id_local=id_local, lat=lat, lon=lon, polygon=polygon, status=status)
                              coordinate.save()

                   #removing coordinates
                   set_coordinates = Coordinate.objects.filter(parkingLot=parkingLot)
                   #listCoordinatesRemove = []
                   for coordinate in set_coordinates.iterator():
                       if(coordinate.id_local not in listCoordinatesNotRemove):
                          tmp = Coordinate.objects.get(parkingLot=parkingLot, id_local=coordinate.id_local)
                          tmp.delete()
                          #listCoordinatesRemove.append(coordinate.id_local)



               #removing parking lots
               set_parkingLots =  ParkingLot.objects.filter(member=member)
               #listParkingLotsRemove = []
               for parkingLot in set_parkingLots.iterator():
                   if(parkingLot.id_local not in listParkingLotsNotRemove):
                      tmp = ParkingLot.objects.get(member=member, id_local=parkingLot.id_local)
                      tmp.delete()
                      #listParkingLotsRemove.append(parkingLot.id_local)

               #print(listParkingLotsNotRemove)
               #print(listParkingLotsRemove)
               data = member.to_json()
               return HttpResponse(data)

            else:
                return redirect('/users/login')

    else:

       return redirect('/users/home')



def worker(request):
    print("loading worker")
        
    members = Member.objects.all()
    data_members = dict()
    for member in members:
        data_members[member.user.id] = member.get_dict()

    data = json.dumps(data_members)
     
    return render(request, 'users/worker.html', {'data': data})    


def getAllUserData(request):

    data_request= json.loads(request.POST['data'])

    members = Member.objects.all()
    data_members = dict()
    for member in members:
        data_members[member.user.id] = member.get_dict()

    data = json.dumps(data_members)
    return HttpResponse(data)

def getUserData(request):

    data_request= json.loads(request.POST['data'])
    id_user = data_request["id"]
    print(id_user)

    user = User.objects.get(id= id_user)
    print("email:" + str(user.email))
    member = Member.objects.get(user=user)
    msg =  member.to_json()
    

    return HttpResponse(msg)


def map(request):
    setting = Setting.objects.get(key="url_geo_server")
    print(setting.value)
    return redirect(setting.value);














