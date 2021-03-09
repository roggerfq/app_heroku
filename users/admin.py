from django.contrib import admin

# Register your models here.
#from .models import Users

from .models import Member, ParkingLot, Coordinate, Setting
admin.site.register(Member)
admin.site.register(ParkingLot)
admin.site.register(Coordinate)
admin.site.register(Setting)
