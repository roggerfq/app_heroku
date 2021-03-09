from django.db import models
import json
from django.utils import timezone 
# Create your models here.
from django.contrib.auth.models import User

class Member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nameorganization=models.CharField(max_length=30)
    lat = models.FloatField()
    lon = models.FloatField()
    zoom_level = models.IntegerField()
 
    def __str__(self):
        return self.nameorganization

    def to_json(self):
        obj = self.get_dict()
        return json.dumps(obj)
        
    def get_dict(self):
        obj = dict()
        obj['id'] = self.user.id
        obj['nameorganization'] = self.nameorganization
        obj['lat'] = self.lat
        obj['lon'] = self.lon
        obj['zoom_level'] = self.zoom_level
        parkingLots = ParkingLot.objects.filter(member=self)
        obj['parkingLots'] = dict()
        for parkingLot in  parkingLots.iterator():
            obj['parkingLots'][parkingLot.id_local] = parkingLot.get_dict()

        return obj

class ParkingLot(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    id_local = models.IntegerField()

    url_video = models.CharField(max_length=100)
    #map information
    lat = models.FloatField()
    lon = models.FloatField()
    zoom_level = models.IntegerField()
    #pub_date = models.DateField()
    pub_date = models.DateTimeField(auto_now_add=True)

    def get_dict(self):
        obj = dict()
        obj['id_local'] = self.id_local
        obj['url_video'] = self.url_video
        obj['lat'] = self.lat
        obj['lon'] = self.lon
        obj['zoom_level'] = self.zoom_level
        obj['coordinates'] = dict()
        coordinates = Coordinate.objects.filter(parkingLot=self)
        for coordinate in coordinates.iterator():
            obj['coordinates'][coordinate.id_local] = coordinate.get_dict()

        return obj
        

class Coordinate(models.Model):
    parkingLot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE)
    id_local = models.IntegerField()

    lat = models.FloatField()
    lon = models.FloatField()
    polygon = models.CharField(max_length=200)
    status = models.BooleanField()   

    def set_polygon(self, str_polygon):
        self.polygon = json.dumps(str_polygon)

    def get_polygon():
        return json.loads(self.polygon)

    def get_dict(self):
        obj = dict()
        obj['id'] = self.id
        obj['id_local'] = self.id_local
        obj['lat'] = self.lat
        obj['lon'] = self.lon
        obj['polygon'] = self.polygon
        return obj

class Setting(models.Model):
    key = models.CharField(max_length=100, default="")
    value = models.CharField(max_length=100, default="")
    
    def get_dict(self):
        obj = dict()
        obj[key] = value

    def to_json(self):
        obj = self.get_dict()
        return json.dumps(obj)
 
    def __str__(self):
        return self.key

