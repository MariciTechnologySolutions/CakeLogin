var geo = (function($) {
    return {
        url: window.location.origin+"/investors",
        
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            var map;
            var drawingManager;
            this.initMap();
            this.test();
            
            
            
        },
        test: function(){
            
            var cTag = $('#currentTag').val();
            
            $.each($('.poly'),function(k,v){
                var name = $(this).attr('data-rel');
                var poly = $(this).text();
                console.log(poly);
                var c = JSON.parse(poly);
                
                console.log(c);
                return false;
//                for(var i=0;i<c.length;i++){
//                    
//                    var a = JSON.parse(c[i]);
//                    
//                    console.log(a);
//                    
//                }
            });
            
        },
        initMap: function(){
            
            this.map = new google.maps.Map(document.getElementById('mapView'),{
                center: {lat: 33.500, lng: -112.0},
                scrollwheel: true,
                zoom: 10
            });
            
            var poly = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polygon']
            },
            polygonOptions:{
                fillColor: '#ededed',
                fillOpacity: .35,
                strokeWeight: 1,
                clickable: true,
                editable: true,
                zIndex: 1
            }
            });
            poly.setMap(this.map);
            
            
            google.maps.event.addListener(poly, 'overlaycomplete', function(event) {
                if (event.type == 'polygon') {
//                    var vertices = event.overlay.getPaths();
                    var vertices = event.overlay.getPath();
                    console.log(vertices);
                    return;
                    var arr = [];
                    
                    for (var i =0; i < vertices.getLength(); i++) {
                        var xy = vertices.getAt(i);
                        
                        var point = [];
                        
                        point.lat = xy.lat();
                        point.lng = xy.lng();
                          
                        //var t = JSON.stringify(point);
                        //var point = '{"lat": ' + xy.lat() + ',"lng": ' + xy.lng() + '}';
                        
                        
                        
                        
                        arr.push(point);
                        console.log(point);
                    }
                    
                    //console.log(arr);
//                    var out = JSON.stringify(arr);
//                    //console.log(out);
//                    var cTag = $('#currentTag').val();
//                    
//                    $.ajax({
//                        type: 'post',
//                        url: '/investors/poly',
//                        data: {poly:out,name:cTag},
//                        success: function(response){
//                            console.log(response);
//                        }
//                    });
                    
                }
            });
            
            
            $.each($('.poly'),function(k,v){
                var name = $(this).attr('data-rel');
                var c = $(this).text();
                //var coords = JSON.parse(c);
                
//                name = new google.maps.Polygon({
//                    paths: coords,
//                    strokeColor: '#FF0000',
//                    strokeOpacity: 0.8,
//                    strokeWeight: 2,
//                    fillColor: '#FF0000',
//                    fillOpacity: 0.35
//                });
//                name.setMap(map);
                
            });
            
            
            infoWindow = new google.maps.InfoWindow;
            
        }
    };
}($));
$(window).load(function() {geo.init();});