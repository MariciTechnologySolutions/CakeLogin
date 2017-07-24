$(function(){  
    var mobileWidth = 768;
    
   $('[data-toggle="tooltip"]').tooltip();   
   
    function mapLayout(){
        if($('#content').hasClass('max')){
            //make content full width hide map
            $('#mapView').addClass('hidden');
            $('#split-bar').addClass('hidden');        
        }else{
        }
    }
    setTimeout(function(){mapLayout()},500);
    
    function mobile(){
        if(windowWidth() < mobileWidth)
            return true;    
        else
            return false;
    }
    
    function windowWidth(){
        return $(window).width();
    }
    
    function windowHeight(){
        return window.innerHeight;
    }
    
    function mapWidth(){
        return $('#mapView').width();
    }
    
    function getMapCookie(){
        if($.cookie('mapWidth')){
            return $.cookie('mapWidth');
        }else{
            return windowWidth()/2;
        }
    }
    
    function setMapCookie(){
        $.cookie('mapWidth',mapWidth());
    }
    
    function setContentWidth(){
        var leftSide = $('#leftSide').width();
        var bar      = $('#split-bar').width();
        var adjust = '10px';
        var content = windowWidth() - mapWidth() - leftSide - bar;
        $('#content').width(content);
        
    }
    
    function getContentHeight(){
        var headerHeight = $('#header').height() + 1;
        return windowHeight() - headerHeight;
    }
    
    function setContentHeight(){
        var contentHeight = getContentHeight();
        $('#wrapper').height(contentHeight);
        $('#leftSide').height(contentHeight);
        $('#mapView').height(contentHeight);
        $('#content').height(contentHeight);
        $('#split-bar').height(contentHeight);
        $('.closeLeftSide').height(contentHeight);
    }
    
    function setPanel(panel){
        if(panel === 'content'){
            $('#mapView').css('width','0%');
            $('#content').css('width','100%');
        }else{
            $('#mapView').css('width','100%');
            $('#content').css('width','0%');
        }
        $.cookie('panel',panel);
    }
    
    function togglePanel(){
        var cur = getPanel();
        if(cur !== 'content'){
            setPanel('content');
        }else{
            setPanel('mapView');
        }
    }
    
    function getPanel(){
        return $.cookie('panel');
    }
    
    function pageLoad(){
        if(mobile()){
            $('#split-bar').hide();
            if (typeof getPanel() !== 'undefined'){
                setPanel(getPanel());
            }else{
                setPanel('content');
            }
            setContentHeight();
            
        }else{
            $('#mapView').width(getMapCookie());
            setContentWidth();
            setContentHeight();
        }
    }
    
    //3 resize events. pageLoad/ Window.resize/ divider bar move
    pageLoad();
    
    $(window).resize(function() {
        if(windowWidth() < mobileWidth){
             $('#split-bar').hide();
            
            if (typeof getPanel() !== 'undefined'){
                setPanel(getPanel());
            }else{
                setPanel('content');//set to default if not defined.
            }
             
        }else{
            $('#mapView').removeClass();
            $('#content').removeClass();
            
            $('#split-bar').show();
            $('#mapView').width(windowWidth()/2);
            setContentWidth();
            setContentHeight();
            setMapCookie();
        }
        if(map){
            google.maps.event.trigger(map, 'resize');
        }
    });
    
    $('#split-bar').mousedown(function (e) {
        var min = 0;
        var max = 3600;
        var mainmin = 3;
        e.preventDefault();
        $(document).mousemove(function (e) {
            e.preventDefault();
            var x = e.pageX - $('#mapView').offset().left;
            if (x > min && x < max && e.pageX < ($(window).width() - mainmin)) {  
              $('#mapView').css("width", x);
            }
            setContentWidth();
            setMapCookie();
            
        });
    });
    
    $(document).mouseup(function (e) {
        $(document).unbind('mousemove');
    });
    
    if(!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)) {
        $('body').addClass('no-touch');
        isDevice = false;
    }
    
    // Exapnd left side navigation
    var navExpanded = false;
    $('.navHandler, .closeLeftSide').click(function() {
        if(!navExpanded) {
            $('.logo').addClass('expanded');
            $('#leftSide').addClass('expanded');
            if(windowWidth < 768) {
                $('.closeLeftSide').show();
            }
            $('.hasSub').addClass('hasSubActive');
            $('.leftNav').addClass('bigNav');
            if(windowWidth > 767) {
                $('.full').addClass('m-full');
            }
            
            navExpanded = true;
        } else {
            $('.logo').removeClass('expanded');
            $('#leftSide').removeClass('expanded');
            $('.closeLeftSide').hide();
            $('.hasSub').removeClass('hasSubActive');
            $('.bigNav').slimScroll({ destroy: true });
            $('.leftNav').removeClass('bigNav');
            $('.leftNav').css('overflow', 'visible');
            $('.full').removeClass('m-full');
            navExpanded = false;
        }
    });
    
    $('.mapHandler').click(function() {
        if ($('#mapView').hasClass('mob-min') || 
            $('#mapView').hasClass('mob-max') || 
            $('#content').hasClass('mob-min') || 
            $('#content').hasClass('mob-max')) {
                $('#mapView').toggleClass('mob-max');
                $('#content').toggleClass('mob-min');
                togglePanel();
        } else {
            $('#mapView').toggleClass('min');
            $('#content').toggleClass('max');
            togglePanel();
        }
    });
});