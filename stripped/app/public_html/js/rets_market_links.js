var links = (function($) {
    return {
        init: function() {
            
            $( "#accordion" ).accordion({
                collapsible: true,
                active: false
            });
        
        }
    };
}($));
$(window).load(function() {links.init();});