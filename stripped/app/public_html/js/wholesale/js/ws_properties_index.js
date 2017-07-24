var ws_properties = (function($){
    return {
        table: $('#datatable').DataTable({
            "columnDefs":[{
                    "targets":[3],
                    "visible":false,
                    "searchable":true,
            }]
        }),
        init: function(){
            $('.handleFilter').on('click',function(e){
                $('.filterForm').toggleClass('hidden');
                e.preventDefault();
            });

            
        },
        status: function(btn){
            
            $(btn).toggleClass('btn-default btn-info');
            var sel = $(btn).attr('data-rel-id');
            $.ajax({
                type: 'post',
                url: '/wholesale/ws_properties/index',
                data: {sel:sel},
                success: function(response){
                    console.log(response);
                    window.location.reload();
                }
            });
            
        }
    };
}($));
$(window).load(function(){
    ws_properties.init();
});