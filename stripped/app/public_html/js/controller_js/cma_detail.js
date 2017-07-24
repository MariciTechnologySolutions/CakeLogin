var detail = (function($) {
    return {
        subject: null,
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            
            $('.comparable, .subject').on('click',function(e){
                
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
                                        
                                            
                                            imageOut += '<div class="ajax_content" style="height: 200px; overflow: hidden; padding: 5px 5px 5px 0px"><img src="'+imageUrl+'" style="width: 300px"></div>'
                                            
                                            
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
$(window).load(function() {detail.init();});