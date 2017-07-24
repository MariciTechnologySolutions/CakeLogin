var phoenix = (function($) {
    return {
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            this.eventHandlers();
            this.activateSplitter($("#split-bar"), $("#leftWrapperDiv"), $("#content"));
        },
        eventHandlers: function() {
            
        }
    };
}($));
$(window).load(function() {phoenix.init();});