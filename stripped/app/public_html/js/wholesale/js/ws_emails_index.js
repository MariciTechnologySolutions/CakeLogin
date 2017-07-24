var ws_emails_index = (function($){
    return {
        init: function(){
            $('.datatable').DataTable();
        }
    };
}($));
$(window).load(function(){
    ws_emails_index.init();
});

