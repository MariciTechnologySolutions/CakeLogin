var batch = (function($) {
    return {
        map: null,
        bounds: null,
        infobox: null,
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            
            var query = window.location.pathname;
             
            query = query.replace('/batchgeo/index/','');
            query = query.replace(/\/$/, "");
            var bits = query.split('/');
            
            var username = bits[0];
            bits.shift();
            var list = [];
//            
            for (var i = 0, len = bits.length; i < len; i++) {
                if( bits[i].length > 0 ){
                    list.push(bits[i]);
                }
            }
//            
            
            
            
            
            if( list.length > 0 && username.length > 0){
                batch.getProperties(username,list);
            }else if(list.length == 0 && username.length > 0){
                batch.getBatches(username);
            }else{
                batch.getUsers();
            }
            
            
        },
        getUsers: function(){
            $('#users').removeClass('hidden');
            $.ajax({
                type: 'post',
                url: '/batchgeo/ajaxGetUsers',
                success: function(response){
                    $('#users').html(response);
                }
            });
        },
        getBatches: function(username){
            $('#batches').removeClass('hidden');
            
            $.ajax({
                type: 'post',
                url: '/batchgeo/ajaxGetBatches',
                data: {username:username},
                success: function(response){
                    $('#batches').html(response);
                }
            });
        },
        getProperties: function(username,list){
            
            $('#map').removeClass('hidden');
            
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/batchgeo/ajaxGetProperties',
                data: {username:username,names:list.join()},
                success: function(response){
                    //console.log(response);
                    batch.drawMap(response);
                }
            });
            
            
        },
        drawMap: function(properties){
            batch.createInfobox();
            var height = $(window).height();
            $('#map').height(height - 100);
            
            
            var mapOptions = {
                center: {lat: 33.5, lng: -112},
                scrollwheel: true,
                zoom: 8,
                mapTypeId : 'roadmap',
            };
                
            
            batch.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            batch.bounds = new google.maps.LatLngBounds();

            
            $.each(properties, function (i, p) {
                
                console.log(p);
                var pin;
                switch(p.color){
                    case 'green':
                        pin = 'marker-green.png';
                        break;
                    case 'yellow':
                        pin = 'marker-yellow.png';
                        break;
                    case 'blue':
                        pin = 'marker-blue.png';
                        break;
                    case 'black':
                        pin = 'marker-black.png';
                        break;
                    case 'magenta':
                        pin = 'marker-magenta.png';
                        break;
                    default:
                        pin = 'marker-red.png';
                        break;
                    
                }
                
                var latlng = new google.maps.LatLng(p.latitude,p.longitude);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: batch.map,
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
                batch.bounds.extend(latlng);
                batch.map.fitBounds(batch.bounds);
                
                var infoboxContent = '<div class="infoW">' +
                    '<div class="propImg">' +
                    '<div style="background-color: #0d9095;height: 40px"></div>' +
                    '<div class="propBg">' +
                    '<div class="propPrice">$' + p.price.toLocaleString() + '</div>' +
                    '<div class="propType" style="color: #505050">' + p.name + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="paWrapper">' +
                    '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + p.address + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + address[1] + '</div>' +
                    '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: bold">' + p.city + ' ' + p.state + ' ' + p.zip + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.purchase + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.sale + '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="infoButtons">' +
                    '<a class="btn btn-xs btn-round btn-gray btn-o closeInfo">Close</a>' +
                    '</div>' +
                    '</div>';
                
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        batch.infobox.setContent(infoboxContent);
                        batch.infobox.open(batch.map, marker);
                        batch.map.setZoom(19);
                        batch.map.setCenter(latlng);
                        batch.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    };
                })(marker, i));
                
                google.maps.event.addListener(batch.map, "click", function (event) {
                    batch.infobox.open(null, null);
                    batch.map.fitBounds(batch.bounds);
                    batch.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                });
                
            });//!each
            
            
            
        },
        createInfobox: function() {
            batch.infobox = new InfoBox({
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
    };
}($));
$(window).load(function() {batch.init();});