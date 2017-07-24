var c2c = (function($) {
    return {
        init: function() {
          
        },
        copy: function(element){
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val($(element).text()).select();
            document.execCommand("copy");
            $temp.remove();
            
        }
    };
}($));
$(window).load(function(){
    //c2c.init();
});

  
