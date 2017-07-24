var doc = (function($) {
    return {
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            this.eventHandlers();
        },
        eventHandlers: function() {
            
            $('#pointer_div').height(window.innerHeight - 2);
            
            
        },
        point_it: function(event){
            pos_x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("pointer_div").offsetLeft;
            pos_y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("pointer_div").offsetTop;
            
            var img_width  = event.target.clientWidth;
            var img_height = event.target.clientHeight;
            console.log(img_width);
            console.log(img_height);
            
            var x = (pos_x / img_width) * 8.5;
            var y = (pos_y / img_height) * 11;
            x = x.toFixed(4);
            y = y.toFixed(4);
            
            document.pointform.form_test.value = "$pdf->Text('" + x + "','" + y + "',$info['var']);";
        
        }
        
    };
}($));
$(window).load(function() {doc.init();});