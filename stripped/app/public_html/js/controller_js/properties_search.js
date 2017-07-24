var properties = (function($){
    return {
        cntUrl: window.location.origin+"/properties",
        addresstypeUrl: window.location.origin+"/properties/api_address",
        zipcodetypeUrl: window.location.origin+"/properties/api_zipcode",
        lisintidtypeUrl: window.location.origin+"/properties/api_listingid",
        subdivisiontypeUrl: window.location.origin+"/properties/api_subdivision",
        sourceUrl: window.location.origin+"/properties/api_search",
        deatilsUrl: window.location.origin+"/properties/view/",
        dstAction: "api_getSourceDistinct",
        mlsstatus: [],
        sortpurchasea: [],
        sortsalea:[],
        mydatatable: null,
        dtsettings: null,
        mapOptions: {zoom: 9},
        map: null,
        bounds: null,
        mlsDp: "#datasource_id",
        countychangeStatus: false,
        pageLoadStatus  : true,
        homeIconImage: "house.png",
        dtCustomVars    : {
            col: {
                datasource:null,//datasources
                county_code: null,//country code
                city: null,//city
                zipcode: null,//zipcode
                address: null,//address virtual field
                mstatus: null,//purchase status
                //ucb: null,//purchase status
                pstatus: null,//purchase status
                sstatus:null,//sale status
                dwelling_type: null,//dwelling_tyoe
                listing_id: null,//listing_id
                apn:null,//apn
                subdivision: null,//subdivision
                juniorhigh_school: null,//middle school
                high_school: null,//hight school
                elementary_school: null,//elementory school
                motivation_score: null,//deal score
                discount: null,//list_price - sold_price
                list_price: null, //asking price
                sold_price: null, //sell price
                appx_sqft: null, //sq filt
                appx_lot_sqft: null, //lot sq fit
                year_built: null,//year built   
                bathrooms: null,//bathrooms
                bedrooms: null,//bedrooms
                offer_date: null,//bedrooms
                mlssource_table: null,
            }
        },
        init: function(callback) {
            properties.__proto__ = Pankaj;
            properties.initialize();           
            this.bindAll();
            //hideshow filter form
            $('.handleFilter').click(function () {
                $('.filterForm').slideToggle(200);
            });
            //attach dropdown search option
            $('.selectpicker').selectpicker({
                liveSearch: true
            });
            //attach all slider
            //properties.slider('#sq_fit_range', 0, 20000, [0, 20000], 100, "SqFt", "appx_sqft", properties.onChangeInrangeSliders);
            //properties.slider('#deal_score', 0, 50, [0, 50], 1, "Score", "motivation_score", properties.onChangeInrangeSliders);
            //properties.slider('#discount', 0, 100, [0, 100], 2, "Discount", "discount", properties.onChangeInrangeSliders);
            //properties.slider('#asking_price_range', 0, 2000000, [0, 2000000], 1000, "Price", "list_price", properties.onChangeInrangeSliders);
            //properties.slider('#sale_price_range', 0, 2000000, [0, 2000000], 1000, "Price", "sold_price", properties.onChangeInrangeSliders);
            //properties.slider('#lot_sqfit_range', 0, 20000, [0, 20000], 100, "SqFt", "appx_lot_sqft", properties.onChangeInrangeSliders);
            //properties.slider('#year_build', 1900, 2015, [1900, 2015], 1, "Year", "year_built", properties.onChangeInrangeSliders);
            properties.loadDistinctValues('status', '#mslpropstatus');
            
            properties.dropdownLoader();
            //on change source==>relaod with selected one
            $(properties.mlsDp).change(properties.dropdownLoader);
            //on change country==>reload city and zip
            $("#mslcountry").change(properties.dropdownLoaderCountry); 
            //on change city==>reload zip
            $('[data-id=mlscity]').attrchange({
                    trackValues: true, /* Default to false, if set to true the event object is 
                                            updated with old and new value.*/
                    callback: properties.loadDropdownCity
            });
            //on single select change
            $("#msldwelingtype").change(properties.dwelingtypeChange);
            //$("#mslsubdivision").change(properties.mslsubdivisionChange);
            $("#msleleschool").change(properties.msleleschoolChange);
            $("#mlmiddleschool").change(properties.mlmiddleschoolChange);
            $("#mlshightschool").change(properties.mlshightschoolChange);                
            //on address field out
            $("#addresstype").blur(function() {
                //debug($(this).val());
                if( $.trim($(this).val()) == "") {
                    properties.dtCustomVars.col.address = null;
                    properties.refreshDt();
                }
            });
            //typeahead for address
            properties.typeaheadaddress();
            //typehead for zipcode
            //
            this.autoComplete("mlszipcode", function(req, res) {
                properties.typeaheadzipcode(req.term, function(result) {
                    res(result); 
                });
            });
            $("#mlszipcode").blur(function() {
                var value = $(this).val();
                if( $.trim(value) !== "" && $.trim(value).length == 5 || $.trim(value).indexOf(',') != -1) {
                    if( $.trim(value).length > 5 ) {
                        var lastIndex = $.trim(value).length - 1;
                        if( value[lastIndex] == "," ) {
                            value = value.split(',').slice(0, -1);
                        } else {
                            value = value.split(',');
                        }
                        value = value.join(",");
                    }

                    properties.dtCustomVars.col.zipcode = "@array"+value;
                    properties.refreshDt();
                } else {
                    properties.dtCustomVars.col.zipcode = null;
                    properties.refreshDt();
                }
            });
            //
            $("#mlslistingid").blur(function() {
                if( $.trim($(this).val()) == "" ) {
                    properties.dtCustomVars.col.listing_id = null;
                    properties.refreshDt();
                }
            });
            //
            //typehead of typeaheadsubdivision
            //
            this.typeaheadsubdivision();
            //
            //
            $("#mslsubdivision").blur(function() {
                if( $.trim($(this).val()) == "" ) {
                    properties.dtCustomVars.col.subdivision = null;
                    properties.refreshDt();
                }
            });
            //
            //typehead for listing
            //
            properties.typeaheadListingId();
            //
            //export 
            $("a#exportCSv").click(this.createCsv.bind(this));
            
            properties.sourceSelector();
            
            callback();
            
        },
        sourceSelector: function(){
            
            var cookie = JSON.parse(properties.readCookie("propertySearch"));
            if(cookie != null){
                var label = cookie.col.datasource;
            }else{
                var label = 'all';
            }
             
            $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > button > span.filter-option.pull-left').text(label);
            
            if(label == 'all'){
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(1)').addClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(2)').removeClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(3)').removeClass('active selected');
            }
            
            if(label == 'MlsPhoenix'){
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(1)').removeClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(2)').addClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(3)').removeClass('active selected');
            }
            
            if(label == 'MlsLasvegas'){
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(1)').removeClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(2)').removeClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(3)').addClass('active selected');
            }
        },
        datatable: function() {
            properties.mydatatable = $('#mydatatable').dataTable({
                destroy         : true,
                propertiesing   : false,
                processing      : true,
                searching       : false,
                serverSide      : true,
                ajax            : {
                    url: properties.sourceUrl,
                    data: function(data) {
                        data.custom = properties.dtCustomVars;
                        //console.log(data);
                        //return data;
                    }
                },
                columns: [
                    {
                        data: 'images',
                        fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                            var imageLink = window.location.origin+"/images/"+properties.homeIconImage;
                            
                            if( $.trim(oData.images) != '[""]' && $.trim(oData.images) != "" ) {
                                //imageLink = JSON.parse(oData.images)[0].replace('.jpg', '-t.jpg');
                                
                                if(oData.mlssource_table == 'MlsPhoenix'){
                                    imageLink = JSON.parse(oData.images)[0];
                                }else if(oData.mlssource_table == 'MlsLasvegas'){
                                    imageLink = 'https://s3-us-west-1.amazonaws.com/glvar/' + oData.listing_id + '/' + JSON.parse(oData.images)[0];
                                }else if(oData.mlssource_table == 'MlsDallas'){
                                    imageLink = JSON.parse(oData.images)[0];
                                }
                            }
                            var url = properties.deatilsUrl+oData.mls_id;
                            var image = "<img style='width:60px;max-height: 60px' src='"+imageLink+"' title='house image' alt='house'/>";
                            var linkA = "<a href='"+url+"' target='_blank'>"+image+"</a>";
                            $(nTd).html(linkA);
                        }       
                    },
                    {
                        data: 'address',
                        fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                            var linkA = "<a href='"+properties.deatilsUrl+oData.mls_id+"' target='_blank'>"+oData.address+"</a>";
                            $(nTd).html(linkA + "<input type='hidden' id='" + oData.mls_id + "'>");
                        }     
                    },
                    {
                        data: 'status',
                        fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                            var status = properties.mStat(oData.status,oData.ucb);
                            $(nTd).html(status); 
                        }
                    }, 
                    {
                        data: 'special_listing_cond',
                        fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                            var slc = properties.spLiCo(oData.special_listing_cond);
                            $(nTd).html(slc); 
                        }
                    }, 
                    {
                        data: 'list_price',
                        fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                            var curList = Math.round(oData.list_price).toLocaleString();
                            $(nTd).html(curList);
                        }
                    }, 
                    {
                        data: 'puchase_status_name',
                        name: "PurchaseStatus.name"
                    },
                    {
                        data: 'purchase_date',
                        name: 'Property.purchase_date'
                    },
                    {
                        data: 'purchase_amt',
                        fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                            var curPurch = Math.round(oData.purchase_amt).toLocaleString();
                            $(nTd).html(curPurch);
                        }
                    },
                    {
                        data: 'sale_status_name',
                        name: "SaleStatus.name"
                    },
                    {
                        data: 'sale_date',
                        name: 'Property.sale_date'
                    },
                    {
                        data: 'sale_amt',
                        fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                            var curSale = Math.round(oData.sale_amt).toLocaleString();
                            $(nTd).html(curSale);
                        }                      
                    },
                    {
                        data: 'motivation_score',
                        name: 'motivation_score',
                        width: '3%'        
                    },
                    {
                        data: 'offer_date',
                        name: 'offer_date',
                        width: '6%'
                    },
                    {
                        data: 'reject_date',
                        name: 'reject_date',
                        width: '6%'
                        
                    }
                    
                ],
                fnRowCallback: function (nRow, aData, iDisplayIndex) {
                    $(nRow).attr("id", aData.mls_id);
                    return nRow;
                },
                drawCallback: function (setting) {
                    //properties.drawMap();
                },
                fnDrawCallback: function() {
                    //properties.drawMap();
                }
            });
            properties.createInfobox();
            properties.dtsettings = properties.mydatatable.fnSettings();
        },
        mStat: function(status,ucb){
            switch(true){
                case /UCB/.test(ucb):
                  return("Ucb");
                  break;
                case /CCBS/.test(ucb):
                  return("Ucb");
                  break;
                default:
                  return status;
                  break;
            }
        },
        spLiCo: function(str){
            switch (true) {
                case /Short/.test(str):
                  return("ShortSale");
                  break;
                case /SS/.test(str):
                  return("ApprShortSale");
                  break;
                case /Lender/.test(str):
                  return("REO");
                  break;
                case /Auction/.test(str):
                  return("Auction");
                  break;
                case /Agent/.test(str):
                  return("OwnerAgent");
                  break;
                case /Probate/.test(str):
                  return("Probate");
                  break;
                case /HUD/.test(str):
                  return("HUD");
                  break;
                default:
                  return("N/A");
                  break;
            }
            
        },
        refreshDt: function(column, value) {
            if( properties.pageLoadStatus ) {
                properties.pageLoadStatus = false;
                if( properties.readCookie("propertySearch") !== null ) {
                    //cookied 
                    var columnData = JSON.parse(properties.readCookie("propertySearch"));
                    properties.dtCustomVars = columnData;
                    properties.manageCookieSelection();
                }
            } else {
                //debug(properties.dtCustomVars);
                var columnData = JSON.stringify(properties.dtCustomVars);
                properties.createCookie("propertySearch", columnData, 7);   
            }
            
            if( column !== null ) {
                properties.dtCustomVars.col[column] = value;
            }
            properties.sourceSelector();
            properties.mydatatable._fnAjaxUpdate();
        },
        manageCookieSelection: function() {
            //set datasource column
            setTimeout(function() {
                //set country selected
                if( properties.dtCustomVars.col.county_code !== null && properties.dtCustomVars.col.county_code != "all") {
                    debug("county code is not null value");
                    $("#mslcountry").val(properties.dtCustomVars.col.county_code).selectpicker('refresh');
                    //on country loaded set city selected
                    properties.dropdownLoaderCountry(true, function() {//
                        debug('all county dropdown has loaded now');
                        if( properties.dtCustomVars.col.city !== null ) {
                            var cvalues = properties.dtCustomVars.col.city.replace("@array", "").split(",");
                            debug(cvalues);
                            setTimeout(function() {
                                $("#mlscity").val(cvalues).selectpicker('refresh');
                                    debug('city selection done now');
                                    //on load of cities set zipcode selected
                                    properties.cookieZipcodeLoad();
                            }, 1000);
                        }
                    });
                }
                //set zipcode if not null
                if( properties.dtCustomVars.col.zipcode !== null ) {
                    $("#mlszipcode").val(properties.dtCustomVars.col.zipcode.replace("@array", "")+",");
                }
                //set listing id if not null
                //
                if( properties.dtCustomVars.col.listing_id !== null ) {
                    $("#mlslistingid").val(properties.dtCustomVars.col.listing_id.replace("@array", ""));
                }
                //ser subdivision
                //
                if( properties.dtCustomVars.col.subdivision !== null ) {
                    $("#mslsubdivision").val(properties.dtCustomVars.col.subdivision);
                }
                //
                //now pstatus, status,  slider, bed, bath values
                //tag
                if( properties.dtCustomVars.col.mstatus !== null ) {
                    var taggs = properties.dtCustomVars.col.mstatus.replace("@mlsstatus", "").split("-");
                    properties.mlsstatus = taggs;
                    $.each(taggs, function(i, t) {
                        $("a[data-rel-type='mlsstatus'][data-rel-id='"+t+"']").addClass('btn-success').removeClass('btn-default');
                        //debug("Set Mls Btn => "+t);
                    });
                }
                
                if( properties.dtCustomVars.col.pstatus !== null ) {
                    var taggs = properties.dtCustomVars.col.pstatus.replace("@pjoin", "").split("-");
                    properties.sortpurchasea = taggs;
                    $.each(taggs, function(i, t) {
                        $("a[data-rel-type='purchase'][data-rel-id='"+t+"']").addClass('btn-info').removeClass('btn-default');
                        debug("activating tag => "+t);
                    });
                }
                if( properties.dtCustomVars.col.sstatus !== null ) {
                    var taggs = properties.dtCustomVars.col.sstatus.replace("@sjoin", "").split("-");
                    properties.sortsalea = taggs;
                    $.each(taggs, function(i, t) {
                        $("a[data-rel-type='sale'][data-rel-id='"+t+"']").addClass('btn-info').removeClass('btn-default');
                        debug("activating tag => "+t);
                    });
                }
                //sliders
                if( properties.dtCustomVars.col.appx_sqft !== null ) {
                    var minMax = properties.dtCustomVars.col.appx_sqft.replace("@range", "").split("-");
                    properties.sq_fit_range.slider("values", minMax);
                }
                if( properties.dtCustomVars.col.motivation_score !== null ) {
                    var minMax = properties.dtCustomVars.col.motivation_score.replace("@range", "").split("-");
                    properties.deal_score.slider("values", minMax);
                }
                if( properties.dtCustomVars.col.discount !== null ) {
                    var minMax = properties.dtCustomVars.col.discount.replace("@range", "").split("-");
                    properties.discount.slider("values", minMax);
                }
                if( properties.dtCustomVars.col.list_price !== null ) {
                    var minMax = properties.dtCustomVars.col.list_price.replace("@range", "").split("-");
                    properties.asking_price_range.slider("values", minMax);
                }
                if( properties.dtCustomVars.col.sold_price !== null ) {
                    var minMax = properties.dtCustomVars.col.sold_price.replace("@range", "").split("-");
                    properties.sale_price_range.slider("values", minMax);
                }
                if( properties.dtCustomVars.col.appx_lot_sqft !== null ) {
                    var minMax = properties.dtCustomVars.col.appx_lot_sqft.replace("@range", "").split("-");
                    properties.lot_sqfit_range.slider("values", minMax);
                }
                if( properties.dtCustomVars.col.year_built !== null ) {
                    var minMax = properties.dtCustomVars.col.year_built.replace("@range", "").split("-");
                    properties.year_build.slider("values", minMax);
                }
                //bed bath
                $("#mlsavailbeds").val(properties.dtCustomVars.col.bedrooms || "all").selectpicker("refresh");
                $("#mlsavailbaths").val(properties.dtCustomVars.col.bathrooms || "all").selectpicker("refresh");
            }, 1000);
        },
        cookieZipcodeLoad: function() {
            debug("in cookie zipcode load function");
            var cities = $("#mlscity").val().join(',');
            var country = $("#mslcountry option:selected").val();
            var queryvals = '?cond-col=city@array-county_code&cond-val='+cities+'-'+country;
            //properties.loadDistinctValues('zipcode'+queryvals, '#mlszipcode', function() {
                setTimeout(function() {
                    if( properties.dtCustomVars.col.zipcode !== null ) {
                        var zvalues = properties.dtCustomVars.col.zipcode.replace("@array", "").split(",");
                        debug(zvalues);
                        debug("<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>");
                        $("#mlszipcode").val(zvalues).selectpicker('refresh');
                    }
                    properties.showGroupCollapse();
                    properties.loadAllotherGroupCollapse(function() {
                        setTimeout(function() {
                            //if address exist then fill input with address
                            $("#addresstype").val(properties.dtCustomVars.col.address || "");

                            //set value for other dropdown
                            $("#msldwelingtype").val(properties.dtCustomVars.col.dwelling_type || 'all').selectpicker('refresh');
                            //$("#mslsubdivision").val(properties.dtCustomVars.col.subdivision || 'all').selectpicker('refresh');
                            $("#msleleschool").val(properties.dtCustomVars.col.elementary_school || 'all').selectpicker('refresh');
                            $("#mlmiddleschool").val(properties.dtCustomVars.col.juniorhigh_school || 'all').selectpicker('refresh');
                            $("#mlshightschool").val(properties.dtCustomVars.col.high_school || 'all').selectpicker('refresh');

                            if( properties.dtCustomVars.col.listing_id !== null ) {
                                var lid = properties.dtCustomVars.col.listing_id.replace("@array", "").split(",");
                                debug(lid);
                                setTimeout(function() {
                                    //$("#mlslistingid").val(lid).selectpicker('refresh');
                                }, 1000);
                            }
                            if( properties.dtCustomVars.col.apn !== null ) {
                                var apnl = properties.dtCustomVars.col.apn.replace("@array", "").split(",");
                                debug(apnl);
                                setTimeout(function() {
                                    $("#mlsapns").val(apnl).selectpicker('refresh');
                                });
                            }

                            debug("all other loaded please check");
                        }, 1000);                        
                    });
                }, 1000);
            //});
        },
        drawMap: function() {
            debug("Drawing map now");
            properties.map = new google.maps.Map(document.getElementById('mapView'), properties.mapOptions);
            properties.bounds = new google.maps.LatLngBounds();
            google.maps.event.addListenerOnce(properties.map, "idle", function () {
                if (properties.map.getZoom() > 10) {
                    properties.map.setZoom(10);
                }
            });
            //fetch lat log from dt table data
            $.each(properties.dtsettings.aoData, function (i, prop) {
                var id = prop._aData.mls_id;
                var address = prop._aData.address.split(',');
                var lat = prop._aData.latitude;
                var lng = prop._aData.longitude;
                //console.log(prop[5]);
                var latlng = new google.maps.LatLng(lat, lng);
                //create marker
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: properties.map,
                    icon: new google.maps.MarkerImage(
                        '/images/marker-blue.png',
                        null,
                        null,
                        null,
                        new google.maps.Size(30, 30)
                    ),
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                });
                properties.bounds.extend(new google.maps.LatLng(lat, lng));
                properties.map.fitBounds(properties.bounds);
                //infobox html
                var infoboxContent = '<div class="infoW">' +
                    '<div class="propImg">' +
                    '<div style="background-color: #0d9095;height: 40px"></div>' +
                    '<div class="propBg">' +
                    '<div class="propPrice">' + 'tbd' + '</div>' +
                    '<div class="propType" style="color: #505050">tbd</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="paWrapper">' +
                    '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + address + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + address[1] + '</div>' +
                    '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: bold">' + ' ' + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.purchase + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.sale + '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="infoButtons">' +
                    '<a class="btn btn-sm btn-round btn-gray btn-o closeInfo">Close</a>' +
                    '<a href="/properties/view/' + id + '" target="_blank" class="btn btn-sm btn-round btn-green viewInfo">View</a>' +
                    '</div>' +
                    '</div>';
                //attach event on map
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        properties.infobox.setContent(infoboxContent);
                        properties.infobox.open(properties.map, marker);
                        properties.map.setZoom(19);
                        properties.map.setCenter(latlng);
                        properties.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    };
                })(marker, i));
                //mouse over event on marker
                google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                    return function() {
                        $('#'+id).addClass('highlight')
                    };
                })(marker, i));
                //mouse out
                google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
                    return function() {
                        $('#'+ id).removeClass('highlight')
                    };
                })(marker, i));
                //on click map add event to zoom it
                google.maps.event.addListener(properties.map, "click", function (event) {
                    properties.infobox.open(null, null);
                    properties.map.fitBounds(properties.bounds);
                    properties.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                });
                //listed for events on the DOM mean on mouser of dt row
                google.maps.event.addDomListener(document.getElementById(id), 'mouseover', function() {
                    setTimeout(function(){
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    },500);
                    setTimeout(function(){
                        marker.setAnimation(null);
                    },1250);
                });
            });
        },
        createInfobox: function() {
            properties.infobox = new InfoBox({
                disableAutoPan: false,
                maxWidth: 202,
                pixelOffset: new google.maps.Size(-101, -275),
                zIndex: null,
                boxStyle: {
                    background: "url('/images/infobox-bg.png') no-repeat",
                    opacity: 1,
                    width: "202px",
                    height: "202px"
                },
                closeBoxMargin: "28px 26px 0px 0px",
                closeBoxURL: "",
                infoBoxClearance: new google.maps.Size(1, 1),
                pane: "floatPane",
                enableEventPropagation: false
            });
        },
        statusfilter: function (object) {
            var type = $(object).attr('data-rel-type');
            var id   = $(object).attr('data-rel-id');
            //check for active class
            if ($(object).hasClass('btn-info')) {
                //remove active class
                $(object).removeClass('btn-info').addClass('btn-default');
                //remove element from array
                if( type == "purchase" ) {
                    properties.sortpurchasea = jQuery.grep(properties.sortpurchasea, function(value) {
                      return value != id;
                    });
                } else if( type == "sale" ) {
                    properties.sortsalea = jQuery.grep(properties.sortsalea, function(value) {
                      return value != id;
                    });
                }
            } else {
                //add active class
                $(object).addClass('btn-info').removeClass('btn-default');
                //add in array
                if( type == "purchase" ) {
                    properties.sortpurchasea.push(id);
                } else if( type == "sale" ) {
                    properties.sortsalea.push(id);  
                }
            }

            properties.dtCustomVars.col.pstatus = "@pjoin"+properties.sortpurchasea.join('-');
            //console.log(properties.dtCustomVars.col.pstatus);
            properties.dtCustomVars.col.sstatus = "@sjoin"+properties.sortsalea.join('-');
            properties.refreshDt(null);
            //debug(properties.dtCustomVars.col.pstatus);
        },
        mlsStatusFilter: function(object){
            
            
            
            var status = $(object).text();
            
            if ($(object).hasClass('btn-success')) {
                $(object).removeClass('btn-success').addClass('btn-default');
                properties.mlsstatus = jQuery.grep(properties.mlsstatus, function(value){
                    return value != status;
                });
                
            }else{
                $(object).addClass('btn-success').removeClass('btn-default');
                properties.mlsstatus.push(status);
            }
            
            properties.dtCustomVars.col.mstatus = "@mlsstatus"+properties.mlsstatus.join('-');
            properties.refreshDt(null);
            
        },        
        addreesHasChanged: function(address) {
            properties.dtCustomVars.col.address = address;
            properties.refreshDt();
        },
        typeaheadzipcode: function(query, callback) {
            var url = properties.zipcodetypeUrl;
            var qs  =  {
                            datasource: $("#datasource_id option:selected").val(),
                            county:$("#mslcountry option:selected").val(),
                            city: properties.dtCustomVars.col.city,
                            query: query
                        };
            properties.httpAPI(url, "GET", qs, "json", function(data) {
                callback(data);
            });
        },
        typeaheadaddress: function() {
            $("input#addresstype").typeahead({
                onSelect: function(item) {
                    properties.addreesHasChanged(item.text);
                },
                ajax: {
                    url: properties.addresstypeUrl,
                    timeout: 500,
                    displayField: "address",
                    valueField: "id",
                    triggerLength: 1,
                    method: "get",
                    loadingClass: "loading-circle",
                    preDispatch: function (query) {
                        debug(query);
                        return {
                            datasource: $("#datasource_id option:selected").val(),
                            county:$("#mslcountry option:selected").val(),
                            city: properties.dtCustomVars.col.city,
                            zipcode: properties.dtCustomVars.col.zipcode,
                            query: query
                        }
                    },
                    preProcess: function (data) {
                        return data;
                    }
                }
            });
        },
        listingHasChanged: function(listingId) {
            properties.dtCustomVars.col.listing_id = "@array"+listingId;
            properties.refreshDt();
        },
        typeaheadListingId: function() {
            $("input#mlslistingid").typeahead({
                onSelect: function(item) {
                    properties.listingHasChanged(item.text);
                },
                ajax: {
                    url: properties.lisintidtypeUrl,
                    timeout: 500,
                    displayField: "listing_id",
                    valueField: "id",
                    triggerLength: 1,
                    method: "get",
                    loadingClass: "loading-circle",
                    preDispatch: function (query) {
                        debug(query);
                        return {
                            datasource: $("#datasource_id option:selected").val(),
                            county:$("#mslcountry option:selected").val(),
                            city: properties.dtCustomVars.col.city,
                            zipcode: properties.dtCustomVars.col.zipcode,
                            query: query
                        }
                    },
                    preProcess: function (data) {
                        return data;
                    }
                }
            });
        },
        subdivisionHasChanged: function(subdivision) {
            properties.dtCustomVars.col.subdivision = subdivision;
            properties.refreshDt();
        },
        typeaheadsubdivision: function() {
            $("input#mslsubdivision").typeahead({
                onSelect: function(item) {
                    properties.subdivisionHasChanged(item.text);
                },
                ajax: {
                    url: properties.subdivisiontypeUrl,
                    timeout: 500,
                    displayField: "subdivision",
                    valueField: "id",
                    triggerLength: 1,
                    method: "get",
                    loadingClass: "loading-circle",
                    preDispatch: function (query) {
                        debug(query);
                        return {
                            datasource: $("#datasource_id option:selected").val(),
                            county:$("#mslcountry option:selected").val(),
                            city: properties.dtCustomVars.col.city,
                            zipcode: properties.dtCustomVars.col.zipcode,
                            query: query
                        }
                    },
                    preProcess: function (data) {
                        return data;
                    }
                }
            });
        },
        onChangeMultiSelect: function(event, dataId, colName) {
            debug($(event.target).attr('aria-expanded'));
            if( $('button[data-id='+dataId+']').attr('aria-expanded') == 'false' ) {
                debug('start loading with '+colName);
                debug($("#"+dataId).val());
                var object = $("#"+dataId);
                if( object.val() !== undefined && object.val() !== null && object.val().length > 0) {
                    //it has some value selected
                    var objectValues = object.val().join(',');
                    //properties.refreshDt(colName, "@array"+objectValues);
                    properties.dtCustomVars.col[colName] =  "@array"+objectValues;
                    properties.refreshDt();
                } else {
                    properties.dtCustomVars.col[colName] =  null;
                    properties.refreshDt();
                }
            }
        },
        dwelingtypeChange: function() {
            properties.dtCustomVars.col.dwelling_type =  $("#msldwelingtype").val();
            properties.refreshDt();                
        },
        msleleschoolChange: function() {
            properties.dtCustomVars.col.elementary_school =  $("#msleleschool").val();
            properties.refreshDt();                
        },
        mlmiddleschoolChange: function() {
            properties.dtCustomVars.col.juniorhigh_school =  $("#mlmiddleschool").val();
            properties.refreshDt();                
        },        
        mlshightschoolChange: function() {
            properties.dtCustomVars.col.high_school =  $("#mlshightschool").val();
            properties.refreshDt();                
        },        
        onChangeInrangeSliders: function(min, max, columnName) {
            debug("@range"+min+"-"+max);
            properties.refreshDt(columnName, "@range"+min+"-"+max);
        },
        loadDropdownCity: function(event) {
            if( $('button[data-id=mlscity]').attr('aria-expanded') == 'false' ) {
                if( $("#mlscity").val() !== undefined && $("#mlscity").val() !== null && $("#mlscity").val().length > 0) {
                    //it has some value selected
                    var cities = $("#mlscity").val().join(',');
                    var country = $("#mslcountry option:selected").val();
                    var queryvals = '?cond-col=city@array-county_code&cond-val='+cities+'-'+country;
                    //properties.loadDistinctValues('zipcode'+queryvals, '#mlszipcode');
                    properties.dtCustomVars.col.city =  "@array"+cities;
                    //properties.dtCustomVars.col.zipcode =  null;
                    properties.dtCustomVars.col.address =  null;
                    //properties.showGroupCollapse('mlszipcode');
                    properties.refreshDt(null);
                    properties.loadAllotherGroupCollapse();
                }
            }
        },
        dropdownLoaderCountry: function(bypass, callback) {
            var country = $("#mslcountry option:selected").val();
            properties.loadDistinctValues('city?cond-col=county_code&cond-val='+country, '#mlscity');
            //properties.loadDistinctValues('zipcode?cond-col=county_code&cond-val='+country, '#mlszipcode');
            properties.showGroupCollapse(null, false);
            properties.showGroupCollapse("mlscity");
            if( bypass !== undefined && bypass == true) {
                debug('call back has returned');
                callback();
            } else {
                properties.dtCustomVars.col.county_code =  country;
                properties.dtCustomVars.col.city =  null;
                //properties.dtCustomVars.col.zipcode =  null;
                properties.dtCustomVars.col.address =  null;
                properties.dtCustomVars.col.dwelling_type = null;//dwelling_tyoe
                //properties.dtCustomVars.col.listing_id = null;//listing_id
                properties.dtCustomVars.col.apn = null;//apn
                //properties.dtCustomVars.col.subdivision = null;//subdivision
                properties.dtCustomVars.col.juniorhigh_school = null;//middle school
                properties.dtCustomVars.col.high_school = null;//hight school
                properties.dtCustomVars.col.elementary_school = null;//elementory school
                properties.refreshDt(null);   
            }
        },
        dropdownLoader: function() {
            properties.loadDistinctValues('county_code', '#mslcountry', function() {
                var country = $("#mslcountry option:selected").val();
                /*properties.loadDistinctValues('city?cond-col=county_code&cond-val='+country, '#mlscity');
                properties.loadDistinctValues('zipcode?cond-col=county_code&cond-val='+country, '#mlszipcode');
                properties.loadDistinctValues('status', '#mslpropstatus');
                properties.loadDistinctValues('dwelling_type?cond-col=county_code&cond-val='+country, '#msldwelingtype');
                properties.loadDistinctValues('subdivision?cond-col=county_code&cond-val='+country, '#mslsubdivision');
                properties.loadDistinctValues('elementary_school?cond-col=county_code&cond-val='+country, '#msleleschool');
                properties.loadDistinctValues('juniorhigh_school?cond-col=county_code&cond-val='+country, '#mlmiddleschool');
                properties.loadDistinctValues('high_school?cond-col=county_code&cond-val='+country, '#mlshightschool');
                properties.loadDistinctValues('listing_id?cond-col=county_code&cond-val='+country, '#mlslistingid');
                properties.loadDistinctValues('apn?cond-col=county_code&cond-val='+country, '#mlsapns');*/
                properties.countychangeStatus = false;
                properties.dtCustomVars.col.datasource =  $("#datasource_id option:selected").val();
                properties.dtCustomVars.col.county_code =  null;
                properties.dtCustomVars.col.city =  null;
                properties.dtCustomVars.col.zipcode =  null;
                properties.dtCustomVars.col.address =  null;
                properties.dtCustomVars.col.dwelling_type = null;//dwelling_tyoe
                properties.dtCustomVars.col.listing_id = null;//listing_id
                properties.dtCustomVars.col.apn = null;//apn
                properties.dtCustomVars.col.subdivision = null;//subdivision
                properties.dtCustomVars.col.juniorhigh_school = null;//middle school
                properties.dtCustomVars.col.high_school = null;//hight school
                properties.dtCustomVars.col.elementary_school = null;//elementory school
                properties.showGroupCollapse(null, false);
                properties.refreshDt();
            });
        },
        loadDistinctValues: function(dist_value, target, callback) {
            var datasource = $(properties.mlsDp).val();
            var url = properties.cntUrl+"/"+properties.dstAction+"/"+datasource+"/"+dist_value;
            properties.httpAPI(url, "GET", {}, "json", function(data) {
                if( callback !== undefined ) {
                    properties.addDropdownOptions(data, target, callback);
                } else {
                    properties.addDropdownOptions(data, target);
                }
            });
        },
        loadAllotherGroupCollapse: function(callback) {
            //check for country has changed or not
            if(  properties.countychangeStatus ) {
                return true;//mean not change
            }
            properties.countychangeStatus = true;
            var country = $("#mslcountry option:selected").val();
            var cities = $("#mlscity").val().join(',');
            
            var queryvals = '?cond-col=city@array-county_code&cond-val='+cities+'-'+country;
            
            if( callback !== undefined ) {
                properties.loadDistinctValues('dwelling_type'+queryvals, '#msldwelingtype', function() {
                    
                        properties.loadDistinctValues('elementary_school'+queryvals, '#msleleschool', function() {
                            properties.loadDistinctValues('juniorhigh_school'+queryvals, '#mlmiddleschool', function() {
                                properties.loadDistinctValues('high_school'+queryvals, '#mlshightschool', callback);
                            });
                        });
                    
                });
            } else {
                properties.loadDistinctValues('dwelling_type'+queryvals, '#msldwelingtype');
                properties.loadDistinctValues('elementary_school'+queryvals, '#msleleschool');
                properties.loadDistinctValues('juniorhigh_school'+queryvals, '#mlmiddleschool');
                properties.loadDistinctValues('high_school'+queryvals, '#mlshightschool');
                properties.showGroupCollapse();   
            }
        },
        showGroupCollapse: function(child, sh) {
            if( child !== undefined && child !== null ) {
                //means show only one control patent
                if( sh !== undefined && sh == false ) {
                    $("#"+child).closest("div.group-collapse").hide();
                } else {
                    $("#"+child).closest("div.group-collapse").show();
                }
                
            } else {
                if( sh !== undefined && sh == false ) {
                    //hide all 
                    $("div.group-collapse").hide();                    
                } else {
                    //show all 
                    $("div.group-collapse").show();   
                }
            }
        },
        createCsv: function() {
            var columnsArray = ["images", "address", "puchase_status_name", "sale_status_name",	"purchase_date", "purchase_amt", "sale_date", "sale_amt"];
            this.exportToCsv(this.mydatatable, "Property Report", columnsArray, this.dtCustomVars, function() {
                debug("file has been created");
            });
        }
    };
}($));
$(window).load(function() {
   properties.init(properties.datatable); 
});