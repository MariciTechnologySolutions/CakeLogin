var comp = (function($) {
    return {
        map: null,
        bounds: null,
        infobox: null,
        init: function() {

            var leftColumn  = $('.leftColumn').height();
            $('.rightColumn').height(leftColumn);
            var panelHeader = $('.panelHeader').height();
            $('.panelBody').height(leftColumn -  panelHeader - 30);
            
            
            comp.getProperties();
            
            $('.thumb').each(function( i,v ) {
                
                var mw = 200;
                var mh = 125;
                
                var nw;
                var nh;
                
                var w = $(this).width();
                var h = $(this).height();
                var currentRatio = w/h;//ie .67 
                
                if(w > mw){
                    $(this).width(mw);
                }
                
            });
            
            $('.subject').on('click',function(e){
                
                var mls_data_id = $('#mls_data_id').text();
                var id = $(this).attr('data-rel');
                console.log(id);
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/cma/ajaxGetSubjectFromSession',
                    data: {mls_data_id:mls_data_id},
                    success: function(response){
                        var ignore = ['images','latitude','longitude','sub_match','id'];
                        
                        var out = '';
                                
                                $.each( response, function(i,v) {
                                    
                                    if(!Pankaj.inArray(i,ignore)){
                                        out += i + ': ' + v + '<br>';
                                    }
                                    if(i == 'images'){
                                        var imageOut = '';
                                        var obj = JSON.parse(v);
                                        
                                        $.each(obj, function(imageIndex,imageUrl){
                                            imageOut += '<div class="ajax_content" style="float:left; height: 200px; overflow: hidden; padding: 5px 5px 5px 0px"><img src="'+imageUrl+'" style="width: 300px"></div>'
                                        });
                                        
                                        $('#imageDiv').html(imageOut);
                                    }
                                });
                        $('#detailDiv').html(out);
                    }
                });
                
                e.preventDefault();
            })
            $('.comparable').on('click',function(e){
                
                var mls_data_id = $('#mls_data_id').text();
                var id = $(this).attr('data-rel');
                console.log(id);
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/cma/ajaxGetFilteredCompsFromSession',
                    data: {mls_data_id:mls_data_id},
                    success: function(response){
                        
                        var ignore = ['images','latitude','longitude','sub_match','id'];
                        
                        var out = '';
                        $.each( response, function( key, value ) {
                            
                            if(value.id == id){
                                
                                $.each( value, function(i,v) {
                                    
                                    if(!Pankaj.inArray(i,ignore)){
                                        out += i + ': ' + v + '<br>';
                                    }
                                    
                                    if(i == 'images'){
                                        
                                        var imageOut = '';
                                        var obj = JSON.parse(v);
                                        
                                        $.each(obj, function(imageIndex,imageUrl){
                                            
                                            imageOut += '<div class="ajax_content" style="float:left; height: 200px; overflow: hidden; padding: 5px 5px 5px 0px"><img src="'+imageUrl+'" style="width: 300px"></div>'
                                            
                                        });
                                        
                                        $('#imageDiv').html(imageOut);
                                    }
                                    
                                });
                                
                            }
                            
                        });
                        
                        $('#detailDiv').html(out);
                        
                    }
                });
                
                $('.ajax_content').each(function(){
                    //$(this).resize();
                });
                e.preventDefault();
            })
            
            
        },
        getProperties: function(){
            
            var mls_data_id = $('#mls_data_id').text();
            
            
            $.ajax({
                type: 'post',
                dataType: 'json',
                data: {mls_data_id:mls_data_id},
                url: '/cma/ajaxGetFilteredCompsFromSession',
                success: function(comps){
                    //console.log(comps);
                    comp.renderMap(comps);
                    //comp.renderTable(comps);
                }
            });
            
            
        },
        renderMap: function(comps){
            
            var sub = $('#subjectProperty').text();
            var subject = JSON.parse(sub);
            subject.subjectProperty = true;
            
            comps.unshift(subject);
            //console.log(comps);
             
            comp.createInfobox();
            
            var mapOptions = {
                center: {lat: 33.5, lng: -112},
                scrollwheel: true,
                zoom: 8,
                mapTypeId : 'roadmap',
            };
            
            
            comp.map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
            comp.bounds = new google.maps.LatLngBounds();
            
            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT,
                    drawingModes: ['polygon','rectangle','circle'],
                },
                circleOptions: {
                    fillColor: '#000',
                    fillOpacity: .2,
                    strokeWeight: 1,
                    clickable: true,
                    editable: true,
                    zIndex: 1
                },
                rectangleOptions: {
                    fillColor: '#000',
                    fillOpacity: .2,
                    strokeWeight: 1,
                    clickable: true,
                    editable: true,
                    zIndex: 1
                },
                polygonOptions: {
                    fillColor: '#000',
                    fillOpacity: .2,
                    strokeWeight: 1,
                    clickable: true,
                    editable: true,
                    zIndex: 1
                },
            });
            drawingManager.setMap(comp.map);

            google.maps.event.addListener(drawingManager, 'circlecomplete', function (circle) {
                google.maps.event.addListener(circle, 'radius_changed', function () {
                    console.log('radius changed');
                });
            });
            google.maps.event.addListener(drawingManager, 'rectanglecomplete', function (rectangle) {
                google.maps.event.addListener(rectangle, 'bounds_changed', function () {
                    console.log('rectangle changed');
                });
            });
            google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
                console.log();
                console.log(polygon.getPaths());
                
                polygon.getPaths().forEach(function(path, index){

                    google.maps.event.addListener(path, 'insert_at', function(){
                      console.log('whoa add');
                      console.log(polygon.getPaths());
                    });

                    google.maps.event.addListener(path, 'remove_at', function(){
                      console.log('whoa remove');
                      console.log(polygon.getPaths());
                    });
                    google.maps.event.addListener(path, 'set_at', function(){
                      console.log('whoa set');
                      console.log(polygon.getPaths());
                    });

                    

                });
            });

            comp.setMarkers(comps);
            
        },
        showArrays: function(event){
            
            var vertices = event.getPath();

            var contentString = '<b>Bermuda Triangle polygon</b><br>' +
                'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
                '<br>';

            // Iterate over the vertices.
            for (var i =0; i < vertices.getLength(); i++) {
              var xy = vertices.getAt(i);
              contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
                  xy.lng();
            }

            // Replace the info window's content and position.
            console.log(contentString);
            console.log(event.latLng);

            
            
        },
        setMarkers: function(comps){
            
            $.each(comps, function (i, p) {
                
                switch(p.status){
                    case 'Active':
                        var pin = 'marker-green.png';
                        break;
                    case 'Pending':
                        var pin = 'marker-yellow.png';
                        break;
                    case 'Closed':
                        var pin = 'marker-blue.png';
                        break;
                    default:
                        var pin = 'marker-red.png';
                        break;
                }
                if(p.hasOwnProperty('subjectProperty') == true){
                    var pin = 'subjectProperty.png';
                }
                
                var latlng = new google.maps.LatLng(p.latitude,p.longitude);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: comp.map,
                    icon: new google.maps.MarkerImage(
                        '/images/' + pin,
                        null,
                        null,
                        null,
                        new google.maps.Size(25, 25)
                    ),
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                });
                comp.bounds.extend(latlng);
                comp.map.fitBounds(comp.bounds);
                
                var infoboxContent = '<div class="infoW">' +
                    '<div class="propImg">' +
                    '<div style="background-color: #0d9095;height: 40px"></div>' +
                    '<div class="propBg">' +
                    '<div class="propPrice">$' + p.list_price + '</div>' +
                    '<div class="propType" style="color: #505050">' + p.status + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="paWrapper">' +
                    '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + p.address + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + address[1] + '</div>' +
                    '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: bold">' + p.city + ', ' + p.state + ' ' + p.zipcode + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.purchase + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.sale + '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="infoButtons">' +
                    '<a class="btn btn-xs btn-round btn-gray btn-o closeInfo">Close</a>' +
                    '</div>' +
                    '</div>';
                //infowindow
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        $('#card_' + p.id).css('background-color','yellow');
                        comp.infobox.setContent(infoboxContent);
                        comp.infobox.open(comp.map, marker);
                        comp.map.setZoom(19);
                        comp.map.setCenter(latlng);
                        comp.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    };
                    $('#card_' + p.id).scrollintoview({
                        duration: 500,
                        direction: "vertical"
                    });
                    
                    
                })(marker, i));
                //close infowindow
                google.maps.event.addListener(comp.map, "click", function (event) {
                    comp.infobox.open(null, null);
                    comp.map.fitBounds(comp.bounds);
                    comp.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                    $('#card_' + p.id).css('background-color','');
                });
                
                
                
                google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                    return function() {
                        $('#card_'+p.id).addClass('prop_highlight')
                        marker.setIcon(
                            new google.maps.MarkerImage(
                                '/images/marker-red.png',
                                null,
                                null,
                                null,
                                new google.maps.Size(25,25)
                            )
                        );
                        $('#card_' + p.id).scrollintoview({
                            duration: 500,
                            direction: "vertical"
                        });
                        
                    };
                })(marker, i));
                //mouse out
                google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
                    return function() {
                        $('#card_'+ p.id).removeClass('prop_highlight')
                        marker.setIcon(
                            new google.maps.MarkerImage(
                                '/images/' + pin,
                                null,
                                null,
                                null,
                                new google.maps.Size(25,25)
                            )
                        );
                    };
                })(marker, i));
                
                //dom listeners
                google.maps.event.addDomListener(document.getElementById('card_' + p.id), 'mouseover', function() {
                    marker.setIcon(
                            new google.maps.MarkerImage(
                                '/images/hover.png',
                                null,
                                null,
                                null,
                                new google.maps.Size(25,25)
                            )
                        );
  
                });
                google.maps.event.addDomListener(document.getElementById('card_' + p.id), 'mouseout', function() {
                    marker.setIcon(
                            new google.maps.MarkerImage(
                                '/images/' + pin,
                                null,
                                null,
                                null,
                                new google.maps.Size(25,25)
                            )
                        );
                });
                
                
            });
        },
        createInfobox: function() {
            comp.infobox = new InfoBox({
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
        },
        renderTable: function(){
            
        }
    };
}($));
$(window).load(function() {comp.init();});