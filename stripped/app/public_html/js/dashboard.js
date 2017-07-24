var db = (function($) {
    return {
        mapOptions: {zoom: 9},
        map: null,
        bounds: null,
        infobox: null,
        data: null,
        init: function() {
            this.drawMap();
            
            
            
        },
        drawMap: function(){
            
//           var properties = $.ajax({
//                type:'post',
//                url: '/dashboard/apiGetDashboardProperties',
//                success: function(response){
//                    return JSON.parse(response);
//                }
//            });
            
            var properties = $('#plist').text();
            
            var styles = [{
                    stylers : [ {
                        hue : "#cccccc"
                    }, {
                        saturation : -100
                    }]
                }, {
                    featureType : "road",
                    elementType : "geometry",
                    stylers : [ {
                        lightness : 100
                    }, {
                        visibility : "simplified"
                    }]
                }, {
                    featureType : "road",
                    elementType : "labels",
                    stylers : [ {
                        visibility : "on"
                    }]
                }, {
                    featureType: "poi",
                    stylers: [ {
                        visibility: "off"
                    }]
                }];
            var styles = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}];
            var options = {
                center: {lat: 33.5, lng: -112},
                scrollwheel: true,
                zoom: 8,
                mapTypeId : 'Styled',
                disableDefaultUI: true,
                mapTypeControlOptions : {
                    mapTypeIds : [ 'Styled' ]
                }
            };
            var map = new google.maps.Map(document.getElementById('mapView'), options);
            var bounds = new google.maps.LatLngBounds();
            var styledMapType = new google.maps.StyledMapType(styles, {
                name : 'Styled'
            });

            map.mapTypes.set('Styled', styledMapType);
            
            var props = JSON.parse(properties);
            var i = 0;
            $.each(props, function(i,prop) {
               
                var latlng = new google.maps.LatLng(prop.lat,prop.lon);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    icon: new google.maps.MarkerImage( 
                        '/images/marker-red.png',
                        null,
                        null,
                        null,
                        new google.maps.Size(12,12)
                    ),
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                });
                bounds.extend(latlng);
                map.fitBounds(bounds);
                db.createInfobox();
                var infoboxContent = '<div class="infoW">' +
                    '<div class="propImg">' +
                    '<div style="background-color: #0d9095;height: 35px"></div>' +
                    '<div class="propBg">' +
                    '<div class="propPrice">' + prop.purchase_amt + '</div>' +
                    //'<div class="propType" style="color: #505050">' + 'status' + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="paWrapper">' +
                    '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + prop.address + '</div>' +
                    '<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + prop.city + ', ' + prop.state + ' ' + prop.zipcode + '</div>' +
                    '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: bold">' + ' ' + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.purchase + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.sale + '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="infoButtons">' +
                    '<a class="btn btn-xs btn-round btn-gray btn-o closeInfo">Close</a>' +
                    '<a href="/properties/view/'+ prop.id +'" target="_blank" class="btn btn-xs btn-round btn-green viewInfo">View</a>' +
                    '</div>' +
                    '</div>';
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infobox.setContent(infoboxContent);
                        infobox.open(map, marker);
                        map.setZoom(19);
                        map.setCenter(latlng);
                        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    };
                })(marker, i));
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infobox.setContent(infoboxContent);
                        infobox.open(map, marker);
                        map.setZoom(19);
                        map.setCenter(latlng);
                        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    };
                })(marker, i));
                
                
                google.maps.event.addListener(map, "click", function (event) {
                    infobox.open(null, null);
                    map.fitBounds(bounds);
                    map.setMapTypeId('Styled');
                });
                
                
                i++;
            });
            
            
            
            
        },
        createInfobox: function(){
            infobox = new InfoBox({
                disableAutoPan: false,
                maxWidth: 202,
                pixelOffset: new google.maps.Size(100, -175),
                zIndex: null,
                boxStyle: {
                    background: "url('/images/infobox-bg.png') no-repeat",
                    opacity: 1,
                    width: "202px",
                    height: "152px"
                },
                closeBoxMargin: "28px 26px 0px 0px",
                closeBoxURL: "",
                infoBoxClearance: new google.maps.Size(1, 1),
                pane: "floatPane",
                enableEventPropagation: false
            });
        }
    };
}($));
$(document).ready(function() {db.init();});