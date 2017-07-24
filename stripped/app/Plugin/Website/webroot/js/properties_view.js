"use strict"

var map = null;
var mapOptions = {zoom: 9};
var bounds = null;
var infobox =null;



var drawMap =  function() {


    var i = 0;//index
    map = new google.maps.Map(document.getElementById('mapView'), mapOptions);
    bounds = new google.maps.LatLngBounds();
    google.maps.event.addListenerOnce(map, "idle", function () {
        if (map.getZoom() > 10) {
            map.setZoom(10);
        }
    });

    //fetch lat log from dt table data
    
        i++;
        var lat = $("input#lat").val();
        var lng = $("input#lng").val();
        var latlng = new google.maps.LatLng(lat, lng);
        //create marker
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: new google.maps.MarkerImage(
                '/images/marker-blue.png',
                null,
                null,
                null,
                new google.maps.Size(30, 30)
            ),
            draggable: false,
            animation: google.maps.Animation.DROP,
        });
        bounds.extend(new google.maps.LatLng(lat, lng));
        map.fitBounds(bounds);
    
}              

$(document).ready(function() {
    drawMap();
});
