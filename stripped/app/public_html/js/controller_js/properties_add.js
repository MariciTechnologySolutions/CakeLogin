var add = (function($) {
    return {
        Url: window.location.origin+"/properties/",
        autocomplete: '',
        componentForm: {
            street_number: 'short_name',
            route: 'short_name',
            locality: 'short_name',
            administrative_area_level_1: 'short_name',
            administrative_area_level_2: 'short_name',
            postal_code: 'short_name'
        },
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            
            this.addressLookup();
//            $('#add_off_market_property').on('click',function(e){
//                var data = $('#offMarket').serialize();
//                add.submitFormData(data);
//                //console.log(data);
//                e.preventDefault();
//            });
            $("form#offMarket :input").on('blur',function(){
                
                if(add.emailValidate($('#listing_member_email').val()) == false){
                    $('#listing_member_email').css({border: '2px solid red'});
                    $('#listing_member_email').removeClass('success');
                }else{
                    $('#listing_member_email').css({border: '2px solid #5cb85c'}).addClass('success');
                    
                }
                //add.getInputs();
               
            });
            
        },
        emailValidate: function(email){
       
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        
        },
        getInputs: function(){
            var i = 0;
            $("form#offMarket :input").each(function(){
                
                if($(this).val().length == 0){
                    i++;
                } 
                //console.log(input);
            });
            //console.log('empty: '+ i);
            var e = 1;
            if($('#listing_member_email').hasClass('success')){
                e = 0;
            }
            //used to override condition for wholesale propert add.
            if($('#wholesaleAddForm').hasClass('hidden')){
                e = 0;
            }
            if(i==0 && e==0){
                $('#add_off_market_property').removeClass('hidden');
                $('#add_wholesale_property').removeClass('hidden');
                $('#reminder').addClass('hidden');
            }else{
                $('#add_off_market_property').addClass('hidden');
                $('#add_wholesale_property').addClass('hidden');
                $('#reminder').removeClass('hidden');
                $('#listing_member_email').removeClass('success')
            }
            
        },
        addressLookup: function() {
            autocomplete = new google.maps.places.Autocomplete(
                /** @type {HTMLInputElement} */(document.getElementById('addressLookup')),
                { types: ['geocode'] });

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                add.fillFields();
                add.getZillow();
            });            
        },
        fillFields: function(){
            var place = autocomplete.getPlace();
        console.log(place);
            for (var component in add.componentForm) {
                document.getElementById(component).value = '';
                document.getElementById(component).disabled = false;
            }

            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (add.componentForm[addressType]) {
                  var val = place.address_components[i][add.componentForm[addressType]];
                  document.getElementById(addressType).value = val;
                }
            }
        },
        getZillow: function(){
            var street_number = $('#street_number').val();
            var route = $('#route').val();
            var locality = $('#locality').val();
            var administrative_area_level_1 = $('#administrative_area_level_1').val();
            var administrative_area_level_2 = $('#administrative_area_level_2').val();
            var postal_code = $('#postal_code').val();
            
            //1)Get Zillow detail, pre-populate form
            $.ajax({
                dataType: 'text',
                type: 'post',
                data: {street_number:street_number,route:route,city:locality,state:administrative_area_level_1,zipcode:postal_code,county_code:administrative_area_level_2},
                url: '/properties/zLookup',
                success: function(response){
                    var obj = JSON.parse(response);
                    $.each(obj, function(i, t) {
                        //console.log(i + ' - ' + t);
                        //populate form
                        $('#' + i).val(t);
                    });

                }
            });
            
            if(administrative_area_level_2 == 'Maricopa County'){
                console.log('in Maricopa county condition');
                var search = street_number + ' ' + route;
                $.ajax({
                    type: 'post',
                    url: '/properties/search_maricopa/',
                    data: {data:search},
                    success: function(response){
                        var obj = JSON.parse(response);
                        $('#apn').val(obj.apn);
                        
                        $('#apnMsg').html('APN For Address: ' + obj.address);
                        //we have the apn... now get prop details from mcassessor
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/wholesale/ws_properties/apiGetMaricopaPropertyDetail',
                            data: {apn:obj.apn},
                            success: function(v){
                                //console.log(v);
                                if($('#subdivision').val().length == 0){
                                       $('#subdivision').val(v.subdivision);
                                   }
                                   if($('#parking').val().length == 0){
                                       $('#parking').val(v.garage);
                                   }
                                   if($('#pool').val().length == 0){
                                       $('#pool').val(v.pool);
                                   }
                                   if($('#appx_sqft').val().length == 0){
                                       $('#appx_sqft').val(v.sqft);
                                   }
                                   if($('#appx_lot_sqft').val().length == 0){
                                       $('#appx_lot_sqft').val(v.lot_sqft);
                                   }
                                   if($('#year_built').val().length == 0){
                                       $('#year_built').val(v.yr);
                                   }
                                   if($('#county_code').val().length == 0){
                                       $('#county_code').val('Maricopa');
                                   }
                                   
//                                   if($('#buyer').val().length == 0){
//                                       $('#buyer').val(v.buyer);
//                                   }
//                                   if($('#date').val().length == 0){
//                                        var date = '';
//                                        
//                                        var pattern = /^\d{2}\/\d{2}\/\d{4}$/;
//                                        var deed_date = pattern.test(v.deed_date);
//                                        var sale_date = pattern.test(v.sale_date);
//                                        
//                                        if(deed_date){
//                                            var date = v.deed_date;
//                                        }
//                                        
//                                        if(sale_date){
//                                            var date = v.sale_date;
//                                        }
//                                        
//                                        $('#date').val(date);
//                                   }
//                                   if($('#deed_price').val().length == 0){
//                                       $('#deed_price').val(v.deed_price);
//                                   }
                            }
                        });


                    }

                });
            }
        },
        submitFormData: function(data){
            $.ajax({
                type: 'post',
                url: '/properties/apiAddOffMarketProperty',
                data: {data:data},
                success: function(response){
                    //console.log(response);
                    window.location = response;
                }
            });
        },
        geoConstrainLookup: function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var geolocation = new google.maps.LatLng(
                        position.coords.latitude, position.coords.longitude);
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
                    autocomplete.setBounds(circle.getBounds());
                });
            }
        },
    };
}($));
$(window).load(function() {add.init();});