var tag = (function($) {
    return {
        loginUrl: window.location.origin+"/users/login",
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            this.eventHandlers();
            $('#tag').on('blur',function(){
                var tag = $(this).val();
                $.ajax({
                    type: 'post',
                    url: '/tags/apiAddTag',
                    data: {tag:tag},
                    success: function(response){
                        //console.log(response);
                        window.location.reload();
                    }
                });
            });
            
            $('#sortable').sortable({
                update: function(evt, ui) {  
                    //console.log($(this).sortable('toArray').toString());
                    $.ajax({
                        dataType: "text",
                        type: 'POST',
                        url: '/tags/apiSortTags',
                        data: {sort: $(this).sortable('toArray').toString()},
                        success: function(response,status){
                            //console.log(response);
//                            if(response == 'success'){
//                                $('#output').html('Re-Sorted');
//                            }else{
//                                $('#output').html('There was a problem with that request. Call Steve');
//                            }
                            window.location.reload(); 
                        }
                    });

                }
            });
            
        },
        eventHandlers: function() {
            
        }
    };
}($));
$(window).load(function() {tag.init();});