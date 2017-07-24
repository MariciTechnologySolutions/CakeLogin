var buyers = (function($) {
    return {
        url: window.location.origin+"/buyers",
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            $('.buyer_fav').on('click',function(){
                $(this).toggleClass('fa-star-o fa-star');
                var id       = $(this).attr('data-rel-id')
                var favorite = $(this).hasClass('fa-star');
                $.ajax({
                    type: 'post',
                    url: '/buyers/fav',
                    data: {id:id,favorite:favorite},
                    success: function(response){
                        console.log(response);
                    }
                });
            });
            $('#addNewBuyer').on('click',function(){
                var market = $('#market').val();
                $('#modal_buyer').text('Add New Buyer in ' + market );
                $('#add_buyer').modal('show');
            });
            $('.buyerEdit').on('click',function(){
                $('#modal_buyer').text('Edit Buyer');
                var id = $(this).attr('id');
                $.ajax({
                    type: 'post',
                    url: '/buyers/ajaxGetBuyer',
                    data: {id:id},
                    success: function(response){
                        var data = JSON.parse(response);
                        
                        //data.Title.company
                        $('#id').val(data.Buyer.id);
                        $('#company').val(data.Buyer.company);
                        $('#name').val(data.Buyer.name);
                        $('#title').val(data.Buyer.title);
                        $('#initials').val(data.Buyer.initials);
                        $('#phone').val(data.Buyer.phone);
                        $('#email').val(data.Buyer.email);
                        
                        $('#add_buyer').modal('show');
                    }
                });
                
            });
        }
    };
}($));
$(window).load(function() {buyers.init();});