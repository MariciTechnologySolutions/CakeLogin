var ws_contacts_index = (function($){
    return {
//         table: $('.datatable').DataTable(),
        init: function(){
            $('.datatable').DataTable({
                "order": [[ 6, "asc" ]],
                "pageLength": 25
            });
            $('.marketSelectAdd').on('click',function(){
                var market = $(this).text();
                $('#market').val(market);
                
            });
        }
    };
}($));
$(window).load(function(){
    ws_contacts_index.init();
});

