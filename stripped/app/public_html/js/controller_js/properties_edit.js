var edit = (function($) {
    return {
        map: null,
        bounds: null,
        infobox: null,
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            var id = $('#pid').text();
            var lat = $('#lat').text();
            var lon = $('#lon').text();
            edit.drawMap(id,lat,lon);
        },
        drawMap: function(id,lat,lon){
                        
            var latlng = new google.maps.LatLng(lat,lon);
            
            var mapOptions = {
                center: latlng,
                scrollwheel: true,
                zoom: 17,
                mapTypeId : 'roadmap',
            };
                
            
            edit.map = new google.maps.Map(document.getElementById('mapView'), mapOptions);
            edit.bounds = new google.maps.LatLngBounds();
            
            var marker = new google.maps.Marker({
                position: latlng,
                map: edit.map,
                icon: new google.maps.MarkerImage(
                    '/images/marker-blue.png',
                    null,
                    null,
                    null,
                    new google.maps.Size(25, 25)
                ),
                draggable: true,
                animation: google.maps.Animation.DROP,
            });
            marker.addListener('dragend', function() {
                // do something
                console.log(marker.getPosition().lat());
                console.log(marker.getPosition().lng());
                $('#mls_data_latitude').val(marker.getPosition().lat());
                $('#mls_data_longitude').val(marker.getPosition().lng());
                
            });
            
        }
    };
}($));
$(window).load(function() {edit.init();});