var profile = (function($) {
    return {
        url: window.location.origin+"/investors",
        init: function() {
            
            $('.rate').raty({
                click: function(score, evt) {} 
            });
                
            profile.getProfile();
                
        },
        getProfile: function(){
            
            var id = $('#investor_id').val();
            
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/investors/getProfile',
                data: {id:id},
                success: function(response){
                    //console.log(response);
                    
                    $.each(response,function(k,v){
                        if(k == 'note'){
                            $('#' + k).val(v);
                        }else{
                            $('#' + k).raty({score: v});
                        }
                        
                    });
                    
                }
            });
            
        },
        rate: function(){
            
            var data = new Array();
            $("input.rateit,textarea.rateit").each(function() {
                data[$(this).attr('id')] = $(this).val();
                
           });
           var test = data.serialize();
           console.log(test);
           
//           $.ajax({
//               type: 'post',
//               url: '/investors/profile/' + i.uuid,
//               data: {data:data},
//               success: function(response){
//                   console.log(response);
//               }
//           });
            
        }
    };
}($));
$(window).load(function() {profile.init();});