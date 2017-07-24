(function($) {
    geoservice = {MAX_BATCH_LIMIT: 250, BATCH_SIZE: 10, LATENCY_NORMAL_S: 10, LATENCY_OQL_S: 5 * 60, over_query_limit_reached: false};

    google_calls_returned_count = 0;
    geodata = [];
    clog = true;

    $(window).load(function(){
        
        if (typeof google !== 'object' || typeof google.maps !== 'object') {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDcrQoeB1c3kIzuUuIsOkxreGGkgxN7mz0&v=3.exp&amp;libraries=geometry&amp;libraries=places";
            //script.src = "http://maps.googleapis.com/maps/api/js?libraries=geometry";
            document.body.appendChild(script);
        }
        
        (function(geocoded_max_batch, geocoded_bacthsize) {
            geocoded_try_count = 0;
            //start inner anonymous function
            (function getProperties() {
                if (clog)
                    console.log('##### Geocode: Fectching properties from DB #####');
                google_calls_returned_count = 0;
                $.ajax({
                    type: 'post',
                    //dataType    : 'json',
                    data: {batchsize: geocoded_bacthsize, fetchproperties: 1},
                    url: '/geocode/get_properties',
                    success: function(response) {

                        var success = false;
                        if (response.success) {
                            if (response.payload.count == 0) {
                                if (clog)
                                    console.log("##### Geocode: Nothing left to geocode #####");
                                return;
                            }

                            success = geocodeProperties(response.payload.properties);//pass property payload to geocodeProperties function 

                            if (null === success) {
                                //add what to do in this case
                                if (clog)
                                    console.log('geocodeProperties cant function...handle this part..for now no more geocoding frm this user');
                                return;
                            }
                            setTimeout(function() {
                                if (google_calls_returned_count < response.payload.count) {
                                    if (clog)
                                        console.log('Waiting for Google PseudoThread(all callbacks)');
                                    setTimeout(arguments.callee, 100);
                                    return;
                                }
                                if (clog)
                                    console.log('Google PseudoThread joined. Game on');

                                $.post("/geocode/update_properties",
                                        {properties: geodata},
                                function(data) {

                                    console.log(data);
                                    //console.log('Geocoded: ' + data);	
                                });
    //
                                geodata = [];
                                google_calls_returned_count = 0;

                                interval = geoservice.LATENCY_NORMAL_S;
                                if (geoservice.over_query_limit_reached) {
                                    if (clog)
                                        console.log('Google thread joined. Game on');
                                    interval = geoservice.LATENCY_OQL_S;
                                }
                                geocoded_try_count += response.payload.count;
                                if (geocoded_try_count < geocoded_max_batch * geocoded_bacthsize) {
                                    setTimeout(getProperties, interval * 1000);
                                } else {
                                    if (clog)
                                        console.log('Exhausted the define MAX_BATCH_LIMIT. Exiting');
                                }

                            }, 100);//!setTimeout within success callback

                        }//!response.success
                    }//!success
                });//!ajax
            })();//!end inner anonymous function




        })(geoservice.MAX_BATCH_LIMIT, geoservice.BATCH_SIZE);
        
    });

    function geocodeProperties(properties) {
        //if we encounter google.maps.GeocoderStatus.OVER_QUERY_LIMIT we throttle for 5min
        var geocoder = new google.maps.Geocoder();

        if (!geocoder) {
            if (clog)
                console.log('Couldnt create instance of google.maps.Geocoder..cant function without it');
            return null;
        }
        google_calls_returned_count = 0;
        geodata = [];
        $.each(properties, function(key, property) {
            
            var parts = property.split('_');
            var id = parts[0];
            var address = parts[1];

            geocoder.geocode({'address': address}, function(results, status) {
                if (clog)
                    console.log('=====geocoder.geocode===== google_calls_returned_count: ' + google_calls_returned_count);
                google_calls_returned_count++;
                if (clog)
                    console.log('Google Response Status: ' + property + '[' + status + ']');
                if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    geoservice.over_query_limit_reached = true;
                    return;
                }

                //var geocode='';
                if (status == google.maps.GeocoderStatus.OK) {
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                }
                geodata.push({id: id, latitude: lat, longitude: lng, georesponse: status});
                if (clog)
                    console.log('id: ' + id + ' latitude: ' + lat + ' longitude: ' + lng + ' georesponse: ' + status);
            });
        });

        return;
    }



})(jQuery);