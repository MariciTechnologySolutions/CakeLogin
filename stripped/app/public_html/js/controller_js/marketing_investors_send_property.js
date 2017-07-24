var email = (function($) {
    return {
        init: function() {
            
            
            $('#marketing_comment_updated').hide();
            
            $('#marketing_comment_submit').on('click',function(e){

                var id   = $('#id').val();
                
                var marketing_comment = tinyMCE.get('marketing_comment').getContent();
                
                var submission = $('#investorEmail').serialize();
                
                var postToData = submission + "&marketing_comment=" + encodeURIComponent(marketing_comment);
                
                
                
                
                $.ajax({
                    type: 'post',
                    url: '/properties/apiMarketingComment',
                    data: postToData,
                    success: function(response){
                        //console.log(response);
                        $("#marketing_comment_updated").show().delay(2000).fadeOut('slow');
                    }
                });

                e.preventDefault();
            });
            
            tinyMCE.init({
                selector: "#marketing_comment",
                theme: "modern",
                menubar: "tools",
                plugins: [
                    "preview fullscreen paste textcolor link"
                ],
                fontsize_formats: "9pt 12pt 16pt 20pt",
                toolbar: "undo redo | bold italic underline | forecolor backcolor fontsizeselect | link | preview | templates ",
                forced_root_block : "",
                browser_spellcheck : true
            });
            
            
//            $('.eblast').click(function(e){
//                var data = $(this).attr('data-rel');
//                //console.log(data);
//                $.ajax({
//                    type: 'post',
//                    url: '/marketing/eblast',
//                    data: {data:data},
//                    success: function(response){
////                        console.log(response);
//                        window.location.reload();
//                    }
//                });
//                //e.preventDefault();
//            });
            $('.send_all').click(function(e){

                
                
                var data = $('#investorEmail').serialize();
                
                
                $.ajax({
                    type: 'post',
                    url: '/marketing/investors/ajax_eblast_job_create',
                    data: data,//id-market 
                    success: function(response){
                        console.log(response);
                        
                        window.location = response;
                    }
                });

                e.preventDefault();
            });
                        
        }
    };
}($));
$(window).load(function() {email.init();});