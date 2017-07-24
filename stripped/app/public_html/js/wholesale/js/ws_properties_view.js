var ws_properties_view = (function($){
    return {
        id: $('#ws_property_id').val(),
        best: $('#best').val(),
        zest: $('#zestimate').val(),
        apn: $('#apn').val(),
        county: $('#county').val(),
        init: function(){
            $('.markSold').on('click',function(){
                var id = ws_properties_view.id;
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_properties/apiMarkAllSold',
                    data: {id:id},
                    success: function(response){
//                        console.log(response);
                        window.location.reload();
                    }
                });
            });
            $('.markActive').on('click',function(){
                var id = ws_properties_view.id;
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_properties/apiMarkAllActive',
                    data: {id:id},
                    success: function(response){
//                        console.log(response);
                        window.location.reload();
                    }
                });
            });
            $('.propertySold').on('blur',function(e){//not used
                var cp = $(this).attr('data-rel').split('|');
                var ws_contact_id = cp[0];
                var ws_property_id = cp[1];
                var sold_price = $(this).val();
                if(sold_price.length > 0){
//                    $.ajax({
//                        type: 'post',
//                        url: '/wholesale/ws_properties/apiAddSoldData',
//                        data: {ws_contact_id:ws_contact_id,ws_property_id:ws_property_id,sold_price:sold_price},
//                        success: function(response){
//                            console.log(response);
////                            window.location.reload();
//                        }
//                    });
                }
                

                
                
            });
            $('.wsPropertyFormField').on('blur',function(){
                var value = $(this).val().replace(/\D/g,'');
                var field = $(this).attr('id');
                ws_properties_view.dbUpdate(field,value);
                ws_properties_view.asisFill();
                
            });
            $('.offer').on('click',function(){
                $('#offerTip').toggleClass('hidden');
                
                
                var asis = $('#as_is').val();
                var out = '';
                for(i=75;i<86;i++){
                    out = out + i + '% &nbsp; $' + (asis * i / 100).toLocaleString() + '<br>';
                }
                
                
                $('#offerTipOutput').html(out);
            });
            $('.mhdelete').on('click',function(e){
                var id = $(this).attr('data-rel-id');
                ws_properties_view.deleteMarketingHistory(id);
                e.preventDefault();
            });
            $('.mhavail').on('click',function(e){
                var price = 0;
                var ids = $(this).attr('data-rel-id');
                var tag = $(this).attr('data-rel');
                price = $('#' + ids).val();
                
                ws_properties_view.sellerMarketingHistory(ids,tag,price);
                e.preventDefault();
            });
            $('.changepstat').on('click',function(e){
                
                var id = $(this).attr('data-rel-id');
                var pstat = $(this).text();
                
                $('#purchase_status').text('Purchase Status: ' + pstat);
                $('.purchase_list li').removeClass('active');
                $('.purchase_list li:contains(' + pstat + ')').addClass('active');
                
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_properties/apiUpdatePstat',
                    data: {id:id,purchase_status:pstat},
                    success: function(response){
                        console.log(response);
                    }
                });
                
                e.preventDefault();
            });
            $('.changesstat').on('click',function(e){
                
                var id = $(this).attr('data-rel-id');
                var sstat = $(this).text();
                
                $('#sale_status').text('Sale Status: ' + sstat);
                $('.sale_list li').removeClass('active');
                $('.sale_list li:contains(' + sstat + ')').addClass('active');
                
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_properties/apiUpdateSstat',
                    data: {id:id,sale_status:sstat},
                    success: function(response){
                        console.log(response);
                    }
                });
                
                e.preventDefault();
            });
            $('.remarksAccess').on('blur',function(){
                var value = $(this).val();
                var key = $(this).attr('id');
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_properties/apiRemarks',
                    data: {key:key,value:value,id:ws_properties_view.id},
                    success: function(response){
                        console.log(response);
                    }
                });
            });
            ws_properties_view.checkDeedHistory();
            ws_properties_view.asisFill();
        },
        checkDeedHistory: function(){
            var id = ws_properties_view.id;
            
            $.ajax({
                type: 'post',
                url: '/wholesale/ws_properties/apiDeedHistoryUpdate',
                async: true,
                data: {id:id},
                success: function(response){
                    console.log(response);
                }
            });
        },
        sellerMarketingHistory: function(ids,tag,price){
            
            $.ajax({
                type: 'post',
                url: '/wholesale/ws_properties/apiSellerMarketingHistory',
                data: {ids:ids,tag:tag,price:price},
                success: function(response){
                    console.log(response);
                    window.location.reload();
                }
            });
        },
        deleteMarketingHistory: function(id){
            $.ajax({
                type: 'post',
                url: '/wholesale/ws_properties/apideleteMarketingHistory',
                data: {id:id,ws_property_id:ws_properties_view.id},
                success: function(response){
                    console.log(response);
                    window.location.reload();
                }
            });
        },
        asisFill: function(){
            var v = $('#estimated_value').val().replace(/\D/g,'');
            var o = $('#offer').val().replace(/\D/g,'');
            var z = ws_properties_view.zest;
            var a = ws_properties_view.best;
            
            var est_rep = $('#estimated_repairs').val().replace(/\D/g,'');
            if(v.length != 0 && est_rep.length != 0){
                var asis = v - est_rep;
                $('#as_is').val(asis);
            }
            
            if(v>0 && o>0){
                $('.sceneone').removeClass('hidden');
                var d = o/v - a/v;
                if(d>=0){
                    $('.sceneone .top').css({'width':a/v*100 + '%'});
                    $('.sceneone .mid').css({'width':d*100 + '%'});
                    $('.sceneone .bot').css({'width':"0%"});
                }else{
                    $('.sceneone .top').css({'width': o/v*100 + '%'});
                    $('.sceneone .mid').css({'width':'0%'});
                    $('.sceneone .bot').css({'width': Math.abs(d)*100 + '%'});
                }
                
            }else{
                $('.sceneone').addClass('hidden');
            }
            z=0;
            if(z>0){
                $('.scenetwo').removeClass('hidden');
                var d = .75 - a/z;
                if(d>=0){
                    $('.scenetwo .top').css({'width':a/v*100 + '%'});
                    $('.scenetwo .mid').css({'width':d*100 + '%'});
                    $('.scenetwo .bot').css({'width':"0%"});
                }else{
                    $('.scenetwo .top').css({'width': .75*100 + '%'});
                    $('.scenetwo .mid').css({'width':'0%'});
                    $('.scenetwo .bot').css({'width': Math.abs(d)*100 + '%'});
                }
                
            }else{
                $('.scenetwo').addClass('hidden');
            }
            
            
            
        },
        dbUpdate: function(field,value){
            
            var id = ws_properties_view.id;
            //var data = '{"id":' + id + ',"' + field + '":' + value + '}';
            //console.log(data);
            $.ajax({
                type: 'post',
                url: '/wholesale/ws_properties/apiPropertyUpdate',
                data: {id:id,field:field,value:value},
                success: function(response){
                    console.log(response);
                }
            });
        }
    };
}($));
$(window).load(function(){
    ws_properties_view.init();
});