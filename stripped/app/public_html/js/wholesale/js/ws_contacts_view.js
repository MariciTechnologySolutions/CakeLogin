var ws_contacts_view = (function($) {
    return {
        url: window.location.origin+"/wholesale/",
        autocomplete: '',
        componentForm: {
            street_number: 'short_name',
            route: 'short_name',
            locality: 'short_name',
            administrative_area_level_1: 'short_name',
            administrative_area_level_2: 'short_name',
            postal_code: 'short_name'
        },
        table: $('#datatable').DataTable(),
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            this.addressLookup();
            $('.contactSearch').on('keyup',function(){
                var data = $('#WsContact').serialize();
                ws_contacts_view.search(data);
            });
            $('.website').on('click',function(e){
                var id = $(this).attr('data-rel-id');
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_contacts/apiUpdateWebsiteViewTime',
                    data: {id:id},
                    success: function(response){
                        console.log(response);
                        
                    }
                });
            });
            $('.deleteWebsite').on('click',function(e){
                var id = $(this).attr('data-rel-id');
                var ws_contact_id = $(this).attr('data-rel');
                
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_contacts/deleteWebsite/',
                    data: {id:id,ws_contact_id:ws_contact_id},
                    success: function(response){
                        console.log(response);
                        window.location.reload();
                    }
                });
                
                e.preventDefault();
            });
            $('#addNewPropertyButton').on('click',function(e){
                $('#NewPropertyForm').toggleClass('hidden');
                e.preventDefault();
            });
            $('#add_wholesale_property').on('click',function(e){
                var data = $('#offMarket').serialize();
                ws_contacts_view.formSubmit(data);
                e.preventDefault();
            });
            $('.datatable').DataTable({
                "order": [[ 6, "asc" ]],
                "pageLength": 25
            });
            $('#addressLookup').on('keyup',function(){
                var search = $(this).val();
                ws_contacts_view.duplicatePropertySearch(search);
                $('.psearch').css({'background-color':"yellow"});
            });
            $("form#offMarket :input").on('blur',function(){
                
                if(ws_contacts_view.emailValidate($('#listing_member_email').val()) == false){
                    $('#listing_member_email').css({border: '2px solid red'});
                    $('#listing_member_email').removeClass('success');
                }else{
                    $('#listing_member_email').css({border: '2px solid #5cb85c'}).addClass('success');
                    
                }
                ws_contacts_view.getInputs();
               
            });
            $('.editEmail').on('click',function(e){
                var id = $(this).attr('data-rel-id');
                var email = $(this).closest('td').prev('td').text();
                
                $('#WsEmailId').val(id);
                $('#WsEmailEmail').val(email);
                
                e.preventDefault();
            });
            $('.deleteEmail').on('click',function(e){
                var id = $(this).attr('data-rel-id');
                
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_emails/delete',
                    data: {id:id,deleted:1},
                    success: function(response){
                        //console.log(response);
                        window.location.reload();
                    }
                });
                e.preventDefault();
            });
            $('#sendSms').on('click',function(e){
                var ws_contact_id = $('#ws_contact_id').val();
                var message = $('#msgSms').val();
                $.ajax({
                    type: 'post',
                    url: '/twilio/twilio/ws_contact_msg',
                    data: {ws_contact_id:ws_contact_id,message:message},
                    success: function(response){
                        //console.log(response);
                        window.location.reload();
                    }
                });
                e.preventDefault();
            });
            
        },
        match: function(property_id){
            
            $.ajax({
                type: 'post',
                url: '/wholesale/ws_properties/apiGetWsProperty',
                data: {property_id:property_id},
                success: function(response){
                    
                    var obj = JSON.parse(response);
                    
                    var str = '<div class="row mb5">';
                        str = str + '<div class="col-sm-6">';
                        str = str + '<input id="address" class="form-control" type="text" name="address" value="';
                        str = str + obj.WsProperty.address;
                        str = str + '"></div></div>';
                    
                    $('.parsedAddress').replaceWith(str);
                    $('#city').val(obj.WsProperty.city);
                    $('#state').val(obj.WsProperty.state);
                    $('#zipcode').val(obj.WsProperty.zip);
                    $('#subdivision').val(obj.WsProperty.subdivision);
                    $('#bedrooms').val(obj.WsProperty.bedrooms);
                    $('#bathrooms').val(obj.WsProperty.bathrooms);
                    $('#parking').val(obj.WsProperty.parking);
                    $('#pool').val(obj.WsProperty.pool);
                    $('#appx_sqft').val(obj.WsProperty.sqft);
                    $('#appx_lot_sqft').val(obj.WsProperty.lot_sqft);
                    $('#year_built').val(obj.WsProperty.year_built);
                    $('#apn').val(obj.WsProperty.apn);
                    $('#list_price').val(obj.WsProperty.price);
                    $('#public_remarks').val(obj.WsProperty.remarks);
                    $('#county_code').val(obj.WsProperty.county);
                    $('#zestimate').val(obj.WsProperty.zestimate);
                    $('#latitude').val(obj.WsProperty.latitude);
                    $('#longitude').val(obj.WsProperty.longitude);
                    $('#duplicate').val(obj.WsProperty.id);
                    
                    $('#add_wholesale_property').removeClass('hidden');
                    $('#reminder').addClass('hidden');
                }
            });
            
            
        },        
        duplicatePropertySearch: function(search){
            $.ajax({
                type: 'post',
                url: '/wholesale/ws_properties/apiSearchDuplicate',
                data: {search:search},
                success: function(response){
                    $('.psearch').html(response);
                }
            });
        },        
        formSubmit: function(data){
            $.ajax({
                type: 'post',
                url: '/wholesale/ws_contacts/apiAddProperty',
                data: {data:data},
                success: function(response){
                    console.log(response);
                    window.location = response;
                }
            });
        },
        search: function(data){
            $.ajax({
                type: 'post',
                url: this.url + "ws_contacts/search",
                data: {data:data},
                success: function(response){
                    $('#output').html(response);
                }
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
            
            //if(i==0 ){
//                $('#add_off_market_property').removeClass('hidden');
//                $('#add_wholesale_property').removeClass('hidden');
//                $('#reminder').addClass('hidden');
//            }else{
//                $('#add_off_market_property').addClass('hidden');
//                $('#add_wholesale_property').addClass('hidden');
//                $('#reminder').removeClass('hidden');
//                $('#listing_member_email').removeClass('success')
//            }
            
        },
        addressLookup: function() {
            autocomplete = new google.maps.places.Autocomplete(
                /** @type {HTMLInputElement} */(document.getElementById('addressLookup')),
                { types: ['geocode'] });

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                ws_contacts_view.fillFields();
                ws_contacts_view.getZillow();
                
                
            });            
        },
        fillFields: function(){
            var place = autocomplete.getPlace();
        
            for (var component in ws_contacts_view.componentForm) {
                document.getElementById(component).value = '';
                document.getElementById(component).disabled = false;
            }

            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (ws_contacts_view.componentForm[addressType]) {
                  var val = place.address_components[i][ws_contacts_view.componentForm[addressType]];
                  document.getElementById(addressType).value = val;
                  //console.log(addressType);
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

            $.ajax({
                dataType: 'text',
                type: 'post',
                data: {street_number:street_number,route:route,city:locality,state:administrative_area_level_1,zipcode:postal_code,county_code:administrative_area_level_2},
                url: '/properties/zLookup',
                success: function(response){
                    var obj = JSON.parse(response);
                    //console.log('got zillow data back.');
                    $.each(obj, function(i, t) {
                        //console.log(i + ' - ' + t);
                        //populate form
                        $('#' + i).val(t);
                    });

                }
            });
            var search = street_number + ' ' + route;
            if(administrative_area_level_2 == 'Maricopa County'){
                
                $('.maricopa').removeClass('hidden');
                
                //console.log('now look up mcassessor for single apn');
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_properties/search_maricopa/',
                    data: {data:search},
                    success: function(response){
                        var obj = JSON.parse(response);
                        
                        $('#apn').val(obj.apn);
                        
                        $('#apnMsg').html('APN For Address: <br>' + obj.address).removeClass('hidden');
                        
                        //get missing property details from mcassessor site
                        //send apn to properties controller, new mcassesor, return array to the controller, echo json_encoded response
                        
                        var apn = obj.apn;
                        //console.log('APN: ' + apn);
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/wholesale/ws_properties/apiGetMaricopaPropertyDetail',
                            data: {apn:apn},
                            success: function(v){
                               
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
                                   
                                   if($('#buyer').val().length == 0){
                                       $('#buyer').val(v.buyer);
                                   }
                                   if($('#date').val().length == 0){
                                        var date = '';
                                        
                                        var pattern = /^\d{2}\/\d{2}\/\d{4}$/;
                                        var deed_date = pattern.test(v.deed_date);
                                        var sale_date = pattern.test(v.sale_date);
                                        
                                        if(deed_date){
                                            var date = v.deed_date;
                                        }
                                        
                                        if(sale_date){
                                            var date = v.sale_date;
                                        }
                                        
                                        $('#date').val(date);
                                   }
                                   if($('#deed_price').val().length == 0){
                                       $('#deed_price').val(v.deed_price);
                                   }
                                   
                                   
                                
                                //});
                               
                               
//                                Object
//                                address:"8214 E Teton St"
//                                apn:"219-35-147"
//                                carport:""
//                                city:"Mesa"
//                                county:"Maricopa"
//                                deedDate:"August 04, 2005"
//                                garage:"3"
//                                legal:"STONECLIFF AT LAS SENDAS MOUNTAIN AMD MCR 606-32"
//                                lot_sqft:"11884"
//                                mailingAddress:"1660 VIA INSPIRAR , SAN MARCOS, CA 92078 "
//                                owner:"CLARK RANDALL/SANDY"
//                                pool:"Yes"
//                                salePrice:"$1,020,000"
//                                sqft:"2,641"
//                                state:"AZ"
//                                subdivision:"STONECLIFF AT LAS SENDAS MOUNTAIN AMD"
//                                yr:"2004"
//                                zip:"85207" 

                                
                                
                               
                            }
                        });
                    }

                });
            }
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
$(window).load(function(){
    ws_contacts_view.init();
});