var website = (function($){
    return {
        cntUrl: window.location.origin+"/company",
        init: function(callback) {
            website.__proto__ = Pankaj;
            website.initialize();  
            
        },
        test: function(e) {
            var anchor = $(e.currentTarget);
            var self = this;
            if( anchor.find("span.unread").length > 0 ) {
                var url = self.makeAsRead+"/"+anchor.attr("data-e-id");
                self.httpAPI(url, "GET", {}, "json", function(data) {
                    if( data.status == "success" ) {
                        anchor.find("span.unread").removeClass("unread");
                    } else {
                        alert(data.message);
                    }
                });
            }
        }
    };
}($));
$(window).load(function() {
   website.init(); 
});