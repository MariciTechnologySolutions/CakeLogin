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
    $("div.property_small_views").each(function () {
        i++;
        var propertyContainer =$(this);
        var id = propertyContainer.attr("id");
        //console.log(i);
        var address = propertyContainer.find("div.addy1").text();
        var city = propertyContainer.find("div.addy2").text();
        var price = propertyContainer.find("div.price").text();
        var status = propertyContainer.find("div.figType").text();
        var lat = propertyContainer.find("input.latitude_value").val();
        var lng = propertyContainer.find("input.longitude_value").val();
        var latlng = new google.maps.LatLng(lat, lng);
        var viewLink = propertyContainer.find("a.viewLink").attr("href");
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
        createInfobox();
        //infobox html
        var infoboxContent = '<div class="infoW">' +
            '<div class="propImg">' +
            '<div style="background-color: #0d9095;height: 40px"></div>' +
            '<div class="propBg">' +
            '<div class="propPrice">' + price + '</div>' +
            '<div class="propType" style="color: #505050">' + status + '</div>' +
            '</div>' +
            '</div>' +
            '<div class="paWrapper">' +
            '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + address + '</div>' +
            '<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + city + '</div>' +
            '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: bold">' + ' ' + '</div>' +
            //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.purchase + '</div>' +
            //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.sale + '</div>' +
            '</div>' +
            '<div class="clearfix"></div>' +
            '<div class="infoButtons">' +
            '<a class="btn btn-sm btn-round btn-gray btn-o closeInfo">Close</a>' +
            '<a href="'+viewLink+'" target="_blank" class="btn btn-sm btn-round btn-green viewInfo">View</a>' +
            '</div>' +
            '</div>';
        //attach event on map
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infobox.setContent(infoboxContent);
                infobox.open(map, marker);
                map.setZoom(19);
                map.setCenter(latlng);
                map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            };
        })(marker, i));
        //mouse over event on marker
        google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
            return function() {
                $('#card_'+id).addClass('prop_highlight')
                marker.setIcon(
                    new google.maps.MarkerImage(
                        '/images/marker-red.png',
                        null,
                        null,
                        null,
                        new google.maps.Size(30, 30)
                    )
                );
            };
        })(marker, i));
        //mouse out
        google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
            return function() {
                $('#card_'+ id).removeClass('prop_highlight')
                marker.setIcon(
                    new google.maps.MarkerImage(
                        '/images/marker-blue.png',
                        null,
                        null,
                        null,
                        new google.maps.Size(30, 30)
                    )
                );
            };
        })(marker, i));
        //on click map add event to zoom it
        google.maps.event.addListener(map, "click", function (event) {
            infobox.open(null, null);
            map.fitBounds(bounds);
            map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        });
        //listed for events on the DOM mean on mouser of dt row
        google.maps.event.addDomListener(document.getElementById(id), 'mouseover', function() {
            marker.setIcon(
                    new google.maps.MarkerImage(
                        '/images/marker-red.png',
                        null,
                        null,
                        null,
                        new google.maps.Size(30, 30)
                    )
                );
        });
        google.maps.event.addDomListener(document.getElementById(id), 'mouseout', function() {
            marker.setIcon(
                    new google.maps.MarkerImage(
                        '/images/marker-blue.png',
                        null,
                        null,
                        null,
                        new google.maps.Size(30, 30)
                    )
                );
        });
        google.maps.event.addListener(map,'bounds_changed',function(){
            if($('#mapView').width() > 0){
                if(map.getBounds().contains(marker.getPosition())){
                    $('#'+id).removeClass('hidden');
                }else{
                    $('#'+id).addClass('hidden');
                }

            }
        });
    });


}

function createInfobox() {
    infobox = new InfoBox({
        disableAutoPan: false,
        maxWidth: 202,
        pixelOffset: new google.maps.Size(-101, -275),
        zIndex: null,
        boxStyle: {
            background: "url('/images/infobox-bg.png') no-repeat",
            opacity: 1,
            width: "202px",
            height: "202px"
        },
        closeBoxMargin: "28px 26px 0px 0px",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1),
        pane: "floatPane",
        enableEventPropagation: false
    });
}
        
        

$(document).ready(function() {
    drawMap();
   
    $("#dpOfFIlter").change(function() {
        var status = $(this).val();
        var link = window.location.origin+"/colony/inventory/"+status;
        window.location.href = link;
    }); 
});
