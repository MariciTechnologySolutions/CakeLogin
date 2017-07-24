var title = (function($) {
    return {
        url: window.location.origin+"/title",
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            $('.title_fav').on('click',function(){
                $(this).toggleClass('fa-star-o fa-star');
                var id       = $(this).attr('data-rel-id')
                var favorite = $(this).hasClass('fa-star');
                $.ajax({
                    type: 'post',
                    url: '/title/fav',
                    data: {id:id,favorite:favorite},
                    success: function(response){
                        console.log(response);
                    }
                });
            });
            $('#addNewTitleCompany').on('click',function(){
                var market = $('#market').val();
                $('#modal_title').text('Add New Title Company in ' + market );
                $('#add_title_company').modal('show');
            });
            $('.titleEdit').on('click',function(){
                $('#modal_title').text('Edit Title Company');
                var id = $(this).attr('id');
                $.ajax({
                    type: 'post',
                    url: '/title/ajaxGetTitleCompany',
                    data: {id:id},
                    success: function(response){
                        var data = JSON.parse(response);
                        
                        //data.Title.company
                        $('#id').val(data.Title.id);
                        $('#company').val(data.Title.company);
                        $('#name').val(data.Title.name);
                        $('#phone').val(data.Title.phone);
                        $('#email').val(data.Title.email);
                        $('#fax').val(data.Title.fax);
                        $('#address').val(data.Title.address);
                        $('#city').val(data.Title.city);
                        $('#state').val(data.Title.state);
                        $('#zip').val(data.Title.zip);
                        
                        
                        
                        $('#add_title_company').modal('show');
                    }
                });
                
            });
        }
    };
}($));
$(window).load(function() {title.init();});