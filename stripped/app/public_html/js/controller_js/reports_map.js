var map = (function($) {
    return {
        url: window.location.origin+"/reports/",
        //properties: null,
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            
            $(window).resize(function() {
                map.windowResizeHandler();
            });
            map.windowResizeHandler();
            map.drawMap();
            

            
        },
        drawMap: function() {
            
            var criteria;
            
            var properties =    $.ajax({
                                    type: 'post',
                                    dataType: 'json',
                                    url: '/reports/ajaxGetProperties',
                                    data: {criteria:criteria},
                                    success: function(response){
                                        return response;
                    //                    map.properties = response;
                                    }
                                });
            
            console.log(properties);
            
        },
        windowResizeHandler: function(){
            $('#mapCanvas').height(window.innerHeight - $('#header').height());
        }
    };
}($));
$(window).load(function() {map.init();});