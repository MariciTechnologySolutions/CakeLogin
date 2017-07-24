var dashboard = (function($){
    return{
        cntUrl: window.location.origin+'/dashboard/',
        init: function(callback) {
            
            $('.category').on('click',function(){
                //console.log($(this));
                var status = $(this).attr('data-rel');
                var select;
                if($(this).hasClass('btn-default')){
                    //was not selected. select it now.
                    $(this).toggleClass('btn-default btn-blue');
                    select = 'true';
                    //console.log('select ' + status);
                }else{
                    //was selected. deselect it now.
                    $(this).toggleClass('btn-default btn-blue');
                    //console.log('deselect ' + status);
                    select = 'false';
                }
                $.ajax({
                    url: '/dashboard',
                    type: 'post',
                    data: {status:status,select:select},
                    success: function(response){
                        console.log(response);
                        window.location.reload();
                    }
                });
                
            });
            
            $('.submit').bind('click',function(){
                var id = $(this).closest('button').attr('data-rel-id');
                $('#row_' + id).addClass('hidden');
                dashboard.updateProperty(id);
            })
            
            $('.pstat, .sstat').on('click',function(){
                var id = $(this).attr('data-rel-id');
                
                $.ajax({
                    url: '/properties/statusupdate',
                    type: 'post',
                    data: {id:id},
                    success: function(response){
                        console.log(response);
                        window.location.reload();
                    }
                });
            });
            
            $('.checkboxupdate').on('change',function(){
                var $t = $(this);
                var id    = $t.attr('data-rel-id');
                var value = $t.is(":checked");
                var field = $t.attr('data-rel');
                //console.log(id + ' ' + value + ' ' + field);
                $.ajax({
                    url: '/properties/checkboxupdate',
                    type: 'post',
                    data: {id:id,field:field,value:value},
                    success: function(response){
                        console.log(response);
                         
                    }
                });
            });
            
            $('.fieldupdate').on('change',function(){
                var $t = $(this);
                var id    = $t.attr('data-rel-id');
                var value = $t.val();
                var field = $t.attr('data-rel');
                //console.log(id + value + field);
                $.ajax({
                    url: '/properties/fieldupdate',
                    type: 'post',
                    data: {id:id,field:field,value:value},
                    success: function(response){
                        console.log(response);
                         
                    }
                });
                
            });
            
            $('.priceupdate').on('change',function(){
                
                var $t = $(this);
                var id    = $t.attr('data-rel-id');
                var value = $t.val();
                var field = $t.attr('data-rel');
                if(field == 'est_income'){
                    $('#est_' + id).val(value);
                }
                $.ajax({
                    url: '/properties/dashboard_prices',
                    type: 'post',
                    data: {id:id,field:field,value:value},
                    success: function(response){
                        //console.log(response);
                        $t.val(response); 
                        var total = 0;
                        $('.estimate').each(function(){
                                total += +$(this).val(); 
                        });
                        var t = dashboard.numberWithCommas(total);
                        $('#est_income').text(t);
                    }
                });
            });
            
            $(".datepicker").datepicker({
                format: "yyyy-mm-dd",
                todayBtn: true,
                orientation: "top auto",
                daysOfWeekDisabled: "0,6",
                autoclose: true,
                todayHighlight: true,
                clearBtn: true
            }).on('changeDate',function(e){
                var id    = $(this).attr('data-rel-id');
                var field = $(this).attr('data-rel');
                var date  = $(this).val();
                
                  $.ajax({
                    url: '/properties/dashboard_dates',
                    type: 'post',
                    data: {id:id,field:field,date:date},
                    success: function(response){
                        console.log(response);
                    }
                });
            });
            
            dashboard.autoRefresh();
            
        },
        updateProperty: function(id){
            var public_remarks = $('.public_remarks_' + id).val();
            var private_remarks = $('.private_remarks_' + id).val();
            $.ajax({
                url: vegas.cntUrl + 'remarks',
                //dataType: 'json',
                type: 'post',
                data: {id:id,public_remarks:public_remarks,private_remarks:private_remarks},
                success: function(data){
                    console.log(data);

                    
                }
            });
        },
        numberWithCommas: function(x){
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        autoRefresh: function(){
            var url = window.location.href;
            var search = 'auto';
            var n = url.indexOf(search);
            if(n > 0){
                setTimeout(function(){
                    window.location.reload(1);
                }, 60000);
            }
        }
    };
}($));
$(window).load(function() {
   dashboard.init(); 
});