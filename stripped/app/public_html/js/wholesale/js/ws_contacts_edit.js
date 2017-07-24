var ws_contacts_edit = (function($){
    return {
        init: function(){
            $('.marketSelect').on('click',function(){
                var market = $(this).text();
                var id = $('#id').val();
                $('#market').text(market);
                $.ajax({
                    type: 'post',
                    url: '/wholesale/ws_contacts/apiUpdateMarket',
                    data: {id:id,market:market},
                    success: function(response){
                        console.log(response);
                    }
                });
            });
        }
    };
}($));
$(window).load(function(){
    ws_contacts_edit.init();
});

