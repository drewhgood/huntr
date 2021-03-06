$(document).ready(function() {
   navigator.geolocation.getCurrentPosition(initialise);
  $('#hunt_sb1 , #hunt_sb2').hide();
  $('#hide_form').click(function(){ 


    var provided_hunt_name = hunt_info.elements["hunt_name"].value;
    var provided_hunt_description = hunt_info.elements["hunt_description"].value;
    var provided_hunt_starting_location = hunt_info.elements["hunt_location"].value;
    var provided_hunt_difficulty = hunt_info.elements["hunt_difficulty"].value;

    $("#insert_description").text(provided_hunt_description);
    $("#insert_name").text(provided_hunt_name);
    $("#insert_difficulty").text(provided_hunt_difficulty);
    $("#insert_location").text(provided_hunt_starting_location);

    new_hunt.elements["description"].value= provided_hunt_description;
    new_hunt.elements["name"].value= provided_hunt_name;
    new_hunt.elements["starting_location"].value= provided_hunt_starting_location;
    new_hunt.elements["difficulty"].value= provided_hunt_difficulty;
    // alert(new_hunt.elements["name"].value);
    

    $('#myTabContentOverlay').fadeOut(350);
    $('#content_mover').animate({"left": '+=15%'});
    $('#hunt_sb1, #hunt_sb2').fadeIn(700);




  });
  var counter = 0;
  $('#add_hints_to_hunt').click(function(){ 
    counter++;

    name_hint_1 = "hint_1_"+counter;
    name_hint_2 = "hint_2_"+counter;
    name_hint_3 = "hint_3_"+counter;
    name_clue =  "clue_"+counter;

    var provided_clue = new_hint.elements["clue"].value;
    var provided_hint_1 = new_hint.elements["hint_1"].value;
    var provided_hint_2 = new_hint.elements["hint_2"].value;
    var provided_hint_3 = new_hint.elements["hint_3"].value;


    


    
    
        var input_clue = document.createElement("input");

        input_clue.setAttribute("type", "hidden");

        input_clue.setAttribute("form", "new_hunt");

        input_clue.setAttribute("name", name_clue);

        input_clue.setAttribute("value", provided_clue );


        var input_hint_1 = document.createElement("input");

        input_hint_1.setAttribute("type", "hidden");

        input_hint_1.setAttribute("form", "new_hunt");

        input_hint_1.setAttribute("name", name_hint_1);

        input_hint_1.setAttribute("value",provided_hint_1 );


        var input_hint_2 = document.createElement("input");

        input_hint_2.setAttribute("type", "hidden");

        input_hint_2.setAttribute("form", "new_hunt");

        input_hint_2.setAttribute("name", name_hint_2);

        input_hint_2.setAttribute("value",provided_hint_2 );


        var input_hint_3 = document.createElement("input");

        input_hint_3.setAttribute("type", "hidden");

        input_hint_3.setAttribute("form", "new_hunt");

        input_hint_3.setAttribute("name", name_hint_3);

        input_hint_3.setAttribute("value",provided_hint_3 );


        document.getElementById("new_hunt").appendChild(input_hint_1);
        document.getElementById("new_hunt").appendChild(input_hint_2);
        document.getElementById("new_hunt").appendChild(input_hint_3);
        document.getElementById("new_hunt").appendChild(input_clue);

        // $("#add_points").append("<div id='mine'></div>");
        var $newH4 = $('<h4>');
        $newH4.text(provided_clue).addClass( "sb_special" );
        var $newUL = $('<ul>');
        var $firstClue = $('<li>').text(provided_hint_1).addClass( "sb_special_li" );
        var $secondClue = $('<li>').text(provided_hint_2).addClass( "sb_special_li" );
        var $thirdClue = $('<li>').text(provided_hint_3).addClass( "sb_special_li" );
        $newUL.append($firstClue).append($secondClue).append($thirdClue)
        $("#add_points").append($newH4).append($newUL);

  });
    $('#add_hints_to_hunt').click(function(){ 
    $('#modal-hint').modal('toggle');

    new_hint.elements["hint_1"].value = ""
    new_hint.elements["hint_2"].value = ""
    new_hint.elements["hint_3"].value = ""
    new_hint.elements["clue"].value = ""

  });

    $('#map-canvas').click(function(){ 
    

  });






  var poly;
  var map;
  var coords = [];
  var image = '/img/map_pin_icon.png'

  function initialise(location)
  {
    console.log(location);

    var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

    var mapOptions = {
      //center map on users geolocation (from browser)
      center: currentLocation,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP };


      map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);

      var polyOptions = {
        strokeColor: '#339966',
        strokeOpacity: 0.5,
        strokeWeight: 2};

        poly = new google.maps.Polyline(polyOptions);
        poly.setMap(map);


      //add a listener for the click event
      google.maps.event.addListener(map, 'click', addLatLng);

  }

  i=0;
  function addLatLng(event) {
        // console.log('marker placed at');
        // console.log(event.latLng);
        window.latLng = event.latLng;
        i++;
        //console.log(poly);
        var path = poly.getPath();
        length = google.maps.geometry.spherical.computeLength(path.getArray());
        console.log(length);
        length = Math.round(1.45*length/1000);
        time = length/5;
        num_location = coords.length + 1;
        console.log(num_location);

        $("#dynamic_location").text(num_location);
        $("#dynamic_distance").text(length+" KM");
        $("#dynamic_time").text(+time+" Hr");
        // Because path is an MVCArray, we can simply append a new coordinate
        // and it will automatically appear.
        path.push(event.latLng);

        var coordinate = { lat: event.latLng.k, lng: event.latLng.D };
        coords.push(coordinate);

        // console.log(coords[0].lat);
        // console.log(coords[0].lng);


        // console.log (coordinate)

        console.log(i)
        var  name_lat = 'lat_'+i;
        var  name_lng = 'lng_'+i;

        var input_lat = document.createElement("input");

        input_lat.setAttribute("type", "hidden");

        input_lat.setAttribute("form", "new_hunt");

        input_lat.setAttribute("name", name_lat);

        input_lat.setAttribute("value", coordinate.lat);

        var input_lon = document.createElement("input");

        input_lon.setAttribute("type", "hidden");

        input_lon.setAttribute("form", "new_hunt");

        input_lon.setAttribute("name", name_lng);

        input_lon.setAttribute("value", coordinate.lng);


        document.getElementById("new_hunt").appendChild(input_lon);
        document.getElementById("new_hunt").appendChild(input_lat);
        var marker = new google.maps.Marker({
          position: event.latLng,
          title: '#' + path.getLength(),
          map: map,
          icon: image
      }); $('#modal-hint').modal('toggle');
    }



});