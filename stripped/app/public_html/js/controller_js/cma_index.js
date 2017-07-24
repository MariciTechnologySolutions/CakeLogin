var index = (function($) {
    return {
        subject: null,
        cma: [],
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            
            
            $('.remove').on('click',function(e){
                
                var id = $(this).closest('tr').attr('id');
                $(this).closest('tr').fadeOut(1500);    
                    
                e.preventDefault();
            });
            
            $('.cma').on('click',function(e){
                
                var id = $(this).closest('tr').attr('id');
                id = id.replace('card_','');
                
                if(Pankaj.inArray(id,index.cma)){
                    //remove
                    var i = $.inArray(id, index.cma);
                    if (i != -1) {
                        index.cma.splice(i,1);
                    }
                    $(this).closest('tr').removeClass('prop_highlight');
                    
                }else{
                    //add
                    index.cma.push(id);
                    $(this).closest('tr').addClass('prop_highlight');
                }
                
                var mls_data_id = $('#mls_data_id').text();
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/cma/ajaxGetFilteredCompsFromSession',
                    data: {mls_data_id:mls_data_id},
                    success: function(response){
                        
    
                        
                    }
                });
                
                    
                e.preventDefault();
            });
            
            $('.subject').on('click',function(e){
                
                var mls_data_id = $('#mls_data_id').text();
                var id = $(this).attr('data-rel');
                console.log(id);
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/cma/ajaxGetSubjectFromSession',
                    data: {mls_data_id:mls_data_id},
                    success: function(response){
                        var ignore = ['images','latitude','longitude','sub_match','id'];
                        
                        var out = '';
                                
                                $.each( response, function(i,v) {
                                    
                                    if(!Pankaj.inArray(i,ignore)){
                                        out += i + ': ' + v + '<br>';
                                    }
                                    if(i == 'images'){
                                        var imageOut = '';
                                        var obj = JSON.parse(v);
                                        
                                        $.each(obj, function(imageIndex,imageUrl){
                                            imageOut += '<div class="ajax_content" style="float:left; height: 200px; overflow: hidden; padding: 5px 5px 5px 0px"><img src="'+imageUrl+'" style="width: 300px"></div>'
                                        });
                                        
                                        $('#imageDiv').html(imageOut);
                                    }
                                });
                        $('#detailDiv').html(out);
                    }
                });
                
                e.preventDefault();
            })
            
            $('.comparable').on('click',function(e){
                
                var mls_data_id = $('#mls_data_id').text();
                var id = $(this).attr('data-rel');
                console.log(id);
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/cma/ajaxGetFilteredCompsFromSession',
                    data: {mls_data_id:mls_data_id},
                    success: function(response){
                        
                        var ignore = ['images','latitude','longitude','sub_match','id'];
                        
                        var out = '';
                        $.each( response, function( key, value ) {
                            
                            if(value.id == id){
                                
                                $.each( value, function(i,v) {
                                    
                                    if(!Pankaj.inArray(i,ignore)){
                                        out += i + ': ' + v + '<br>';
                                    }
                                    
                                    if(i == 'images'){
                                        
                                        var imageOut = '';
                                        var obj = JSON.parse(v);
                                        
                                        $.each(obj, function(imageIndex,imageUrl){
                                            
                                            imageOut += '<div class="ajax_content" style="float:left; height: 200px; overflow: hidden; padding: 5px 5px 5px 0px"><img src="'+imageUrl+'" style="width: 300px"></div>'
                                            
                                        });
                                        
                                        $('#imageDiv').html(imageOut);
                                    }
                                    
                                });
                                
                            }
                            
                        });
                        
                        $('#detailDiv').html(out);
                        
                    }
                });
                
                $('.ajax_content').each(function(){
                    //$(this).resize();
                });
                e.preventDefault();
            })
            
            
        }
    };
}($));
$(window).load(function() {index.init();});