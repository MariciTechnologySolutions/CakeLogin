(function($) {
    "use strict";

    
    $('#sortable').sortable({
        update: function(evt, ui) {  
            //console.log($(this).sortable('toArray').toString());
            $.ajax({
                dataType: "text",
                type: 'POST',
                url: '/files/sort_documents',
                data: {sort: $(this).sortable('toArray').toString()},
                success: function(response,status){
                    //console.log(response);
                    if(response == 'success'){
                        $('#output').html('Re-Sorted');
                    }else{
                        $('#output').html('There was a problem with that request. Call Steve');
                    }
                    //window.location.reload(); 
                }
            });

        }
    }); 

    
    $('.trash_image').bind('click',function(e){
        var id = this.id;
        var property_id = $('#property_id').html();
        console.log(id);
        console.log(property_id);
        
        $.ajax({
            dateType: "text",
            type: "POST",
            data: {id:id,property_id:property_id},
            url: "/properties/image_delete",
            success: function(response,status){
                if(status == 'success'){
                     if(response == 'delete_all'){
                        $('li').addClass('hidden');
                        $('#output').html('All Images Deleted');
                    }else{
                        $('#' + response).addClass('hidden');
                        $('#output').html('Image Deleted');
                    }
                    
                    
                }else{
                    $('#output').html('There was a problem with that request. Call Steve');
                }
                
                
                
            }
        });
    
        e.preventDefault();
    });
    
    
    $('#doc').bind('blur',function(){
        
        var name = $(this).val().trim();
        if(name.length == 0)return;
        $.ajax({
            type: 'post',
            url: '/files/api_add',
            data: {name:name},
            success: function(response){
                $('#output').html(response);
                setTimeout(function(){
                    window.location.reload(); 
                },500);
            }
        });
    });
    
    
    

})(jQuery);