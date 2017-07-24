var school = (function($) {
    return {
        mapOptions: {zoom: 10},
        map: null,
        bounds: null,
        init: function() {
            
            
            school.drawMap();
        },
        drawMap: function(){
            
            school.map = new google.maps.Map(document.getElementById('canvas'), school.mapOptions);
            school.bounds = new google.maps.LatLngBounds();
            school.map.setCenter(
                new google.maps.LatLng(33.45, -112.0)
            );
            
            var pid = $('#pid').text();
            
            
            console.log(pid)
            $.ajax({
                type: 'post',
                url: '/schools/api_get_subject',
                data: {pid:pid},
                success: function(response){
                    
                    var data = JSON.parse(response);
                    
                    school.markSubject(data.latitude,data.longitude);
                    
                    $(data.schools).each(function(index,value){
                        var s = JSON.parse(value.schools.boundary);
                        console.log(s);
                        if(s != null){
                            school.drawPoly(s);
                        }
                        
                    });
                    
                }
            });
            
        },
        markSubject: function(lat,lon){
            var latlng = new google.maps.LatLng(lat,lon);
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


