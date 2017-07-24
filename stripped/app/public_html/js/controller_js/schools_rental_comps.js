var school = (function($) {
    return {
        mapOptions: {zoom: 10},
        map: null,
        bounds: null,
        subject: null,
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            var map;
            this.subject = JSON.parse($('#subject').text());
            school.drawMap();
        },
        copy: function(el){
            
          
        },
        drawMap: function(){
            
            var sub = school.subject;
            var lat = sub.MlsData.latitude;
            var lon = sub.MlsData.longitude;
            
            school.map = new google.maps.Map(document.getElementById('canvas'), school.mapOptions);
            school.bounds = new google.maps.LatLngBounds();
            school.map.setCenter(
                new google.maps.LatLng(lat,lon)
            );
            school.markSubject(lat,lon);
            
            
            $.ajax({
                type: 'post',
                url: '/schools/getNearbyComps',
                data: {lat:lat,lon:lon},
                success: function(response){
                    
                    var data = JSON.parse(response);
                    $(data).each(function(index,value){
                        var id        = value.colony_rentals.id;
                        var latitude  = value.colony_rentals.latitude;
                        var longitude = value.colony_rentals.longitude;
                        var address   = value.colony_rentals.address;
                        var city      = value.colony_rentals.city;
                        var zip       = value.colony_rentals.zip;
                        var year      = value.colony_rentals.year;
                        var pool      = value.colony_rentals.pool;
                        var rent      = value.colony_rentals.rent;
                        var sqft      = value.colony_rentals.sqft;
                        var lease     = value.colony_rentals.lease;
                        var bed       = value.colony_rentals.bed;
                        var bath      = value.colony_rentals.bath;
                        
                        var latlng = new google.maps.LatLng(latitude,longitude);
                        school.bounds.extend(latlng);
                        
                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: school.map,
                            icon: new google.maps.MarkerImage(
                                '/images/marker-green.png',
                                null,
                                null,
                                null,
                                new google.maps.Size(30, 30)
                            ),
                            draggable: false,
                            animation: google.maps.Animation.DROP,
                        });
                        
                        school.createInfobox();
                        var infoboxContent = '<div class="infoW">' +
                            '<div class="propImg">' +
                                '<div style="background-color: #0d9095;height: 40px"></div>' +
                                '<div class="propBg">' +
                                    '<div class="propPrice">$' + Math.round(rent) + '</div>' +
                                    '<div class="propType" style="color: #505050">CAH</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="paWrapper">' +
                                '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + address + '</div>' +
                                '<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + city + ' AZ ' + zip + '</div>' +
                                '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + 'Lease: ' + lease + '</div>' +
                            '</div>' +
                             '<ul class="propFeat">' +
                                '<li style="margin-right: 5px"><span class="fa fa-moon-o"></span> ' + bed + '</li>' +
                                '<li style="margin-right: 5px"><span class="icon-drop"></span> ' + bath + '</li>' +
                                '<li style="margin-right: 5px"><span class="icon-frame"></span> ' + sqft + '</li>' +
                                '<li style="margin-right: 5px"><span class="fa fa-clock-o"></span> ' + year + '</li>' +
                                '<li style="margin-right: 0px"><span class="fa fa-support"></span> ' + pool + '</li>' +
                            '</ul>' +   
                            '<div class="clearfix"></div>' +
                            '<div class="infoButtons">' +
                                '<a class="btn btn-sm btn-round btn-gray btn-o closeInfo">Close</a>' +
                            '</div>' +
                         '</div>';
                        
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                school.infobox.setContent(infoboxContent);
                                school.infobox.open(school.map, marker);
                                school.map.setZoom(19);
                                school.map.setCenter(latlng);
                                school.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                            };
                        })(marker, 1));
                        
                        
                        google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                            return function() {
                                $('#' + id).addClass('active');
                            }
                        })(marker, 1));
                        
                        google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
                            return function() {
                                $('#' + id).removeClass('active');
                            }
                        })(marker, 1));

                        //close infobox
                        google.maps.event.addListener(school.map, "click", function (event) {
                            school.infobox.open(null, null);
                            school.map.fitBounds(school.bounds);
                            school.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                        }); 
                        
                        
                        
                        
                        //hide dom list if not on map
                        google.maps.event.addListener(school.map,'bounds_changed',function(){
                            
                            if($('#canvas').width() > 0){
                                if(school.map.getBounds().contains(marker.getPosition())){
                                    $('#' + id).removeClass('hidden');
                                }else{
                                    $('#' + id).addClass('hidden');
                                }

                            }
                        });
                        
                        
                        var out = '<a href="#" id="' + id + '" class="list-group-item">' + address + ', ' + city +  ' ' + zip +  '<br>Bed: ' + bed +  ' Bath: ' + bath +  ' SqFt: ' + sqft +  ' Yr: ' + year + ' Pool: ' + pool + '<br>p/sft: ' + Math.round(rent/sqft * 100) / 100 + '<span class="badge badge-blue">$' + Math.round(rent) + '</span></a>';
                        $('#comps').append(out);
                        
                        google.maps.event.addDomListener(document.getElementById(id), 'mouseover', function() {
                                setTimeout(function(){
                                    marker.setAnimation(google.maps.Animation.BOUNCE);
                                },50);
                                setTimeout(function(){
                                    marker.setAnimation(null);
                                },1500);
                        });
                        
                    });
                    //finished with colony comps. now fetch mls comps
                    var subject  = $('#subject').text();
                    $.ajax({
                        type: 'post',
                        url: '/schools/getMlsRentalComps',
                        data: {subject:subject},
                        success: function(response){
                            //console.log(response);
                        }
                    });
                    
                    //!mls comps
                    school.map.fitBounds(school.bounds);
                }
            });
            
        },
        createInfobox: function() {
            school.infobox = new InfoBox({
                disableAutoPan: false,
                maxWidth: 222,
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
        },
        markComps: function(lat,lon){
            var latlng = new google.maps.LatLng(lat,lon);
            school.bounds.extend(latlng);
            var marker = new google.maps.Marker({
                position: latlng,
                map: school.map,
                icon: new google.maps.MarkerImage(
                    '/images/marker-red.png',
                    null,
                    null,
                    null,
                    new google.maps.Size(30, 30)
                ),
                draggable: false,
                animation: google.maps.Animation.DROP,
            });
        },
        markSubject: function(lat,lon){
            var latlng = new google.maps.LatLng(lat,lon);
            school.bounds.extend(latlng);
            var marker = new google.maps.Marker({
                position: latlng,
                map: school.map,
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
        },
        drawPoly: function(poly){
            
            var shape = poly.schools[0]['coordinates']['coordinates'][0][0];//raw gs poly object
            var arr = [];
            
            $(shape).each(function (index, value){
                var lon = value[0];
                var lat = value[1];
                var latlng = new google.maps.LatLng(lat,lon);
                arr.push(latlng);
                school.bounds.extend(latlng);
            });
            
            var boundary = new google.maps.Polygon({
                paths: arr,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: '#FF0000',
                fillOpacity: 0.3
            });
            boundary.setMap(school.map);
            
            school.map.fitBounds(school.bounds);
            
        },
    }
}($));
$(window).load(function() {
    school.init();
});


