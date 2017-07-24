var options = (function($){
    return{
        cntUrl: window.location.origin+"/options/",
        init: function(callback) {
            
            
            $('#OptionAddNew').on('click',function(){
                payload = {};
                $('.OptionAdd').each(function(){
                    
                    var key = $(this).attr('name');
                    var value = $(this).val();
                    payload[key] = value;
                    
                });
                
                var json = JSON.stringify(payload);
                
                $.ajax({
                    url: options.cntUrl + 'add',
                    type: 'post',
                    data: { data:json },
                    success: function(response){
                        window.location.reload();
                    }
                });
            });
            
            
            
        },
    };
}($));

$(window).load(function() {
   options.init();
});