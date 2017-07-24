var register = (function($) {
    return {
        url: window.location.origin+"/",
        init: function() {
            $('.query').on('click',function(){
                $('#regions').val($(this).text());
            });
            
            $('.rightPanel').height($('.leftPanel').height());
        }
    };
}($));
$(window).load(function() {register.init();});





