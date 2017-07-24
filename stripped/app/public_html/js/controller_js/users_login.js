var login = (function($) {
    return {
        loginUrl: window.location.origin+"/users/login",
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            this.eventHandlers();
        },
        eventHandlers: function() {
            
        }
    };
}($));
$(window).load(function() {login.init();});