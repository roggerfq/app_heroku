
//_________ important !______________
var principal_coordinate = [principal_lat, principal_lon];
var default_zoom_level = df_zoom_level;
//___________________________________

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 22,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/streets-v11',
	tileSize: 512,
	zoomOffset: -1
});

//latlng = L.latLng(3.3487, -76.5316);
//var map = L.map('map', {center: latlng, zoom: 15, layers: [tiles]});
var map = L.map('map', {center: principal_coordinate, zoom: default_zoom_level, layers: [tiles]});




















//_________________________________________________________________________________________//

   function removePolygon(id){

      console.log("delete:" + id);
      var pos_absolute = offset_carousel + pos_carousel;
      listParkingLots[pos_absolute].removePolygon(id);

   }

   function selectCoordinate(id, flag){

      var pos_absolute = offset_carousel + pos_carousel;
      listParkingLots[pos_absolute].selectCoordinate(id, flag);
   }


   function completePolygon(polyPoints, id) {


         function alterPolygon() {
           
	      //if (isDrawing === true) return;
	      var alteredPoints = [];
	      var selectedP = d3.select(this);
	      var parentNode = d3.select(this.parentNode);

	      //select only the elements belonging to the parent <g> of the selected circle
	      var circles = d3.select(this.parentNode).selectAll('circle');
	      var polygon = d3.select(this.parentNode).select('polygon');


          

	      var pointCX = d3.event.x;
	      var pointCY = d3.event.y;

	      //rendering selected circle on drag
	      selectedP.attr("cx", pointCX).attr("cy", pointCY);

	      //loop through the group of circle handles attatched to the polygon and push to new array
	      for (var i = 0; i < polyPoints.length; i++) {

		var circleCoord = d3.select(circles._groups[0][i]);
		var pointCoord = [circleCoord.attr("cx"), circleCoord.attr("cy")];
		alteredPoints[i] = pointCoord;
                
	      }
            


	      //re-rendering polygon attributes to fit the handles
	      polygon.attr("points", alteredPoints);

	      bbox = parentNode._groups[0][0].getBBox();

        }


      var dragBehavior = d3.drag().on("drag", alterPolygon);



      
      gPoly = svgCanvas.append('g')
        .classed("polygon", true);
     
      //important
      gPoly.attr("id",id);

//_________________________important for deleting________________________________
      gPoly.on("mousedown", function(){

       if(flag_delete_poly)
          removePolygon(this.id);

     });

      gPoly.on("mouseover", function(){

         selectCoordinate(this.id, true);

      });


      gPoly.on("mouseout", function(){

         selectCoordinate(this.id, false);

      });
//________________________________________________________________________________

      polyEl = gPoly.append("polygon")
        .attr("points", polyPoints);

      for (var i = 0; i < polyPoints.length; i++) {
        gPoly.append('circle')
          .attr("cx", polyPoints[i][0])
          .attr("cy", polyPoints[i][1])
          .attr("r", 4)
          .call(dragBehavior);
      }


      gPoly.datum({
        x: 0,
        y: 0
      })

      gPoly.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"
      });

      
      gPoly.call(d3.drag().on("drag", function(d) {
        d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")")
      }));



    }



//______________________icons markers_________________

var freeIcon = new L.Icon({
  iconUrl: IMG_URL + 'marker-icon-2x-green.png',
  shadowUrl: IMG_URL + 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


var busyIcon = new L.Icon({
  iconUrl: IMG_URL + 'marker-icon-2x-red.png',
  shadowUrl: IMG_URL + 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});



var selectIcon = new L.Icon({
  iconUrl: IMG_URL + 'marker-icon-2x-orange.png',
  shadowUrl: IMG_URL + 'marker-shadow.png',
  iconSize: [1.5*25, 1.5*41],
  iconAnchor: [1.5*12, 1.5*41],
  popupAnchor: [1, -34],
  shadowSize: [1.5*41, 1.5*41]
});


//______________________free markers_________________

/*

var intervalId = window.setInterval(function(){

  for(var i = 0; i < listParkingLots.length; i++){
     var parkingLot = listParkingLots[i];
     listPoly = parkingLot.listPoly;
     for(var j = 0; j < listPoly.length; j++){

         listPoly[j].setFree(Math.random() > 0.5);

     }
  }
   

}, 5000);

*/



class Poly{

    constructor(polyPoints, markers, coordinate, parkingLotParent, id){
    
        this.polyPoints = polyPoints;
        this.parkingLotParent = parkingLotParent;
        this.id = "poly_" + id.toString();
        this.nid = id;
        this.markers = markers;
        this.coordinate = coordinate;
        
        map.addLayer(this.markers);
 

        this.m_free = new L.Marker(this.coordinate);
        this.m_busy = new L.Marker(this.coordinate);
        this.m_select = new L.Marker(this.coordinate, {draggable: true});
        this.m_free.setIcon(freeIcon);
        this.m_busy.setIcon(busyIcon);
        this.m_select.setIcon(selectIcon);

        this.m_select.flag_free = true;
        this.m_select.flag_over = false;

        

        this.m_free.setOpacity(1);
        this.m_busy.setOpacity(0);
        this.m_select.setOpacity(0);
        this.m_select.m_free = this.m_free;
        this.m_select.m_busy = this.m_busy;
        this.m_select.id = this.id;
        this.m_select.parkingLotParent = this.parkingLotParent;
	this.m_select.on('mouseover', function(e) {

                console.log("mouseover");
                this.m_free.setOpacity(0);
                this.m_busy.setOpacity(0);
                this.setOpacity(1);
	        this.flag_over = true;
 
                if(this.parkingLotParent.flag_show == true)
                  d3.select("#"+this.id+" > polygon").style("fill", "orange");
           
	});


        
        this.m_select.on('mouseout', function (e) {
                console.log("mouseout");
                this.setOpacity(0);
                this.m_free.setLatLng(this.getLatLng());
                this.m_busy.setLatLng(this.getLatLng());
                this.m_free.setZIndexOffset(-1);
                this.m_busy.setZIndexOffset(-1);

	        if(this.flag_free){
		   this.m_free.setOpacity(1);
		   this.m_busy.setOpacity(0);
	        }else{
		   this.m_free.setOpacity(0);
		   this.m_busy.setOpacity(1);
	        }

                this.flag_over = false;

                if(this.parkingLotParent.flag_show == true){

                   //d3.select("#"+this.id+" > polygon").style("fill", "");
                   if(this.flag_free)
                      d3.select("#"+this.id+" > polygon").style("fill", "green");
                   else
                      d3.select("#"+this.id+" > polygon").style("fill", "red");

                }
      
        });
        

        this.markers.addLayer(this.m_free);
        this.markers.addLayer(this.m_busy);
        this.markers.addLayer(this.m_select);
        

    }

    draw(){

      completePolygon(this.polyPoints, this.id);
      this.setIcon(); //important

    }


    setIcon() {
      if(this.m_select.flag_free){
         this.m_free.setOpacity(1);
         this.m_busy.setOpacity(0);
         if(this.parkingLotParent.flag_show == true)
            d3.select("#"+this.id+" > polygon").style("fill", "green");
       }else{
         this.m_free.setOpacity(0);
         this.m_busy.setOpacity(1);
         if(this.parkingLotParent.flag_show == true)
           d3.select("#"+this.id+" > polygon").style("fill", "red");
       }

    }

    setFree(flag_free = true) {

        this.m_select.flag_free = flag_free;
      
        if(this.m_select.flag_over == false)
           this.setIcon();

     }


    select(flag) {

      if(flag){
         this.m_free.setOpacity(0);
         this.m_busy.setOpacity(0);
         this.m_select.setOpacity(1);
         d3.select("#"+this.id+" > polygon").style("fill", "orange");
      }else{
         this.m_select.setOpacity(0);
         this.setIcon();
         //d3.select("#"+this.id+" > polygon").style("fill", "");
      }

    }

    update() {

      console.log("update polygons")

      var new_points = $("#"+this.id).find("polygon").attr("points").split(',');
      //console.log($("#"+this.id).find("polygon").attr("points"));
      for(var i = 0; i < this.polyPoints.length; i++){
         //console.log( Number(new_points[2*i]));
         //console.log( Number(new_points[2*i + 1]));
         if(isNaN(Number(new_points[2*i])) || isNaN(Number(new_points[2*i + 1])))
            break;
         this.polyPoints[i][0] = Number(new_points[2*i]);
         this.polyPoints[i][1] = Number(new_points[2*i + 1]);
      }


      //update points
      var transform = $("#"+this.id).attr("transform");
      var x = Number(transform.split(',')[0].split('(')[1]);
      var y = Number(transform.split(',')[1].split(')')[0]);

      //console.log("("+x.toString()+","+y.toString()+")")

      for(var i = 0; i < this.polyPoints.length; i++){
         this.polyPoints[i][0] = this.polyPoints[i][0] + x;
         this.polyPoints[i][1] = this.polyPoints[i][1] + y;
      }
 
    }

    hide() {

      this.update(); //updating transformation and points


      //removing polygon
      $("#"+this.id).remove();

    }

    remove() {
      
       //__________removing polygon (deleting)_____________
       /*
         This is necesary to avoid: Cannot read property 'ownerSVGElement' of null
         please check: https://stackoverflow.com/questions/42076672/removing-svg-element-in-d3-that-is-draggable-results-in-cannot-read-property-ow       

       */
       d3.select("#"+this.id).on('mousedown.drag', null);
       d3.select("#"+this.id).remove();
       //________________________________________
      
       //remove coordinate 
       this.markers.removeLayer(this.m_free);
       this.markers.removeLayer(this.m_busy);
       this.markers.removeLayer(this.m_select);
   
    }

}




var id_count = 0;
var offset_carousel = 0;
var pos_carousel = 0;
var n_carousel = 5;
var listParkingLots=[];

//__________________________________initialize user________________________________________________________


//____________________HERE WE CREATE THE SOCKET TO COMMUNICATE WITH THE WORKER SERVICE______________________________



      function update_lookup_table_coordinates(json_data){

                lookup_table_coordinates = {}

                var data_parkingLots = json_data['parkingLots'];
                for(var id_local_p in data_parkingLots){
                    //console.log("_________id_local_p____________")
                    //console.log(id_local_p)
                    lookup_table_coordinates[id_local_p] = {}
                    var data_parkingLot = data_parkingLots[id_local_p];
                    var data_coordinates = data_parkingLot['coordinates'];
                    for(var id_local_c in data_coordinates){ 
                      var data_coordinate = data_coordinates[id_local_c]; 
                      lookup_table_coordinates[id_local_p][id_local_c] = data_coordinate['id'];
                      //console.log(data_coordinate)

                    }
                }

                console.log(lookup_table_coordinates);


      }
	
      

      //var socket_parkingLot = io.connect('http://127.0.0.1:5000/parkingLot', { transports: ['websocket'] });
      var socket_parkingLot = io.connect(settings['url_geo_server'] + '/' + settings['namespace_parkingLot'], { transports: ['websocket'] });

      socket_parkingLot.on('start', function(data) {

         console.log('parking lot user connected');

      });

      
      socket_parkingLot.on('update', function(data) {

           console.log('update parking lot user');

           list_id_server = [];
           for(var id_local_p in lookup_table_coordinates){
              for(var id_local_c in lookup_table_coordinates[id_local_p]){
                     
                 list_id_server.push(lookup_table_coordinates[id_local_p][id_local_c]);

              }
           }
               
           //console.log(lookup_table_coordinates);
           console.log(list_id_server);
           socket_parkingLot.emit('get_state', list_id_server);     


      });


      socket_parkingLot.on('updateParkingLots', function(json_data) {

         console.log('updateParkingLots');
         data = json_data['data'];
         //console.log(data);
         //console.log(lookup_table_coordinates)

         for(var i = 0; i < listParkingLots.length; i++){
            var parkingLot = listParkingLots[i];
            var id_local_p = parkingLot.id;
            listPoly = parkingLot.listPoly;
            for(var j = 0; j < listPoly.length; j++){             
               var id_local_c = listPoly[j].nid;
               var id_server = lookup_table_coordinates[id_local_p][id_local_c];
               if(id_server in data){
                  var flag_free = data[id_server][2];
                  listPoly[j].setFree(flag_free);
               }
            }
         }


      });


//__________________________________________________________________________________________________________________




function initializeCoordinates(parkingLot, data_coordinates){

    var max_id_local = -1;
    for(var id_local in data_coordinates){ 
 
       
       var data_coordinate = data_coordinates[id_local];  
       var id = parseInt(id_local);
       var lat = data_coordinate['lat'];  
       var lon = data_coordinate['lon'];
       var polygon = JSON.parse(data_coordinate['polygon']);  

       console.log(id)
       console.log(lat)
       console.log(lon)
       //console.log(polygon)

       parkingLot.addPoly(polygon, false, id, [lat, lon]);

 
       if(id > max_id_local)
          max_id_local = id;

    }

    //restore id_poly (it is no required to add 1)
    parkingLot.id_poly = max_id_local;

}


function initialize(){


    console.log("initializing");

    var data_parkingLots = json_data['parkingLots'];

    console.log(data_parkingLots);

    var max_id_local = -1;

    for(var id_local in data_parkingLots){

      var data_parkingLot = data_parkingLots[id_local];
      var id = parseInt(id_local);
      var str_url = data_parkingLot['url_video'];
      var coordinate = [data_parkingLot['lat'], data_parkingLot['lon']];
      var zoom = data_parkingLot['zoom_level'];
      
      console.log(id_local);
      /*
      console.log(str_url);
      console.log(coordinate);
      console.log(zoom);
      */

      var parkingLot = new ParkingLot(str_url, coordinate, id, zoom);

      var data_coordinates = data_parkingLot['coordinates'];
      initializeCoordinates(parkingLot, data_coordinates);

      listParkingLots.push(parkingLot);

      if(id > max_id_local)
        max_id_local = id;
     
    }

    //restore id_count
    id_count = max_id_local + 1; 


    if(listParkingLots.length <= n_carousel){
       fillCarousel(listParkingLots);
       offset_carousel = 0;
       pos_carousel = listParkingLots.length - 1;
    }else{
       fillCarousel(listParkingLots.slice(listParkingLots.length - n_carousel, listParkingLots.length));
       offset_carousel = listParkingLots.length - n_carousel;
       pos_carousel = n_carousel - 1;
    }

    if(listParkingLots.length > 0)
       focusCarousel($("#l"+(pos_carousel+1).toString()).closest("li"));


    update_lookup_table_coordinates(json_data);

}


//________________________________________________________________________________________________________





//definition at starting of this file
//var principal_coordinate = [3.3487, -76.5316];
//var default_zoom_level = 18;



class ParkingLot {

  constructor(str_url, coordinate, id = -1, zoom = -1) {
    this.str_url = str_url;
    this.flag_show = true;
    this.markers = L.markerClusterGroup({disableClusteringAtZoom: 0});//group coordinates in map for this parking lot
    this.coordinate = coordinate.slice(); //for copy list

    if(zoom == -1)
       this.zoom = default_zoom_level;
    else
       this.zoom = zoom;

    this.listPoly = [];
    this.id_poly = 0;


    if(id == -1){
       this.id = id_count;
       id_count += 1;
      //console.log(id_count);
    }else{
       this.id = id;
    }



    /* 
      this was necesary because the the video url does not load immediately, so the width and the height readed from the img-video
      was erroneous. The solution was wait the loading of url and hten read those values. This is used the first time, in subsequent 
      calls to show method the stored values are used. 
    */

    this.flag_svgSize = false;
    var img = new Image();
    img.obj = this;
    img.onload = function(obj) { 

	     var imgVideo = document.getElementById("img-video");
             this.obj.width = imgVideo.offsetWidth;
             this.obj.height = imgVideo.offsetHeight;
             $("#mainSvg").width(imgVideo.offsetWidth).height(imgVideo.offsetHeight);
             this.obj.flag_svgSize = true;
    
    }
    img.src = this.str_url;


   //map.panTo(new L.LatLng(this.coordinate[0], this.coordinate[1]), this.zoom);
   map.flyTo([this.coordinate[0], this.coordinate[1]], this.zoom)

  }

  // Methods

  drawPolygons() {
   
    for(var i = 0; i < this.listPoly.length; i++){

      this.listPoly[i].draw();

    }


  }


  show() {
      
    this.flag_show = true; //is necesary set flag_show in order to set the color of the polygons

    $("#img-video").attr("src", this.str_url);

     if(this.flag_svgSize == true){
        $("#mainSvg").width(this.width).height(this.height);
     }



    //remove before polygons
    //$("#mainSvg").empty();

    this.drawPolygons();
    
    //map.panTo(new L.LatLng(this.coordinate[0], this.coordinate[1]),this.zoom);
    map.flyTo([this.coordinate[0], this.coordinate[1]], this.zoom);
    
    //this.flag_show = true;
  }


  hide() {


    for(var i = 0; i < this.listPoly.length; i++){

      this.listPoly[i].hide();
       
    }

    this.zoom = map.getZoom();
    this.coordinate[0] = map.getCenter().lat;
    this.coordinate[1] = map.getCenter().lng;

     this.flag_show = false;

  }

  
  update () {

    this.zoom = map.getZoom();
    this.coordinate[0] = map.getCenter().lat;
    this.coordinate[1] = map.getCenter().lng;

    for(var i = 0; i < this.listPoly.length; i++){

      this.listPoly[i].update();
       
    }

  }


  addPoly(polyPoints, flag_show = true, id_poly = -1, coordinate = [map.getCenter().lat, map.getCenter().lng]) {

    if(id_poly == -1)
       this.id_poly += 1;
    else
       this.id_poly = id_poly

    var poly = new Poly(polyPoints, this.markers, coordinate, this, this.id_poly);
    if(flag_show == true)
       poly.draw();
    this.listPoly.push(poly);

  }

  removePolygon(id) {
    //remember: here id is poly_id
    var flag_poly_exist = false;
    var index = 0;
    for(var i = 0; i < this.listPoly.length; i++){
       if(this.listPoly[i].id == id){
          index = i;
          flag_poly_exist = true;
       }
    }

    if(flag_poly_exist){
       this.listPoly[index].remove();
       this.listPoly.splice(index, 1);
    }

  }

  remove(){
  
    for(var i = 0; i < this.listPoly.length; i++)
       this.listPoly[i].remove();

  }


  selectCoordinate(id, flag) {

    //remember: here id is poly_id
    var flag_poly_exist = false;
    var index = 0;
    for(var i = 0; i < this.listPoly.length; i++){
       if(this.listPoly[i].id == id){
          index = i;
          flag_poly_exist = true;
       }
    }

    if(flag_poly_exist)
       this.listPoly[index].select(flag);
    
  }

  debug() {
  
     console.log("____________")
     console.log(this.str_url);
     console.log("____________")

  }
  
}








//------------------------------init or fill carousel-----------------------------------


function fillCarousel(list = []){

  if(list.length == 0){

	  for(var i = 0; i < n_carousel; i++) {

	     $("#l"+(i+1).toString()).attr("src", "http://via.placeholder.com/226x126/000000/?text=No video");
	   
	  }

  }else if (list.length <= n_carousel) {

    for(var i = 0; i < list.length; i++) {

	     $("#l"+(i+1).toString()).attr("src", list[i].str_url);
	   
    }

    for(var i = list.length; i < n_carousel; i++) {

	     $("#l"+(i+1).toString()).attr("src", "http://via.placeholder.com/226x126/000000/?text=No video");
	   
    }


  }

  

}


//---next and back carousel------

//obj carousel
var beforeobjFocus = "";
var beforeParkingLotObj = "";
function focusCarousel(obj = ""){

 if(beforeobjFocus)
    beforeobjFocus.removeClass("active");

 if(obj){
   obj.addClass("active");
   beforeobjFocus = obj;  

   var pos_absolute = offset_carousel + pos_carousel;
   if(listParkingLots[pos_absolute].id != beforeParkingLotObj.id){
     if(beforeParkingLotObj != "")
        beforeParkingLotObj.hide(); //is necesary to recuperate the transformation and dots of polygons
      listParkingLots[pos_absolute].show();
   }
   beforeParkingLotObj = listParkingLots[pos_absolute];

 }else{

    $("#img-video").attr("src", "http://via.placeholder.com/800x454/000000/?text=No video");
    $("#mainSvg").empty();
    beforeobjFocus = "";
    beforeParkingLotObj = "";

 }

}


 $(".small-video").click(function() {
   
    var pos = parseInt($(this).attr('id').charAt(1)) - 1;

    if(typeof listParkingLots[offset_carousel + pos] != 'undefined') {

       pos_carousel = pos;
       focusCarousel($("#l"+(pos_carousel+1).toString()).closest("li"));
       
    }
   

 });


$("#btn-back").click(function(){


        if((offset_carousel > 0) && (pos_carousel == 0) )
           offset_carousel = offset_carousel - 1;

	pos_carousel = pos_carousel - 1;
        if(pos_carousel <= 0){
          
           pos_carousel = 0;
 
        }

        
        console.log(offset_carousel)
        console.log(pos_carousel)
        

        if(listParkingLots.length > 0)
          focusCarousel($("#l"+(pos_carousel+1).toString()).closest("li"));
        /*
        if(listParkingLots.length > n_carousel)
           fillCarousel(listParkingLots.slice(offset_carousel, offset_carousel + n_carousel));
        */

        
         var max_pos = Math.min(n_carousel, listParkingLots.length - offset_carousel);
         fillCarousel(listParkingLots.slice(offset_carousel, offset_carousel + max_pos));

});


$("#btn-next").click(function(){


        if((offset_carousel < listParkingLots.length - n_carousel) && (pos_carousel == n_carousel - 1))
           offset_carousel = offset_carousel + 1;

        pos_carousel = pos_carousel + 1;
        var max_pos = Math.min(n_carousel, listParkingLots.length - offset_carousel);
	if(pos_carousel >= max_pos)
	   pos_carousel = max_pos - 1;

        console.log(pos_carousel)
        console.log(offset_carousel)

        if(listParkingLots.length > 0)
          focusCarousel($("#l"+(pos_carousel+1).toString()).closest("li"));
        if(listParkingLots.length > n_carousel)
           fillCarousel(listParkingLots.slice(offset_carousel, offset_carousel + n_carousel));

});

//--------------------------------------------------------------------------------------













$("#btn-addNewParkingLot").click(function(){
            $("#str-url").val("");
            $("#myModal").modal('show');
        });

$("#modal-save").click(function(){

            //console.log($("#str-url").val());
            
            var parkingLot = new ParkingLot($("#str-url").val(), principal_coordinate); 
            listParkingLots.push(parkingLot);
  
            if(listParkingLots.length <= n_carousel){
               fillCarousel(listParkingLots);
               offset_carousel = 0;
               pos_carousel = listParkingLots.length - 1;
            }else{
               fillCarousel(listParkingLots.slice(listParkingLots.length - n_carousel, listParkingLots.length));
               offset_carousel = listParkingLots.length - n_carousel;
               pos_carousel = n_carousel - 1;
            }

            focusCarousel($("#l"+(pos_carousel+1).toString()).closest("li"));
            
   

            $("#myModal").modal('toggle');

        });


$("#modal-close").click(function(){
            $("#myModal").modal('toggle');
        });


$("#btn-delParkingLot").click(function(){


        var pos_absolute = offset_carousel + pos_carousel;
        if(typeof listParkingLots[pos_absolute] != 'undefined'){ 
           console.log("existe");
           listParkingLots[pos_absolute].remove();
           beforeParkingLotObj = ""; //important for avoid call to hiden method of the previous deleted parkingLot in focusCarousel()
           listParkingLots.splice(pos_absolute, 1);//this clean all memory
        }
        

        if(typeof listParkingLots[pos_absolute] != 'undefined') {

           console.log("position do not change");
           fillCarousel(listParkingLots.slice(offset_carousel));
           focusCarousel($("#l"+(pos_carousel+1).toString()).closest("li"));

        }else if(pos_carousel > 0){
            console.log("pos_carousel > 0");
            pos_carousel = pos_carousel - 1;
            var pos_absolute = offset_carousel + pos_carousel;
            if(typeof listParkingLots[pos_absolute] != 'undefined'){
           
              fillCarousel(listParkingLots.slice(offset_carousel));
              focusCarousel($("#l"+(pos_carousel+1).toString()).closest("li"));

            }
        }else if(offset_carousel > 0){
            console.log("offset_carousel > 0");
            offset_carousel = offset_carousel - 1;
            var pos_absolute = offset_carousel + pos_carousel;
            if(typeof listParkingLots[pos_absolute] != 'undefined'){

              fillCarousel(listParkingLots.slice(offset_carousel));
              focusCarousel($("#l"+(pos_carousel+1).toString()).closest("li"));

            }
        }else{
            console.log("empty");
            fillCarousel();
            focusCarousel(); //defocus
        }

 
        console.log("_______________final________________");
        console.log(offset_carousel);
        console.log(pos_carousel);
        console.log("longitud");
        console.log(listParkingLots.length);
        for(var i  = 0; i < listParkingLots.length; i++){
           console.log("index: "+i.toString());
           console.log(listParkingLots[i]);
        }
        console.log("_____________________________________");       

        });




$("#btn-update").click(function(){

   console.log("update");
   console.log(beforeParkingLotObj);
   console.log("______");
   //importante
   if(beforeParkingLotObj != "")
      beforeParkingLotObj.update();


   data = {};
   data_listParkingLots = [];




  for(var i = 0; i < listParkingLots.length; i++){
     var parkingLot = listParkingLots[i];

     var data_parkingLot = {};
     data_parkingLot.str_url = parkingLot.str_url;
     data_parkingLot.id = parkingLot.id;
     data_parkingLot.coordinate = parkingLot.coordinate;
     data_parkingLot.zoom = parkingLot.zoom;

     data_parkingLot.listPoly = [];

     var listPoly = parkingLot.listPoly;
     for(var j = 0; j < listPoly.length; j++){

         var data_poly = {};
         data_poly.id = listPoly[j].nid;
         var coordinate = listPoly[j].m_select.getLatLng();
         //console.log(coordinate);
         data_poly.lat = coordinate.lat;
         data_poly.lon = coordinate.lng;
         data_poly.polyPoints = listPoly[j].polyPoints;

         data_parkingLot.listPoly.push(data_poly);

     }
 
     data_listParkingLots.push(data_parkingLot);

  }

   
   data.data_listParkingLots = data_listParkingLots;

   
   //console.log(JSON.stringify(data));


   $.ajax({
      type: "POST",
      url: UPDATE_URL,
      data: {data: JSON.stringify(data), csrfmiddlewaretoken: csrfmiddlewaretoken},
      success: function (json_data_from_server) {
         //console.log(data);

         msg = "Datos actualizados correctamente";
         $("#info-text").html(msg);
	 $("#info").modal('show');

          
         //here we must update working service
         var json_data = JSON.parse(json_data_from_server.replace(/&quot;/g, '"'))
         update_lookup_table_coordinates(json_data); //for update lookup_table_coordinates
         //console.log(lookup_table_coordinates)
         socket_parkingLot.emit('update_worker', {"id_user": id_user});

      }
    });


});



$("#info-close").click(function(){
            console.log("cerraaaaaaaaaaaaaar");
            $("#info").modal('toggle');
        });










d3.select('#btn-drawPoly').on('click', function() {

   //Only is possible draw polygon if there are one video focused
   if(listParkingLots.length > 0)
      new Polygon();    


});



var flag_delete_poly = false;
d3.select('#btn-delPoly').on('click', function() {

    if(flag_delete_poly == false){
	    $("#btn-delPoly").removeClass('btn btn-outline-primary');
	    $("#btn-delPoly").addClass('btn btn-danger');
	    $('#mainSvg').css('cursor', 'crosshair');
            flag_delete_poly = true;
    }else{
            $("#btn-delPoly").removeClass('btn btn-danger');
            $("#btn-delPoly").addClass('btn btn-outline-primary');
            $('#mainSvg').css('cursor', 'default');
            flag_delete_poly = false;
    }

});




  var svgCanvas = d3.select('#div-svg').append('svg').attr("id", "mainSvg");




 function Polygon() {


    var polyPoints = [];
    var gContainer = svgCanvas.append('g').classed("outline", true);
    var isDrawing = false;
    var isDragging = false;
    var linePoint1, linePoint2;
    var startPoint;
    var bbox;
    var boundingRect;
    var shape;
    var gPoly;

    
    var polyDraw = svgCanvas.on("mousedown", setPoints)
      .on("mousemove", drawline)
      .on("mouseup", decidePoly);
  

    //var dragBehavior = d3.drag().on("drag", alterPolygon);
    

    //On mousedown - setting points for the polygon
    function setPoints() {
      if (isDragging) return;

      isDrawing = true;

      var plod = d3.mouse(this);
      linePoint1 = {
        x: plod[0],
        y: plod[1]
      };

      polyPoints.push(plod);

      var circlePoint = gContainer.append("circle")
        .attr("cx", linePoint1.x)
        .attr("cy", linePoint1.y)
        .attr("r", 4)
        .attr("start-point", true)
        .classed("handle", true)
        .style("cursor", "pointer");


      // on setting points if mousedown on a handle
      if (d3.event.target.hasAttribute("handle")) {
        completePolygon()
      }

    }

    //on mousemove - appending SVG line elements to the points
    function drawline() {
      if (isDrawing) {
        linePoint2 = d3.mouse(this);
        gContainer.select('line').remove();
        gContainer.append('line')
          .attr("x1", linePoint1.x)
          .attr("y1", linePoint1.y)
          .attr("x2", linePoint2[0] - 2) //arbitary value must be substracted due to circle cursor hover not working
          .attr("y2", linePoint2[1] - 2); // arbitary values must be tested

      }
    }

    //On mouseup - Removing the placeholder SVG lines and adding polyline
    function decidePoly() {

      //console.log("decide politic");
      //console.log(polyPoints);
      
      gContainer.select('line').remove();
      gContainer.select('polyline').remove();

      var polyline = gContainer.append('polyline').attr('points', polyPoints);
      //console.log(polyPoints);

      gContainer.selectAll('circle').remove();

      for (var i = 0; i < polyPoints.length; i++) {
        var circlePoint = gContainer.append('circle')
          .attr('cx', polyPoints[i][0])
          .attr('cy', polyPoints[i][1])
          .attr('r', 4)
          .attr("handle", true)
          .classed("handle", true);

      }
    
    }

    //Called on mousedown if mousedown point if a polygon handle
    function completePolygon() {

     
      polyPoints.splice(polyPoints.length - 1);
      //console.log(polyPoints);

      
      //_____________________________________________

      d3.select('g.outline').remove();
      
      /*
      gPoly = svgCanvas.append('g')
        .classed("polygon", true);

      
      polyEl = gPoly.append("polygon")
        .attr("points", polyPoints);
      

      for (var i = 0; i < polyPoints.length; i++) {
        gPoly.append('circle')
          .attr("cx", polyPoints[i][0])
          .attr("cy", polyPoints[i][1])
          .attr("r", 4)
          .call(dragBehavior);
      }

      */

      isDrawing = false;
      isDragging = true;

      /*
      bbox = polyEl._groups[0][0].getBBox();
      var bbox2 = gPoly._groups[0][0].getBBox();


      bbox.x = 0;
      bbox.y = 0;
      bbox.width = 50;
      bbox.height = 50;


      //            debugger;

      gPoly.datum({
        x: 0,
        y: 0
      })

      //console.log(bbox);
      gPoly.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"
      });
      //          polyEL.attr("transform", "translate(" + 0 + "," + 0 + ")");
      //
      gPoly.call(d3.drag().on("drag", function(d) {
        d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")")
      }));

      */
     //______________________________________________


     //___________________________________add polygon___________________________________________
     var pos_absolute = offset_carousel + pos_carousel;
     listParkingLots[pos_absolute].addPoly(polyPoints); 
    //__________________________________________________________________________________________
  
    }

    //Altering polygon coordinates based on handle drag

    /*
    function alterPolygon() {

      
      if (isDrawing === true) return;
      var alteredPoints = [];
      var selectedP = d3.select(this);
      var parentNode = d3.select(this.parentNode);

      //select only the elements belonging to the parent <g> of the selected circle
      var circles = d3.select(this.parentNode).selectAll('circle');
      var polygon = d3.select(this.parentNode).select('polygon');


      var pointCX = d3.event.x;
      var pointCY = d3.event.y;

      //rendering selected circle on drag
      selectedP.attr("cx", pointCX).attr("cy", pointCY);

      //loop through the group of circle handles attatched to the polygon and push to new array
      for (var i = 0; i < polyPoints.length; i++) {

        var circleCoord = d3.select(circles._groups[0][i]);
        var pointCoord = [circleCoord.attr("cx"), circleCoord.attr("cy")];
        alteredPoints[i] = pointCoord;

      }

      //re-rendering polygon attributes to fit the handles
      polygon.attr("points", alteredPoints);

      bbox = parentNode._groups[0][0].getBBox();
      console.log(bbox);

    }

    

    function prepareTransform(bboxVal) {
     alert("prepareTransform");
      var originalPosition = {
        x: bboxVal.x,
        y: bboxVal.y
      };

      console.log(bboxVal);
      console.log(bbox);

      bbox.x = 0;
      bbox.y = 0;


      return originalPosition;
    }

    */

  }

















$(window).on('load', function() {

  //setting some visual elements
  $("#map").css( "height", $("#div-video").height());

  var svgCanvas = d3.select('#mainSvg').attr("width", $("#div-video").width()).attr("height", $("#div-video").height());



  initialize();
  fillCarousel(listParkingLots);

  

  /*
  var polyPoints = [[181.015625, 79.5625], [103.015625, 196.5625], [218.015625, 182.5625]];
  completePolygon(polyPoints, 1)
  */
 
 /*

  for(var i = 0; i < polyPoints.length; i++){
     polyPoints[i][0] = polyPoints[i][0] - 75;
     polyPoints[i][1] = polyPoints[i][1] - 62;
  }

  console.log(polyPoints);
  completePolygon(polyPoints);

  //$("#test").css('transform', 'translate(564px,213px)');
  console.log($('#test').attr("transform"));
  console.log($('#test').find("polygon").attr("points"));

*/


});













