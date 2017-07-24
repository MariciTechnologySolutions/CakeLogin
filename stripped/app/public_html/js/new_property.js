var add = (function($) {
    return {
        Url: window.location.origin+"/properties/",
        autocomplete: '',
        err: 0,
        tmp: '',
        latitude: 0,
        longitude: 0,
        componentForm: {
            street_number: 'short_name',
            route: 'short_name',
            locality: 'short_name',
            administrative_area_level_1: 'short_name',
            administrative_area_level_2: 'short_name',
            postal_code: 'short_name'
        },
        init: function() {
            
            
            //$('#offMarket').hide().removeClass('hidden');
            
            this.addressLookup();
            
            //$('#addressLookup').on('focus',function(){
                //$('.alert').addClass('hidden');
            //});
            //$('.validate').on('focus',function(){
                //$('.alert').addClass('hidden');
                //$('#bogus').addClass('hidden')
            //});
            //$('.validate').on('blur',function(){
                //console.log('run add.validate()');
                //add.validate();
            //});
            
            //** SUBMIT DATA **//
            $('#add_off_market_property').on('click',function(e){
                
                //on submit.... hide the submit button and show the spinner.
                $('#add_off_market_property').addClass('hidden');
                $('#add_off_market_property_spinner').removeClass('hidden');
                
                var seller = $('#listing_member_name').val();
                var phone  = $('#listing_member_phone').val();
                var email  = $('#listing_member_email').val();
                var hoa_paid = $('#hoa_paid').val();
               
                
                if(seller.length == 0 || phone.length == 0 || email.length == 0){
                    alert('All Seller Contact and HOA Fields are Required');
                    return false;
                }
                
                
                var data = $('#offMarket').serialize();
                add.submitFormData(data);
                //console.log(data);
                e.preventDefault();
            });
            
            //** VALIDATE EMAIL ADDRESS **//
            $("form#offMarket :input").on('blur',function(){
                
                if(add.emailValidate($('#listing_member_email').val()) == false){
                    $('#listing_member_email').css({border: '2px solid red'});
                    $('#listing_member_email').removeClass('success');
                }else{
                    $('#listing_member_email').css({border: '2px solid #5cb85c'}).addClass('success');
                    
                }
                //add.getInputs();
               
            });
            
            //** SET PAGE HEIGHT **//
            $('.panel-body').height($(window).height() - 160);
            
            //** ON PAGE LOAD, GET SELLER INFO FROM PREVIOUS SUBMISSION **//
            $('.ck').on('blur',function(){
                var key   = $(this).attr('id');
                var value = $(this).val();
                add.createCookie(key,value);
            });
            add.getCookies();
            
            $('.hoa_freq').on('click',function(e){
                $('#hoa_paid').val($(this).text());
                e.preventDefault();
            });
            $('.county_select').on('click',function(e){
                console.log($(this).text());
                $('#county_code').val($(this).text());
                e.preventDefault();
            });
            
        },
        inArray: function(needle, haystack){
            var length = haystack.length;
            for(var i = 0; i < length; i++) {
                if(haystack[i] == needle) return true;
            }
            return false;
        },
        validate: function(){
            add.err = 0;
            add.tmp = '';
            $('#spinner').addClass('hidden');
            setTimeout(function() {
                $('#offMarket').fadeIn('slow');
                $('#allInfo').removeClass('hidden');
            }, 500);
            
            $("form#offMarket :input").each(function(){
                
                var id = $(this).attr('id');
                var val = $(this).val();
                
                if(id == 'dwelling_type'){
                    $("#sfr").removeClass('alert-info');
                    if(val != 'Single Family - Detached'){
                        $("#sfr").removeClass('alert-success');
                        $("#sfr").addClass('alert-danger');
                        add.err++;
                        add.tmp = add.tmp + id;
                    }else{
                        $("#sfr").removeClass('alert-danger');
                        $("#sfr").addClass('alert-success');
                    }
                }
                
                if(id == 'score_school_avg'){
                    $("#school").removeClass('alert-info');
                    if(val < 5){
                        $("#school").removeClass('alert-success');
                        $("#school").addClass('alert-danger');
                        add.err++;
                        add.tmp = add.tmp + id;
                    }else{
                        $("#school").removeClass('alert-danger');
                        $("#school").addClass('alert-success');
                    }
                }
                
                if(id == 'year_built'){
                    $("#age").removeClass('alert-info');
                    if(val < 1980){
                        $("#age").removeClass('alert-success');
                        $("#age").addClass('alert-danger');
                        add.err++;
                        add.tmp = add.tmp + id;
                    }else{
                        $("#age").removeClass('alert-danger');
                        $("#age").addClass('alert-success');
                    }
                }
                
                if(id == 'bathrooms'){
                    $("#baths").removeClass('alert-info');
                    if(val < 1.75){
                        $("#baths").removeClass('alert-success');
                        $("#baths").addClass('alert-danger');
                        add.err++;
                        add.tmp = add.tmp + id;
                    }else{
                        $("#baths").removeClass('alert-danger');
                        $("#baths").addClass('alert-success');
                    }
                }
                
                if(id == 'bedrooms'){
                    $("#beds").removeClass('alert-info');
                    if(val < 3){
                        $("#beds").removeClass('alert-success');
                        $("#beds").addClass('alert-danger');
                        add.err++;
                        add.tmp = add.tmp + id;
                    }else{
                        $("#beds").removeClass('alert-danger');
                        $("#beds").addClass('alert-success');
                    }
                }
                
                if(id == 'appx_sqft'){
                    $("#small").removeClass('alert-info');
                    if(val < 1200 || val > 2800){
                        $("#small").removeClass('alert-success');
                        $("#small").addClass('alert-danger');
                        add.err++;
                        add.tmp = add.tmp + id;
                    }else{
                        $("#small").removeClass('alert-danger');
                        $("#small").addClass('alert-success');
                    }
                }
                
                var cities = ['Phoenix','Chandler','Mesa','Gilbert','Tempe','Surprise','Litchfield Park','Peoria','Ahwatukee','El Mirage','Laveen','Glendale','San Tan Valley','Queen Creek'];
                if(id == 'city'){
                    $("#cities").removeClass('alert-info');
                    if(!add.inArray(val,cities)){
                        $("#cities").removeClass('alert-success');
                        $("#cities").addClass('alert-danger');
                        add.err++;
                        add.tmp = add.tmp + id;
                    }else{
                        $("#cities").removeClass('alert-danger');
                        $("#cities").addClass('alert-success');
                    }
                }
                
                if(id == 'county_code'){
                    $("#county").removeClass('alert-info');
                    if(!add.inArray(val,['Maricopa','Pinal'])){
                        $("#county").removeClass('alert-success');
                        $("#county").addClass('alert-danger');
                        add.err++;
                        add.tmp = add.tmp + id;
                    }else{
                        $("#county").removeClass('alert-danger');
                        $("#county").addClass('alert-success');
                    }
                }
                
                 
            });
            if(add.err > 0){
                $('#bogus').removeClass('hidden');
                $('#success').addClass('hidden');
            }else{
                $('#success').removeClass('hidden');
                $('#bogus').addClass('hidden');
            }
            
            
            
            


        },
        getCookies: function(){
            
            var name  = add.readCookie('listing_member_name');
            var phone = add.readCookie('listing_member_phone');
            var email = add.readCookie('listing_member_email');
            
            if(name != null){
                $('#listing_member_name').val(name);
            }
            if(phone != null){
                $('#listing_member_phone').val(phone);
            }
            if(email != null){
                $('#listing_member_email').val(email);
            }
            
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
            });
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
            
            add.latitude  = place.geometry.location.lat();
            add.longitude = place.geometry.location.lng();
            
            $('#latitude').val(add.latitude);
            $('#longitude').val(add.longitude);
            
            for (var component in add.componentForm) {
                document.getElementById(component).value = '';
                document.getElementById(component).disabled = false;
            }
            
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                
                if (add.componentForm[addressType]) {
                    
                  var val = place.address_components[i][add.componentForm[addressType]];
                  
                  if(addressType == 'street_number'){
                      document.getElementById('str_number').value = val;
                  }
                  if(addressType == 'locality'){
                      document.getElementById('city').value = val;
                  }
                  if(addressType == 'administrative_area_level_1'){
                      document.getElementById('state').value = val;
                  }
                  if(addressType == 'administrative_area_level_2'){
                      document.getElementById('county_code').value = val.replace('County','').trim();
                  }
                  if(addressType == 'postal_code'){
                      document.getElementById('zipcode').value = val;
                  }
                  if(addressType == 'route'){
                      
                        $.ajax({
                            dataType: 'json',
                            type: 'post',
                            data: {route:val},
                            url: '/properties/javascriptApiParseRoute',
                            success: function(obj){
                                $.each(obj.data, function(i, t) {
                                    $('#' + i).val(t);
                                });
                            }
                        });
                  }
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
            var latitude  = add.latitude;
            var longitude = add.longitude;
            
            
            //1)Get Zillow detail, pre-populate form
            $.ajax({
                dataType: 'json',
                type: 'post',
                data: {street_number:street_number,route:route,city:locality,state:administrative_area_level_1,zipcode:postal_code,county_code:administrative_area_level_2,latitude:latitude,longitude:longitude},
                url: '/properties/zLookup',
                success: function(obj){
                    //console.log('------Zillow------------');
                    //console.log(obj);
                    //console.log('------------------');
                    //this first section parses the address and fills the address form fields from the google data.
                    $.each(obj.data, function(i, t) {
                        $('#' + i).val(t);
                    });
                }
            });
            
            if(administrative_area_level_2 == 'Pinal County'){
                
                var street_number = $('#street_number').val();
                
                $.ajax({
                    type: 'post',
                    url: '/properties/search_pinal',
                    data: {street_number:street_number,route:route},
                    success: function(response){
                        var obj = JSON.parse(response);
                        if(obj.success == 'true'){
                            
                            
                            $('#apn').val(obj.data.apn);
                            if($('#subdivision').val().length == 0){
                                $('#subdivision').val(obj.data.subdivision);
                            }
                            if($('#appx_sqft').val().length == 0){
                                $('#appx_sqft').val(obj.data.appx_sqft);
                            }
                            if($('#appx_lot_sqft').val().length == 0){
                                $('#appx_lot_sqft').val(obj.data.appx_lot_sqft);
                            }
                            if($('#year_built').val().length == 0){
                                $('#year_built').val(obj.data.year_built);
                            }
                            if($('#county_code').val().length == 0){
                                $('#county_code').val('Pinal');
                            }
                            
                        }
                        add.validate();
                    }
                });
                
            }
            
            if(administrative_area_level_2 == 'Maricopa County'){
                
                
                var search = street_number + ' ' + route;
                
                $.ajax({
                    type: 'post',
                    //dataType: 'json',
                    url: '/properties/search_maricopa',
                    data: {data:search},
                    success: function(response){
                        if(response.length > 0){
                            var obj = JSON.parse(response);
                            $('#apn').val(obj.apn);

                            //$('#apnMsg').html('APN For Address: ' + obj.address);
                            //we have the apn... now get prop details from mcassessor
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                url: '/properties/apiGetMaricopaPropertyDetail',
                                data: {apn:obj.apn},
                                success: function(v){
                                    //console.log(v);
                                    if($('#subdivision').val().length == 0){
                                        $('#subdivision').val(v.subdivision);
                                    }
                                    if($('#parking').val().length == 0){
                                        $('#parking').val(v.garage + 'G');
                                    }
                                    if($('#pool').val().length == 0){
                                        $('#pool').val(v.pool);
                                    }
                                    if($('#appx_sqft').val().length == 0){
                                        $('#appx_sqft').val(v.sqft.replace(/[^0-9]/g,''));
                                    }
                                    if($('#appx_lot_sqft').val().length == 0){
                                        $('#appx_lot_sqft').val(v.lot_sqft.replace(/[^0-9]/g,''));
                                    }
                                    if($('#year_built').val().length == 0){
                                        $('#year_built').val(v.yr.replace(/[^0-9]/g,''));
                                    }
                                    if($('#county_code').val().length == 0){
                                        $('#county_code').val('Maricopa');
                                    }

                                }
                                
                            });//!ajax
                        }
                        add.validate();
                    }
                    
                });
            }
            
            
            
        },
        submitFormData: function(data){
            console.log(data);
            $.ajax({
                type: 'post',
                url: '/properties/apiPublicAddNewProperty',
                data: {data:data},
                success: function(response){
                    
//                    console.log(response);
//                    return;
                    if(response.success == 'error'){
                        $.each(response.data,function(k,v){
                            $('#' + v).removeClass('hidden');
                        });
                    }else{
                        window.location.reload();
                    }
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
        createCookie: function(name,value,days, path) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            var path = path || "/";
            document.cookie = name+"="+value+expires+"; path="+path;
        },
        readCookie: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },
    };
}($));
$(window).load(function() {
    add.init();
});



//var property = (function($) {
//    return {
//        init: function() {
//            //this.__proto__ = Pankaj;
//            //this.initialize();
//            this.eventHandlers();
//            
//            $('.panel-body').height($(window).height() - 160);
//            
//        },
//        eventHandlers: function() {
//            
//        }
//    };
//}($));
//$(window).load(function() {property.init();});