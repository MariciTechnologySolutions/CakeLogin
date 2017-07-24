
//var map, bounds, markers, mydatatable;
//var sourceUrl = window.location.origin +"/Properties/api_property";
//var dtsettings      = null; 
//var searchWait = 0;
//var searchWaitInterval;
//var sortpurchasea = [];
//var sortsalea = [];
//var mappointsdata = [];

$(document).ready(function () {
    
    $('#dttbl').DataTable({
            "order": [[ 0, "desc" ]],
            "pageLength": 10
    });
    
//    $('.delete_property').click(function(){
//       var row = $(this).attr('rel');
//       
//       $('#'+row).addClass('hidden');
//       
//       $.ajax({
//           url: '/properties/apiDeleteRow',
//           type: 'post',
//           data: {id:row},
//           success: function(response){
//               //console.log(response);
//           }
//       });
//       
//       
//       
//    });
    
//    mydatatable = $('#mydatatable').dataTable({
//            destroy        : true,
//            processing     : true,
//            serverSide     : true,
//            order          : [[0, "desc"]],
//            pageLength     : 5,
//            ajax           : sourceUrl,
//            columns        : [
//                {
//                    data:'address',
//                                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
//                                        $(nTd).html(oData.address+"<input type='hidden' id='"+oData.id+"'>");
//                                    }
//                },
//                {
//                    data:'purchase'
//                },
//                {
//                    data:'sale'
//                }
//            ],
//            fnRowCallback   : function( nRow, aData, iDisplayIndex ) {
//                $(nRow).attr("id",aData.id);
//                return nRow;
//              },
//            drawCallback   : function(setting) {
//                initialize();
//            }
//    });
//
//    function getProps() {
//        var props = [];
//        datatable.rows({search: 'applied'}).data().each(function (value, index) {
//            //console.log(value);
//            props.push(value);
//        });
//        return props;
//    }
//    function initialize(checkthis) {
//
//        var mapOptions = {zoom: 9};
//        map = new google.maps.Map(document.getElementById('mapView'), mapOptions);
//        bounds = new google.maps.LatLngBounds();
//        google.maps.event.addListenerOnce(map, "idle", function () {
//            if (map.getZoom() > 17) {
//                map.setZoom(17);
//            }
//        });
//
//        //var props = getProps();
//
//        $.each(dtsettings.aoData, function (i, prop) {
//            var id = prop._aData.id;
//            var address = prop._aData.address.split(',');
//            var lat = prop._aData.lat;
//            var lng = prop._aData.lng;
//            //console.log(prop[5]);
//            var latlng = new google.maps.LatLng(lat, lng);
//
//            var marker = new google.maps.Marker({
//                position: latlng,
//                map: map,
//                icon: new google.maps.MarkerImage(
//                        '/images/marker-blue.png',
//                        null,
//                        null,
//                        null,
//                        new google.maps.Size(30, 30)
//                        ),
//                draggable: false,
//                animation: google.maps.Animation.DROP,
//            });
//            bounds.extend(new google.maps.LatLng(lat, lng));
//            map.fitBounds(bounds);
//
//            var infoboxContent = '<div class="infoW">' +
//                    '<div class="propImg">' +
//                    '<div style="background-color: #0d9095;height: 40px"></div>' +
//                    '<div class="propBg">' +
//                    '<div class="propPrice">' + 'tbd' + '</div>' +
//                    '<div class="propType" style="color: #505050">tbd</div>' +
//                    '</div>' +
//                    '</div>' +
//                    '<div class="paWrapper">' +
//                    '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + address[0] + '</div>' +
//                    '<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + address[1] + '</div>' +
//                    '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: bold">' + ' ' + '</div>' +
//                    '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.purchase + '</div>' +
//                    '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.sale + '</div>' +
//                    '</div>' +
//                    '<div class="clearfix"></div>' +
//                    '<div class="infoButtons">' +
//                    '<a class="btn btn-sm btn-round btn-gray btn-o closeInfo">Close</a>' +
//                    '<a href="/properties/view/' + id + '" target="_blank" class="btn btn-sm btn-round btn-green viewInfo">View</a>' +
//                    '</div>' +
//                    '</div>';
//
//
//            google.maps.event.addListener(marker, 'click', (function (marker, i) {
//                return function () {
//                    //                       var action_status = $('.action_status').text();
//                    //                       var action_status = $.trim(action_status);
//
//                    //                       if(action_status === 'Zoom'){
//                    infobox.setContent(infoboxContent);
//                    infobox.open(map, marker);
//                    map.setZoom(19);
//                    map.setCenter(latlng);
//                    map.setMapTypeId(google.maps.MapTypeId.HYBRID);
//                    //                       }
//
//                    //                       if(action_status === 'Like'){
//                    //                           if(marker.getIcon() === red_icon  || marker.getIcon().url === red_icon){
//                    //                               marker.setIcon(blue_icon);
//                    //                               //update the DOM icon
//                    //                               $('#persqft_' + prop.zillow.id).removeClass('psqft');
//                    //
//                    //                           }else{
//                    //                               marker.setIcon(red_icon);
//                    //                               //update the DOM icon
//                    //                               $('#persqft_' + prop.zillow.id).addClass('psqft');
//                    //
//                    //                           }
//                    //
//                    //                           $('#like_' + prop.zillow.id).toggleClass('fa-heart fa-heart-o');
//                    //
//                    //                           setTimeout(function(){addemup()},200);
//                    //                           var like = $('#like_' + prop.zillow.id).hasClass('fa-heart');
//                    //                           dbUpdateLike(prop.zillow.id,like);
//                    //
//                    //
//                    //                           //call db function
//                    //                       }
//
//                    //                       if(action_status === 'Remove'){
//                    //                           marker.setVisible(false);
//                    //                           //update the DOM icon
//                    //                           $('#' + prop.zillow.id).addClass('hidden');
//                    //                           //call db function
//                    //                           hideMarker(prop.zillow.id);
//                    //                       }
//
//                };
//            })(marker, i));
//
//
//                           google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
//                               return function() {
//                                   $('#'+id).addClass('highlight')
//                               };
//                           })(marker, i));
//                           google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
//                               return function() {
//                                   $('#'+ id).removeClass('highlight')
//                               };
//                           })(marker, i));
//
//            //close infobox
//            //            $(document).on('click', '.closeInfo', function() {
//            //                infobox.open(null,null);
//            //                map.fitBounds(bounds);
//            //                map.setMapTypeId('Styled', styledMapType);
//            //             });
//
//            google.maps.event.addListener(map, "click", function (event) {
//                infobox.open(null, null);
//                map.fitBounds(bounds);
//                map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
//            });
//
//            //listed for events on the DOM 
//                           google.maps.event.addDomListener(document.getElementById(id), 'mouseover', function() {
//                                   setTimeout(function(){
//                                       marker.setAnimation(google.maps.Animation.BOUNCE);
//                                   },500);
//                                   setTimeout(function(){
//                                       marker.setAnimation(null);
//                                   },1250);
//            
//                           });
//
//            //hide marker
//            //               google.maps.event.addDomListener(document.getElementById('hide_'+prop.zillow.id), 'click', function() {
//            //                   marker.setVisible(false);
//            //               });
//
//            //toggle red icon
//            //               google.maps.event.addDomListener(document.getElementById('like_'+prop.zillow.id), 'click', function() {
//            //
//            //                   if(marker.getIcon() === red_icon  || marker.getIcon().url === red_icon){
//            //                       marker.setIcon(blue_icon);
//            //                   }else{
//            //                       marker.setIcon(red_icon);
//            //                   }
//            //               });
//
//            //Zoom view 
//            //               google.maps.event.addDomListener(document.getElementById('view_'+prop.zillow.id), 'click', function() {
//            //
//            //                       infobox.setContent(infoboxContent);
//            //                       infobox.open(map, marker);
//            //                       map.setZoom(19);
//            //                       map.setCenter(latlng);
//            //                       map.setMapTypeId(google.maps.MapTypeId.HYBRID);
//            //               });
//            //               google.maps.event.addDomListener(document.getElementById('mapIcon'), 'click', function() {
//            //                   setTimeout(function(){
//            //
//            //                       map.fitBounds(bounds); 
//            //                      google.maps.event.trigger(map, 'resize');
//            //                   },500);
//            //               });
//
//            //               markers.push(marker);            
//
//        });
//    }
//    var infobox = new InfoBox({
//        disableAutoPan: false,
//        maxWidth: 202,
//        pixelOffset: new google.maps.Size(-101, -275),
//        zIndex: null,
//        boxStyle: {
//            background: "url('/images/infobox-bg.png') no-repeat",
//            opacity: 1,
//            width: "202px",
//            height: "202px"
//        },
//        closeBoxMargin: "28px 26px 0px 0px",
//        closeBoxURL: "",
//        infoBoxClearance: new google.maps.Size(1, 1),
//        pane: "floatPane",
//        enableEventPropagation: false
//    });
//    $('input').bind('keyup', function () {
//        //initialize();
//    });
//    google.maps.event.addDomListener(window, 'load', initialize);
//
//
//
//
//    //filter related
//    // functionality for custom dropdown select list
//    $('.dropdown-select li a').click(function () {
//        if (!($(this).parent().hasClass('disabled'))) {
//            $(this).prev().prop("checked", true);
//            $(this).parent().siblings().removeClass('active');
//            $(this).parent().addClass('active');
//            $(this).parent().parent().siblings('.dropdown-toggle').children('.dropdown-label').html($(this).text());
//        }
//    });
//
//    $('.priceSlider').slider({
//        range: true,
//        min: 0,
//        max: 2000000,
//        values: [0, 2000000],
//        step: 10000,
//        slide: function (event, ui) {
//            $('.priceSlider .sliderTooltip .stLabel').html(
//                    '$' + ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") +
//                    ' <span class="fa fa-arrows-h"></span> ' +
//                    '$' + ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
//                    );
//            var priceSliderRangeLeft = parseInt($('.priceSlider .ui-slider-range').css('left'));
//            var priceSliderRangeWidth = $('.priceSlider .ui-slider-range').width();
//            var priceSliderLeft = priceSliderRangeLeft + (priceSliderRangeWidth / 2) - ($('.priceSlider .sliderTooltip').width() / 2);
//            $('.priceSlider .sliderTooltip').css('left', priceSliderLeft);
//        },
//        change: function(event, ui) {
//            var min = ui.values[0];
//            var max = ui.values[1];
//            
//            dtsettings.foptions.pricesearch = 1;
//            dtsettings.foptions.pricemin = min;
//            dtsettings.foptions.pricemax = max;
//            
//            makedtchanges();
//        }
//    });
//    $('.priceSlider .sliderTooltip .stLabel').html(
//            '$' + $('.priceSlider').slider('values', 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") +
//            ' <span class="fa fa-arrows-h"></span> ' +
//            '$' + $('.priceSlider').slider('values', 1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
//            );
//    var priceSliderRangeLeft = parseInt($('.priceSlider .ui-slider-range').css('left'));
//    var priceSliderRangeWidth = $('.priceSlider .ui-slider-range').width();
//    var priceSliderLeft = priceSliderRangeLeft + (priceSliderRangeWidth / 2) - ($('.priceSlider .sliderTooltip').width() / 2);
//    $('.priceSlider .sliderTooltip').css('left', priceSliderLeft);
//
//    $('.areaSlider').slider({
//        range: true,
//        min: 0,
//        max: 20000,
//        values: [0, 20000],
//        step: 10,
//        slide: function (event, ui) {
//            $('.areaSlider .sliderTooltip .stLabel').html(
//                    ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' Sq Ft' +
//                    ' <span class="fa fa-arrows-h"></span> ' +
//                    ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' Sq Ft'
//                    );
//            var areaSliderRangeLeft = parseInt($('.areaSlider .ui-slider-range').css('left'));
//            var areaSliderRangeWidth = $('.areaSlider .ui-slider-range').width();
//            var areaSliderLeft = areaSliderRangeLeft + (areaSliderRangeWidth / 2) - ($('.areaSlider .sliderTooltip').width() / 2);
//            $('.areaSlider .sliderTooltip').css('left', areaSliderLeft);
//        },
//        change: function(event, ui) {
//            var min = ui.values[0];
//            var max = ui.values[1];
//            dtsettings.foptions.areasearch = 1;
//            dtsettings.foptions.areamin = min;
//            dtsettings.foptions.areamax = max;
//            
//            makedtchanges();
//        }
//    });
//    $('.areaSlider .sliderTooltip .stLabel').html(
//            $('.areaSlider').slider('values', 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' Sq Ft' +
//            ' <span class="fa fa-arrows-h"></span> ' +
//            $('.areaSlider').slider('values', 1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' Sq Ft'
//            );
//    var areaSliderRangeLeft = parseInt($('.areaSlider .ui-slider-range').css('left'));
//    var areaSliderRangeWidth = $('.areaSlider .ui-slider-range').width();
//    var areaSliderLeft = areaSliderRangeLeft + (areaSliderRangeWidth / 2) - ($('.areaSlider .sliderTooltip').width() / 2);
//    $('.areaSlider .sliderTooltip').css('left', areaSliderLeft);
//
//    $('.volume .btn-round-right').click(function () {
//        var currentVal = parseInt($(this).siblings('input').val());
//        if (currentVal < 10) {
//            $(this).siblings('input').val(currentVal + 1);
//        }
//    });
//    $('.volume .btn-round-left').click(function () {
//        var currentVal = parseInt($(this).siblings('input').val());
//        if (currentVal > 1) {
//            $(this).siblings('input').val(currentVal - 1);
//        }
//    });
//
//    $('.handleFilter').click(function () {
//        $('.filterForm').slideToggle(200);
//    });
//
//    //Enable swiping
//    $(".carousel-inner").swipe({
//        swipeLeft: function (event, direction, distance, duration, fingerCount) {
//            $(this).parent().carousel('next');
//        },
//        swipeRight: function () {
//            $(this).parent().carousel('prev');
//        }
//    });
//
//    $(".carousel-inner .card").click(function () {
//        window.open($(this).attr('data-linkto'), '_self');
//    });
//
//    $('#content').scroll(function () {
//        if ($('.comments').length > 0) {
//            var visible = $('.comments').visible(true);
//            if (visible) {
//                $('.commentsFormWrapper').addClass('active');
//            } else {
//                $('.commentsFormWrapper').removeClass('active');
//            }
//        }
//    });
//
//    $('.btn').click(function () {
//        if ($(this).is('[data-toggle-class]')) {
//            $(this).toggleClass('active ' + $(this).attr('data-toggle-class'));
//        }
//    });
//
//    $('.tabsWidget .tab-scroll').slimScroll({
//        height: '235px',
//        size: '5px',
//        position: 'right',
//        color: '#939393',
//        alwaysVisible: false,
//        distance: '5px',
//        railVisible: false,
//        railColor: '#222',
//        railOpacity: 0.3,
//        wheelStep: 10,
//        allowPageScroll: true,
//        disableFadeOut: false
//    });
//
//    $('.progress-bar[data-toggle="tooltip"]').tooltip();
//    $('.tooltipsContainer .btn').tooltip();
//
//    $("#slider1").slider({
//        range: "min",
//        value: 50,
//        min: 1,
//        max: 100,
//        //slide: repositionTooltip,
//        //stop: repositionTooltip
//    });
//    $("#slider1 .ui-slider-handle:first").tooltip({title: $("#slider1").slider("value"), trigger: "manual"}).tooltip("show");
//
//    $("#slider2").slider({
//        range: "max",
//        value: 70,
//        min: 1,
//        max: 100,
//        //slide: repositionTooltip,
//        //stop: repositionTooltip
//    });
//    $("#slider2 .ui-slider-handle:first").tooltip({title: $("#slider2").slider("value"), trigger: "manual"}).tooltip("show");
//
//    $("#slider3").slider({
//        range: true,
//        min: 0,
//        max: 500,
//        values: [190, 350],
//        //slide: repositionTooltip,
//        //stop: repositionTooltip
//    });
//    $("#slider3 .ui-slider-handle:first").tooltip({title: $("#slider3").slider("values", 0), trigger: "manual"}).tooltip("show");
//    $("#slider3 .ui-slider-handle:last").tooltip({title: $("#slider3").slider("values", 1), trigger: "manual"}).tooltip("show");
//
//    $('#autocomplete').autocomplete({
//        source: ["ActionScript", "AppleScript", "Asp", "BASIC", "C", "C++", "Clojure", "COBOL", "ColdFusion", "Erlang", "Fortran", "Groovy", "Haskell", "Java", "JavaScript", "Lisp", "Perl", "PHP", "Python", "Ruby", "Scala", "Scheme"],
//        focus: function (event, ui) {
//            var label = ui.item.label;
//            var value = ui.item.value;
//            var me = $(this);
//            setTimeout(function () {
//                me.val(value);
//            }, 1);
//        }
//    });
//
//    $('#tags').tagsInput({
//        'height': 'auto',
//        'width': '100%',
//        'defaultText': 'Add a tag',
//    });
//
//    $('#datepicker').datepicker();
//
//    $('input, textarea').placeholder();
//    
//    dtsettings = mydatatable.fnSettings();
//    dtsettings.searchDelay = 300;
//    dtsettings.foptions = {
//        areasearch      : 0,
//        areamin         : 0,
//        areamax         : 0,
//        pricesearch     : 0,
//        pricemin        : 0,
//        pricemax        : 0,
//        type            : 0,
//        sortpurchase    : '',
//        sortsale        : '',
//        no_of_beds      : 1,
//        no_of_baths     : 1
//    };
});

//
//function changevolume(obj) {
//    var rel = $(obj).closest("div").attr("data-rel");
//    var value = $(obj).closest("div").find("input.form-control").val();
//    console.log(rel);
//    console.log(value);
//    if( rel == "bed" ) {
//        dtsettings.foptions.no_of_beds = value;
//    } else if( rel == "bath" ) {
//        dtsettings.foptions.no_of_baths = value;
//    }
//    
//    makedtchanges();
//}
//
////function which handle statusfilter
//function statusfilter(object) {
//    
//    var type = $(object).attr('data-rel-type');
//    var id   = $(object).attr('data-rel-id');
//    //check for active class
//    if ($(object).hasClass('active')) {
//        //remove active class
//        $(object).removeClass('active');
//        //remove element from array
///*
// var y = [1, 2, 2, 3, 2]
//var removeItem = 2;
//
//y = jQuery.grep(y, function(value) {
//  return value != removeItem;
//});
// */
//        if( type == "purchase" ) {
//            sortpurchasea = jQuery.grep(sortpurchasea, function(value) {
//              return value != id;
//            });
//        } else if( type == "sale" ) {
//            sortsalea = jQuery.grep(sortsalea, function(value) {
//              return value != id;
//            });
//        }
//        
//    } else {
//        //add active class
//        $(object).addClass('active');
//        //add in array
//        if( type == "purchase" ) {
//            sortpurchasea.push(id);
//        } else if( type == "sale" ) {
//            sortsalea.push(id);  
//        }
//    }
//    
//    makedtchanges();
//}
//
////function to refresh data table on basis of selected options
//function makedtchanges() {
//    dtsettings.foptions.sortpurchase =  sortpurchasea.join(","); 
//    dtsettings.foptions.sortsale     =  sortsalea.join(",");
//    
//    var queryString = $.param(dtsettings.foptions);
//    
//    console.log(queryString);
//    dtsettings.ajax = sourceUrl + "?"+queryString;
//    console.log(sourceUrl + "?"+queryString);
//    mydatatable._fnAjaxUpdate();
//}