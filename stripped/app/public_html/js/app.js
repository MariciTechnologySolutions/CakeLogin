(function($) {
    "use strict";
    
    
    
    var currentUrl = window.location.pathname;
    currentUrl = currentUrl.replace(/^\/+|\/+$/g, '');
    
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/wiki/ajaxGetCurrentRequest',
        data: {currentUrl:currentUrl},
        success: function(response){
            //console.log(response);
            $('#wikiId').val(response.id);
            $('.wikiContent').html(response.content);
            
            var lastEdit = '<br><br><span style="font-weight: bold">Last Edit:</span> ' + response.created;
            $('#wikiDisplayDiv').append(lastEdit);
        }
    });
    
    $(document).on('click','#wikiSubmitButton',function(){
        var content = tinyMCE.get('wikiContent').getContent();
        var postToData = encodeURIComponent(content);
        var id = $('#wikiId').val();
        $.ajax({
            type: 'post',
            url: '/wiki/apiSubmitContent',
            data: {id:id,content:content},
            success: function(response){
                console.log(response);
                
                $('#wikiDisplayDiv').removeClass('hidden');
                $('#wikiEditButton').removeClass('hidden');

                $('#wikiEditDiv').addClass('hidden');
                $('#wikiSubmitButton').addClass('hidden');
                
                $('.wikiContent').html(content);
                var lastEdit = '<br><br><span style="font-weight: bold">Last Edit:</span> Just Now';
                $('#wikiDisplayDiv').append(lastEdit);
            }
        });
    });
    
    $(document).on('click','#wikiEditButton',function(){
        $('#wikiDisplayDiv').addClass('hidden');
        $('#wikiEditButton').addClass('hidden');
        
        $('#wikiEditDiv').removeClass('hidden');
        $('#wikiSubmitButton').removeClass('hidden');
        
        tinyMCE.init({
            selector: "#wikiContent",
            theme: "modern",
            menubar: "tools",
            plugins: [
                "preview fullscreen paste textcolor link lists"
            ],
            fontsize_formats: "9pt 12pt 16pt 20pt",
            toolbar: "undo redo | bold italic underline | forecolor backcolor fontsizeselect | link | preview | templates | numlist bullist | outdent indent",
            forced_root_block : "",
            browser_spellcheck : true
        });
    });
    
    
    
     
    $('#addressSearchInput').on('keyup',function(){
       
        var search = $('#addressSearchInput').val();
        
        $.ajax({
            type: 'post',
            url: '/app/apiAddressSearch',
            data: {search:search},
            success: function(response){
                
                $('#searchResponse').html(response);
//                console.log(response);
            }
        });
        
    });

    $('#quicksearch').on('keydown',function(e){
        if(e.which == 13) {
            e.preventDefault();
            window.location.href = '/search/index?quicksearch=' + encodeURI(jQuery('#quicksearch').val());
        }
    });
     
     var mls_data_id = $('#property_id').val();
     
    $('.csh_workflow_text').on('blur',function(){
        var value = $(this).val();
        var property_id = $('#property_id').val();
        var field = $(this).attr('id');
        $.ajax({
            type: 'post',
            url: '/properties/apiCshWorkflowText',
            data: {id:property_id,value:value,field:field},
            success: function(response){

//                switch(field){
//                    case 'phase_0_submitted':
//                        'send email to TC';
//                        break;
//                    case 'phase_1_inspection':
//                        'notify inspector';
//                        break;
//                    case 'contract_date':
//                        'add days to calc inspExp';
//                        break;
//                    case '':
//                        '';
//                        break;
//                }




                window.location.reload();
                console.log(response);
//                    Pankaj.logit(mls_data_id,'Contract Date',contract_date);
            }
        });
        
    });
     
    $(".csh_workflow_date").datepicker({
            format: "yyyy-mm-dd",
            todayBtn: true,
            orientation: "top auto",
            //daysOfWeekDisabled: "0,6",
            autoclose: true,
            todayHighlight: true,
            clearBtn: true
        }).on('changeDate',function(e){

            
            var value = $(this).val();
            var property_id = $('#property_id').val();
            var field = $(this).attr('id');
            
            $.ajax({
                type: 'post',
                url: '/properties/apiCshWorkflowDates',
                data: {id:property_id,value:value,field:field},
                success: function(response){
                    //console.log(response);
                    $.ajax({
                        type: 'post',
                        url: '/properties/apiCshWorkflowTriggers',
                        data: {id:property_id,field:field,value:value},
                        success: function(response){
                            console.log(response);
                            
//                            if(response.length > 0)
//                            alert(response);
                        }
                    });
                    
                    setTimeout(function() {
//                        window.location.reload();
                    }, 500);
                    
//                    console.log(response);
                    //Pankaj.logit(property_id,field,value);
                }
            });
        });
        
    $('#followup').datepicker({
        format: "yyyy-mm-dd",
        todayBtn: true,
        orientation: "top auto",
        //daysOfWeekDisabled: "0,6",
        autoclose: true,
        todayHighlight: true,
        clearBtn: true
    }).on('changeDate',function(e){
        var date = $(this).val();
        var property_id = $('#property_id').val();
        $.ajax({
            type: 'post',
            url: '/properties/apiFollowup',
            data: {date:date,property_id:property_id},
            success: function(response){
                window.location.reload();
            }
        });   
    });
    
    
    $(".closeout").datepicker({
            format: "yyyy-mm-dd",
            todayBtn: true,
            orientation: "top auto",
            //daysOfWeekDisabled: "0,6",
            autoclose: true,
            todayHighlight: true,
            clearBtn: true
        }).on('changeDate',function(e){

            
            var date = $(this).val();
            var property_id = $('#property_id').val();
            
            $.ajax({
                type: 'post',
                url: '/properties/apiCloseout',
                data: {id:property_id,date:date},
                success: function(response){
                    //console.log(response);
                    alert('Close notification... Who?');
                    Pankaj.logit(property_id,'Closed',date);
                    window.location.reload();
                }
            });
        });
        
    $('#csh_repairs').on('blur',function(){
         window.location.reload();
    });
     
     $('#submitListingId').bind('click',function(){
         var data = $('#listingId').val();
         $('#addListingModal').modal('hide');
         $.ajax({
             type: 'post',
             url: '/mls/addListingIdToQueue',
             data: {data:data},
             success: function(response){
                 //console.log(response);
                 $('#addListingResponseModal').modal('show');
                 $('#addListingResponseText').html(response);
             }
         });
     });
     
    $("#purchase_date").datepicker({
        format: "yyyy-mm-dd",
        todayBtn: true,
        orientation: "top auto",
        //daysOfWeekDisabled: "0,6",
        autoclose: true,
        todayHighlight: true,
        clearBtn: true
    }).on('changeDate',function(e){
        var purchase_date = $("#purchase_date").val();
        var property_id = $('#property_id').val();
        $.ajax({
            url: '/properties/jqxhr_update_purchase_date',
            data: {id:property_id,purchase_date:purchase_date},
            success: function(response){
                console.log(response);
                Pankaj.logit(mls_data_id,'Set Purchase Date',purchase_date);
            }
        });
    });
    
    $("#due_diligence_expires").datepicker({
        format: "yyyy-mm-dd",
        todayBtn: true,
        orientation: "top auto",
        //daysOfWeekDisabled: "0,6",
        autoclose: true,
        todayHighlight: true,
        clearBtn: true
    }).on('changeDate',function(e){
        var due_diligence_expires = $("#due_diligence_expires").val();
        var property_id = $('#property_id').val();
        $.ajax({
            url: '/properties/jqxhr_update_due_diligence_expires',
            data: {id:property_id,due_diligence_expires:due_diligence_expires},
            success: function(response){
                console.log(response);
                Pankaj.logit(mls_data_id,'Due Diligence Expires',due_diligence_expires);
            }
        });
    });
    
    $("#contract_date").datepicker({
        format: "yyyy-mm-dd",
        todayBtn: true,
        orientation: "top auto",
        //daysOfWeekDisabled: "0,6",
        autoclose: true,
        todayHighlight: true,
        clearBtn: true
    }).on('changeDate',function(e){
        var contract_date = $("#contract_date").val();
        var property_id = $('#property_id').val();
        $.ajax({
            url: '/properties/jqxhr_update_contract_date',
            data: {id:property_id,contract_date:contract_date},
            success: function(response){
                console.log(response);
                Pankaj.logit(mls_data_id,'Contract Date',contract_date);
            }
        });
    });
    
    $("#sale_date").datepicker({
        format: "yyyy-mm-dd",
        todayBtn: true,
        orientation: "top auto",
        daysOfWeekDisabled: "0,6",
        autoclose: true,
        todayHighlight: true,
        clearBtn: true
    }).on('changeDate',function(e){
        var sale_date = $("#sale_date").val();
        var property_id = $('#property_id').val();
        $.ajax({
            url: '/properties/jqxhr_update_sale_date',
            data: {id:property_id,sale_date:sale_date},
            success: function(response){
                //console.log(response);
                Pankaj.logit(mls_data_id,'Set Sale Date',sale_date);
            }
        });
    });

    
    $('#sale_amt').on('change',function(){
        var sale_amt = $( this ).val();
        var id    = $('#property_id').val();
        $.ajax({
            type: 'post',
            url: '/properties/api_sale_amt',
            data: {id:id,sale_amt:sale_amt},
            success: function(response){
                $('#sale_amt').val(response);
                Pankaj.logit(mls_data_id,'Sale Amount',response);
            }
        });
        
    });
    
     
    // Custom options for map
    var options = {
            zoom : 14,
            mapTypeId : 'Styled',
            disableDefaultUI: true,
            mapTypeControlOptions : {
                mapTypeIds : [ 'Styled' ]
            }
        };
    var styles = [{
        stylers : [ {
            hue : "#cccccc"
        }, {
            saturation : -100
        }]
    }, {
        featureType : "road",
        elementType : "geometry",
        stylers : [ {
            lightness : 100
        }, {
            visibility : "simplified"
        }]
    }, {
        featureType : "road",
        elementType : "labels",
        stylers : [ {
            visibility : "on"
        }]
    }, {
        featureType: "poi",
        stylers: [ {
            visibility: "off"
        }]
    }];

    var newMarker = null;
    var markers = [];

   

    // custom infowindow object
    /*var infobox = new InfoBox({
        disableAutoPan: false,
        maxWidth: 202,
        pixelOffset: new google.maps.Size(-101, -285),
        zIndex: null,
        boxStyle: {
            background: "url('images/infobox-bg.png') no-repeat",
            opacity: 1,
            width: "202px",
            height: "245px"
        },
        closeBoxMargin: "28px 26px 0px 0px",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1),
        pane: "floatPane",
        enableEventPropagation: false
    });
*/
    // function that adds the markers on map
//    var addMarkers = function(props, map) {
//        $.each(props, function(i,prop) {
//            var latlng = new google.maps.LatLng(prop.position.lat,prop.position.lng);
//            var marker = new google.maps.Marker({
//                position: latlng,
//                map: map,
//                icon: new google.maps.MarkerImage( 
//                    'images/' + prop.markerIcon,
//                    null,
//                    null,
//                    null,
//                    new google.maps.Size(36, 36)
//                ),
//                draggable: false,
//                animation: google.maps.Animation.DROP,
//            });
//            var infoboxContent = '<div class="infoW">' +
//                                    '<div class="propImg">' +
//                                        '<img src="images/prop/' + prop.image + '">' +
//                                        '<div class="propBg">' +
//                                            '<div class="propPrice">' + prop.price + '</div>' +
//                                            '<div class="propType">' + prop.type + '</div>' +
//                                        '</div>' +
//                                    '</div>' +
//                                    '<div class="paWrapper">' +
//                                        '<div class="propTitle">' + prop.title + '</div>' +
//                                        '<div class="propAddress">' + prop.address + '</div>' +
//                                    '</div>' +
//                                    '<div class="propRating">' +
//                                        '<span class="fa fa-star"></span>' +
//                                        '<span class="fa fa-star"></span>' +
//                                        '<span class="fa fa-star"></span>' +
//                                        '<span class="fa fa-star"></span>' +
//                                        '<span class="fa fa-star-o"></span>' +
//                                    '</div>' +
//                                    '<ul class="propFeat">' +
//                                        '<li><span class="fa fa-moon-o"></span> ' + prop.bedrooms + '</li>' +
//                                        '<li><span class="icon-drop"></span> ' + prop.bathrooms + '</li>' +
//                                        '<li><span class="icon-frame"></span> ' + prop.area + '</li>' +
//                                    '</ul>' +
//                                    '<div class="clearfix"></div>' +
//                                    '<div class="infoButtons">' +
//                                        '<a class="btn btn-sm btn-round btn-gray btn-o closeInfo">Close</a>' +
//                                        '<a href="single.html" class="btn btn-sm btn-round btn-green viewInfo">View</a>' +
//                                    '</div>' +
//                                 '</div>';
//
//            google.maps.event.addListener(marker, 'click', (function(marker, i) {
//                return function() {
//                    infobox.setContent(infoboxContent);
//                    infobox.open(map, marker);
//                }
//            })(marker, i));
//
//            $(document).on('click', '.closeInfo', function() {
//                infobox.open(null,null);
//            });
//
//            markers.push(marker);
//        });
//    }

    var map;
    var windowHeight;
    var windowWidth;
    var contentHeight;
    var contentWidth;
    var isDevice = true;
    
    // calculations for elements that changes size on window resize
    var windowResizeHandler = function() {
        
        windowHeight = window.innerHeight;
        //windowHeight = $('#body').height();
        windowWidth = $(window).width();
        
        contentWidth = $('#content').width();
        var headerHeight = $('#header').height();
        contentHeight = windowHeight - headerHeight;
        contentHeight = contentHeight - 1;
        $('#leftSide').height(contentHeight);
        $('.closeLeftSide').height(contentHeight);
        $('#wrapper').height(contentHeight);
        $('#mapView').height(contentHeight);
        $('#content').height(contentHeight);
        
        
        
//        var out='';
//        out += 'Body: ' + $('#body').height() + '<br>';
//        out += 'Window Height: ' + windowHeight + '<br>';
//        out += 'Header Height: ' + $('#header').height() + '<br>';
//        out += 'contentHeight: ' + contentHeight + '<br>';
//        out += 'Window Height: ' + windowHeight + '<br>';
//        out += 'Window Height: ' + windowHeight + '<br>';
//        
//        $('.output').html(out);
        
        setTimeout(function() {
            $('.commentsFormWrapper').width(contentWidth);
        }, 300);

        if (map) {
            google.maps.event.trigger(map, 'resize');
        }

        // Add custom scrollbar for left side navigation
//        if(windowWidth > 767) {
//            $('.bigNav').slimScroll({
//                height : contentHeight - $('.leftUserWraper').height()
//            });
//        } else {
//            $('.bigNav').slimScroll({
//                height : contentHeight
//            });
//        }
//        if($('.bigNav').parent('.slimScrollDiv').size() > 0) {
//            $('.bigNav').parent().replaceWith($('.bigNav'));
//            if(windowWidth > 767) {
//                $('.bigNav').slimScroll({
//                    height : contentHeight - $('.leftUserWraper').height()
//                });
//            } else {
//                $('.bigNav').slimScroll({
//                    height : contentHeight
//                });
//            }
//        }

        // reposition of prices and area reange sliders tooltip
        var priceSliderRangeLeft = parseInt($('.priceSlider .ui-slider-range').css('left'));
        var priceSliderRangeWidth = $('.priceSlider .ui-slider-range').width();
        var priceSliderLeft = priceSliderRangeLeft + ( priceSliderRangeWidth / 2 ) - ( $('.priceSlider .sliderTooltip').width() / 2 );
        $('.priceSlider .sliderTooltip').css('left', priceSliderLeft);

        var areaSliderRangeLeft = parseInt($('.areaSlider .ui-slider-range').css('left'));
        var areaSliderRangeWidth = $('.areaSlider .ui-slider-range').width();
        var areaSliderLeft = areaSliderRangeLeft + ( areaSliderRangeWidth / 2 ) - ( $('.areaSlider .sliderTooltip').width() / 2 );
        $('.areaSlider .sliderTooltip').css('left', areaSliderLeft);
        
        
    }

    var repositionTooltip = function( e, ui ){
        var div = $(ui.handle).data("bs.tooltip").$tip[0];
        var pos = $.extend({}, $(ui.handle).offset(), { 
                        width: $(ui.handle).get(0).offsetWidth,
                        height: $(ui.handle).get(0).offsetHeight
                    });
        var actualWidth = div.offsetWidth;

        var tp = {left: pos.left + pos.width / 2 - actualWidth / 2}
        $(div).offset(tp);

        $(div).find(".tooltip-inner").text( ui.value );
    }

    
    $(window).resize(function() {
        windowResizeHandler();
    });

    setTimeout(function() {
        $('body').removeClass('notransition');
    }, 300);

    if(!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)) {
        $('body').addClass('no-touch');
        isDevice = false;
    }

    // Header search icon transition
    $('.search input').focus(function() {
        $('.searchIcon').addClass('active');
    });
    $('.search input').blur(function() {
        $('.searchIcon').removeClass('active');
    });

    // Notifications list items pulsate animation
    $('.notifyList a').hover(
        function() {
            $(this).children('.pulse').addClass('pulsate');
        },
        function() {
            $(this).children('.pulse').removeClass('pulsate');
        }
    );

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
            windowResizeHandler();
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

    // functionality for map manipulation icon on mobile devices
    $('.mapHandler').click(function() {
        
//        if ($('#mapView').hasClass('mob-min') || 
//            $('#mapView').hasClass('mob-max') || 
//            $('#content').hasClass('mob-min') || 
//            $('#content').hasClass('mob-max')) {
//                $('#mapView').toggleClass('mob-max');
//                $('#content').toggleClass('mob-min');
//        } else {
//            $('#mapView').toggleClass('min');
//            $('#content').toggleClass('max');
//        }

        setTimeout(function() {
            var priceSliderRangeLeft = parseInt($('.priceSlider .ui-slider-range').css('left'));
            var priceSliderRangeWidth = $('.priceSlider .ui-slider-range').width();
            var priceSliderLeft = priceSliderRangeLeft + ( priceSliderRangeWidth / 2 ) - ( $('.priceSlider .sliderTooltip').width() / 2 );
            $('.priceSlider .sliderTooltip').css('left', priceSliderLeft);

            var areaSliderRangeLeft = parseInt($('.areaSlider .ui-slider-range').css('left'));
            var areaSliderRangeWidth = $('.areaSlider .ui-slider-range').width();
            var areaSliderLeft = areaSliderRangeLeft + ( areaSliderRangeWidth / 2 ) - ( $('.areaSlider .sliderTooltip').width() / 2 );
            $('.areaSlider .sliderTooltip').css('left', areaSliderLeft);

            if (map) {
                google.maps.event.trigger(map, 'resize');
            }

            $('.commentsFormWrapper').width($('#content').width());
        }, 300);

    });

    // Expand left side sub navigation menus
    $(document).on("click", '.hasSubActive', function() {
        $(this).toggleClass('active');
        $(this).children('ul').toggleClass('bigList');
        $(this).children('a').children('.arrowRight').toggleClass('fa-angle-down');
    });

    if(isDevice) {
        $('.hasSub').click(function() {
            $('.leftNav ul li').not(this).removeClass('onTap');
            $(this).toggleClass('onTap');
        });
    }

    // functionality for custom dropdown select list
    $('.dropdown-select li a').click(function() {
        if (!($(this).parent().hasClass('disabled'))) {
            $(this).prev().prop("checked", true);
            $(this).parent().siblings().removeClass('active');
            $(this).parent().addClass('active');
            $(this).parent().parent().siblings('.dropdown-toggle').children('.dropdown-label').html($(this).text());
        }
    });

    $('.priceSlider').slider({
        range: true,
        min: 0,
        max: 2000000,
        values: [500000, 1500000],
        step: 10000,
        slide: function(event, ui) {
            $('.priceSlider .sliderTooltip .stLabel').html(
                '$' + ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + 
                ' <span class="fa fa-arrows-h"></span> ' +
                '$' + ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
            );
            var priceSliderRangeLeft = parseInt($('.priceSlider .ui-slider-range').css('left'));
            var priceSliderRangeWidth = $('.priceSlider .ui-slider-range').width();
            var priceSliderLeft = priceSliderRangeLeft + ( priceSliderRangeWidth / 2 ) - ( $('.priceSlider .sliderTooltip').width() / 2 );
            $('.priceSlider .sliderTooltip').css('left', priceSliderLeft);
        }
    });
    $('.priceSlider .sliderTooltip .stLabel').html(
        '$' + $('.priceSlider').slider('values', 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + 
        ' <span class="fa fa-arrows-h"></span> ' +
        '$' + $('.priceSlider').slider('values', 1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    );
    var priceSliderRangeLeft = parseInt($('.priceSlider .ui-slider-range').css('left'));
    var priceSliderRangeWidth = $('.priceSlider .ui-slider-range').width();
    var priceSliderLeft = priceSliderRangeLeft + ( priceSliderRangeWidth / 2 ) - ( $('.priceSlider .sliderTooltip').width() / 2 );
    $('.priceSlider .sliderTooltip').css('left', priceSliderLeft);

    $('.areaSlider').slider({
        range: true,
        min: 0,
        max: 20000,
        values: [5000, 10000],
        step: 10,
        slide: function(event, ui) {
            $('.areaSlider .sliderTooltip .stLabel').html(
                ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' Sq Ft' +
                ' <span class="fa fa-arrows-h"></span> ' +
                ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' Sq Ft'
            );
            var areaSliderRangeLeft = parseInt($('.areaSlider .ui-slider-range').css('left'));
            var areaSliderRangeWidth = $('.areaSlider .ui-slider-range').width();
            var areaSliderLeft = areaSliderRangeLeft + ( areaSliderRangeWidth / 2 ) - ( $('.areaSlider .sliderTooltip').width() / 2 );
            $('.areaSlider .sliderTooltip').css('left', areaSliderLeft);
        }
    });
    $('.areaSlider .sliderTooltip .stLabel').html(
        $('.areaSlider').slider('values', 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' Sq Ft' +
        ' <span class="fa fa-arrows-h"></span> ' +
        $('.areaSlider').slider('values', 1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' Sq Ft'
    );
    var areaSliderRangeLeft = parseInt($('.areaSlider .ui-slider-range').css('left'));
    var areaSliderRangeWidth = $('.areaSlider .ui-slider-range').width();
    var areaSliderLeft = areaSliderRangeLeft + ( areaSliderRangeWidth / 2 ) - ( $('.areaSlider .sliderTooltip').width() / 2 );
    $('.areaSlider .sliderTooltip').css('left', areaSliderLeft);

    $('.volume .btn-round-right').click(function() {
        var currentVal = parseInt($(this).siblings('input').val());
        if (currentVal < 10) {
            $(this).siblings('input').val(currentVal + 1);
        }
    });
    $('.volume .btn-round-left').click(function() {
        var currentVal = parseInt($(this).siblings('input').val());
        if (currentVal > 1) {
            $(this).siblings('input').val(currentVal - 1);
        }
    });

    $('.handleFilter').click(function() {
        //$('.filterForm').slideToggle(200);
    });

    //Enable swiping
    $(".carousel-inner").swipe( {
        swipeLeft:function(event, direction, distance, duration, fingerCount) {
            $(this).parent().carousel('next'); 
        },
        swipeRight: function() {
            $(this).parent().carousel('prev');
        }
    });

    $(".carousel-inner .card").click(function() {
        window.open($(this).attr('data-linkto'), '_self');
    });

//    $('#content').scroll(function() {
//        if ($('.comments').length > 0) {
//            var visible = $('.comments').visible(true);
//            if (visible) {
//                $('.commentsFormWrapper').addClass('active');
//            } else {
//                $('.commentsFormWrapper').removeClass('active');
//            }
//        }
//    });

    $('.btn').click(function() {
        if ($(this).is('[data-toggle-class]')) {
            $(this).toggleClass('active ' + $(this).attr('data-toggle-class'));
        }
    });

    $('.tabsWidget .tab-scroll').slimScroll({
        //height: '235px',
        size: '5px',
        position: 'right',
        color: '#939393',
        alwaysVisible: false,
        distance: '5px',
        railVisible: false,
        railColor: '#222',
        railOpacity: 0.3,
        wheelStep: 10,
        allowPageScroll: true,
        disableFadeOut: false
    });

    $('.progress-bar[data-toggle="tooltip"]').tooltip();
    $('.tooltipsContainer .btn').tooltip();

    $("#slider1").slider({
        range: "min",
        value: 50,
        min: 1,
        max: 100,
        slide: repositionTooltip,
        stop: repositionTooltip
    });
    $("#slider1 .ui-slider-handle:first").tooltip({ title: $("#slider1").slider("value"), trigger: "manual"}).tooltip("show");

    $("#slider2").slider({
        range: "max",
        value: 70,
        min: 1,
        max: 100,
        slide: repositionTooltip,
        stop: repositionTooltip
    });
    $("#slider2 .ui-slider-handle:first").tooltip({ title: $("#slider2").slider("value"), trigger: "manual"}).tooltip("show");

    $("#slider3").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 190, 350 ],
        slide: repositionTooltip,
        stop: repositionTooltip
    });
    $("#slider3 .ui-slider-handle:first").tooltip({ title: $("#slider3").slider("values", 0), trigger: "manual"}).tooltip("show");
    $("#slider3 .ui-slider-handle:last").tooltip({ title: $("#slider3").slider("values", 1), trigger: "manual"}).tooltip("show");
 

    $('#datepicker').datepicker();


    $('input, textarea').placeholder();
    windowResizeHandler();

    //Joey's Code
    $.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);