(function($){
    
    
    
    $('#userInviteSubmit').bind('click',function(e){
       var name = $('#userInviteName').val();
       var email = $('#userInviteEmail').val();
       
       $.ajax({
           type: 'post',
           url: '/users/jqxhrInvite',
           data: {name:name,email:email},
           success: function(response){
               //console.log(response);
               $('#userInviteThanks').modal('show')
               $('#invitationResponse').text(response);
           }
       });
       e.preventDefault();
   });
    
    
})(jQuery);