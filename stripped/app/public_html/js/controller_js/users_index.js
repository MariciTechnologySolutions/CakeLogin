(function($){
   
   
   
   
    //if /users/login page... show login modal
    var url = window.location.href;
    var pc = url.split('com');
    var page = pc[1];
    if(page === '/users/login'){
        $('#user_login').modal('show');
    }
   
    
    
    $( "#submit_login" ).on( "click", function( event ) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        
        $.ajax({
            type: 'post',
            url: '/users/login',
            data: {username:username,password:password},
            success: function(response){
                console.log(response);
                if(response == 'success'){
                    window.location = '/users/index';
                }else{
                    window.location.reload();
                }
            }
        });
        
        
    });
   
 
        $('#datatable').DataTable({
            "order": [[ 0, "desc" ]],
            "pageLength": 25
        });
        
        setTimeout(function(){
            
//            $('.dataTables_length').addClass('input-group input-group-sm col-xs-12 col-sm-12 col-md-6 col-lg-6');
//            $('#datatable_filter').addClass('input-group input-group-sm col-xs-12 col-sm-12 col-md-6 col-lg-6 pull-right');
//            $('#datatable_filter input').addClass('form-control');
        },100);
        
        
   
})(jQuery);


