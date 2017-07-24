var vegas = (function($){
    return{
        cntUrl: window.location.origin+'/lasvegas/',
        init: function(callback) {
            $('.submit').bind('click',function(){
                var id = $(this).closest('button').attr('data-rel-id');
                $('#row_' + id).addClass('hidden');
                vegas.updateProperty(id);
                
            })
        },
        updateProperty: function(id){
            var public_remarks  = $('.public_remarks_' + id).val();
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
    };
}($));
$(window).load(function() {
   vegas.init(); 
});