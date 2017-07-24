var search = (function($){
    return {
        mydatatable     : null, 
        dtsettings      : null,
        sourceUrl       : window.location.search + "/mls/api_index",
        addresstypeUrl  : window.location.search + "/mls/api_address",
        addNewTag       : window.location.search + "/mls/api_addTag",
        deatilsUrl      : window.location.search+"/mls/view/",
        selTags         : [],
        saveTagsData    : null,
        pageLoadStatus  : true,
        countychangeStatus: false,
        homeIconImage: "house.png",
        dtCustomVars    : {
            datasource:null,//name of datasource
            col: {
                county_code: null,//country code
                city: null,//city
                zipcode: null,//zipcode
                newsince: null,//new since
                address: null,//address virtual field
                tags: null,//master tags for it
                status: null,//status
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
            }
        },
        init: function() {
            search.__proto__ = Pankaj;
            search.initialize();
            search.handlers();
        },
        handlers: function() {
            //$('.handleFilter').click(function () {
              //  $('.filterForm').slideToggle(200);
            //});            
            //$("#mslsourcepicker").selectpicker();
            search.slider('#sq_fit_range', 10000, 20000, [0, 20000], 100, "SqFt", "appx_sqft", search.onChangeInrangeSliders);
            search.slider('#deal_score', -50, 50, [-50, 50], 1, "Score", "motivation_score", search.onChangeInrangeSliders);
            search.slider('#discount', 0, 100, [0, 100], 2, "Discount", "discount", search.onChangeInrangeSliders);
            search.slider('#asking_price_range', 0, 2000000, [0, 2000000], 1000, "Price", "list_price", search.onChangeInrangeSliders);
            search.slider('#sale_price_range', 0, 2000000, [0, 2000000], 1000, "Price", "sold_price", search.onChangeInrangeSliders);
            search.slider('#lot_sqfit_range', 0, 20000, [0, 20000], 100, "SqFt", "appx_lot_sqft", search.onChangeInrangeSliders);
            search.slider('#year_build', 1900, 2015, [1900, 2015], 1, "Year", "year_built", search.onChangeInrangeSliders);
            
            $('.selectpicker').selectpicker({
                liveSearch: true
            });

            search.loadTags();
            search.typeaheadaddress();
            search.loadDistinctValues('status', '#mslpropstatus');
            search.datatable();

            //intially load city only
            search.dropdownLoader();
            //on change of datasource
            $("#datasource_id").change(search.dropdownLoader);
            //on change of country
            $("#mslcountry").change(search.dropdownLoaderCountry);            
            //on city change
            $('[data-id=mlscity]').attrchange({
                    trackValues: true, /* Default to false, if set to true the event object is 
                                            updated with old and new value.*/
                    callback: search.loadDropdownCity
            });
            //on change zipcode
            $('[data-id=mlszipcode]').attrchange({
                    trackValues: true, /* Default to false, if set to true the event object is 
                                            updated with old and new value.*/
                    callback: function(event) {
                        search.onChangeMultiSelect(event, "mlszipcode", "zipcode");
                        //search.onZipCodeChange(event);
                    }
            });
            
            //listing id change
            $('[data-id=mlslistingid]').attrchange({
                    trackValues: true, /* Default to false, if set to true the event object is 
                                            updated with old and new value.*/
                    callback: function(event) {
                        search.onChangeMultiSelect(event, "mlslistingid", "listing_id");
                    }
            });
            
            //apn change
            $('[data-id=mlsapns]').attrchange({
                    trackValues: true, /* Default to false, if set to true the event object is 
                                            updated with old and new value.*/
                    callback: function(event) {
                        search.onChangeMultiSelect(event, "mlsapns", "apn");
                    }
            });            
            
            //on change status
            $("#mslpropstatus").change(search.statusChange);
            $("#msldwelingtype").change(search.dwelingtypeChange);
            $("#mslsubdivision").change(search.mslsubdivisionChange);
            $("#msleleschool").change(search.msleleschoolChange);
            $("#mlmiddleschool").change(search.mlmiddleschoolChange);
            $("#mlshightschool").change(search.mlshightschoolChange);                
            
            //on change beds
            $("#mlsavailbeds").change(function() {
                var value = $(this).val();
                search.dtCustomVars.col.bedrooms = value;
                search.refreshDt();
            });
            
            //on change baths
            $("#mlsavailbaths").change(function() {
                var value = $(this).val();
                search.dtCustomVars.col.bathrooms = value;
                search.refreshDt();
            });
            
            //on address field out
            $("#addresstype").blur(function() {
                debug($(this).val());
                if( $.trim($(this).val()) == "") {
                    search.dtCustomVars.col.address = null;
                    search.refreshDt();
                }
            });
            
            //on submit tag add-edit form
            $("#MasterIndexForm").submit(search.addTagToDts);
            
            this.activateSplitter($("#split-bar"), $("#mapView"), $("#content"));
            
            //onclick of tag li
            $(document).on('click', ".tagmenuc>ul>li ul>li", search.addTagToDtsOnChange);
        },
        onZipCodeChange: function(event) {
            search.onChangeMultiSelect(event, "mlszipcode", "zipcode");
            search.loadAllotherGroupCollapse();
        },
        loadAllotherGroupCollapse: function(callback) {
            //check for country has changed or not
            if(  search.countychangeStatus ) {
                return true;//mean not change
            }
            search.countychangeStatus = true;
            var country = $("#mslcountry option:selected").val();
            var cities = $("#mlscity").val().join(',');
            
            var queryvals = '?cond-col=city@array-county_code&cond-val='+cities+'-'+country;
            
            if( callback !== undefined ) {
                search.loadDistinctValues('dwelling_type'+queryvals, '#msldwelingtype', function() {
                    search.loadDistinctValues('subdivision'+queryvals, '#mslsubdivision', function() {
                        search.loadDistinctValues('elementary_school'+queryvals, '#msleleschool', function() {
                            search.loadDistinctValues('juniorhigh_school'+queryvals, '#mlmiddleschool', function() {
                                search.loadDistinctValues('high_school'+queryvals, '#mlshightschool', function() {
                                    search.loadDistinctValues('listing_id'+queryvals, '#mlslistingid', function() {
                                       search.loadDistinctValues('apn'+queryvals, '#mlsapns', callback);  
                                    });
                                });
                            });
                        });
                    });
                });
            } else {
                search.loadDistinctValues('dwelling_type'+queryvals, '#msldwelingtype');
                search.loadDistinctValues('subdivision'+queryvals, '#mslsubdivision');
                search.loadDistinctValues('elementary_school'+queryvals, '#msleleschool');
                search.loadDistinctValues('juniorhigh_school'+queryvals, '#mlmiddleschool');
                search.loadDistinctValues('high_school'+queryvals, '#mlshightschool');
                search.loadDistinctValues('listing_id'+queryvals, '#mlslistingid');
                search.loadDistinctValues('apn'+queryvals, '#mlsapns');
                search.showGroupCollapse();   
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
        onChangeInrangeSliders: function(min, max, columnName) {
            debug("@range"+min+"-"+max);
            search.dtCustomVars.col[columnName] = "@range"+min+"-"+max;
            search.refreshDt();
        },
        datatable: function() {
            search.mydatatable = $('#mydatatable').dataTable({
                    destroy        : true,
                    searching      : false,
                    processing     : true,
                    serverSide     : true,
                    deferLoading   : 0,//it stop to load at initial leverl
                    ajax           : {
                        url: search.sourceUrl,
                        data: function(data) {
                            data.custom = search.dtCustomVars;
                            return data;
                        }
                    },
                    columns        : [
                           { 
                               data: 'images',
                                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                                    var imageLink = window.location.origin+"/images/"+search.homeIconImage;
                                    if( $.trim(oData.images) != '[""]' && $.trim(oData.images) != "" ) {
                                        //imageLink = JSON.parse(oData.images)[0].replace('.jpg', '-t.jpg');
                                        imageLink = JSON.parse(oData.images)[0];
                                    }
                                    
                                    var url = search.deatilsUrl+$("#datasource_id").val()+"/"+oData.id;
                                    var image = "<img style='width:160px;' src='"+imageLink+"' title='house image' alt='house'/>";
                                    var linkA = "<a href='"+url+"' target='_blank'>"+image+"</a>";
                                    $(nTd).html(linkA);
                                }
                           },
                           { 
                               data: 'list_price',
                                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                                    list_price = oData.list_price;
                                   if(oData.status == 'Closed') {
                                       list_price = oData.sold_price;
                                   }
                                    $(nTd).html(list_price);
                                }
                           },
                           { 
                               data: 'address',
                                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                                    var url = search.deatilsUrl+$("#datasource_id").val()+"/"+oData.id;
                                    var linkA = "<a href='"+url+"' target='_blank'>"+oData.address+"</a>";
                                    $(nTd).html(linkA + "<input type='hidden' id='" + oData.id + "'>");
                                }
                           },
                           { data: 'status'},
                           { data: 'appx_sqft'},
                           { data: 'appx_lot_sqft'},
                           { 
                               data: 'sold_price',
                                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                                    var price_sqft = oData.list_price / oData.appx_sqft; 
                                    if ( oData.status == 'Closed' ) {
                                        price_sqft = oData.sold_price / oData.appx_sqft;
                                    } 
                                    $(nTd).html(parseFloat(price_sqft).toFixed(2));
                                }
                           },
                           { data: 'bedrooms'},
                           { data: 'bathrooms'},
                           { data: 'year_built'},
                           { data: 'subdivision'},
                           { data: 'pool'},
                           { data: 'adom'},
                           { data: 'coe'},
                           { 
                               data: 'discount',
                                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                                    var dId = search.randStr();
                                    var hInput = "<input type='hidden' class='nnew' value='"+oData.id+"'/>";
                                    var hUInput = "<input type='hidden' class='update' value='"+oData.tag+"'/>";
                                    var hURInput = "<input type='hidden' class='rupdate' value='"+oData.ridtag+"'/>";
                                    var tagA = "<span class='tagnn'>Add</span><a id='"+dId+"' href='javascript:void(0);' class='fa fa-plus-square'></a>";
                                    var tagU = "<a id='"+dId+"' href='javascript:void(0);' class='fa fa-edit'></a>";
                                    var tag = "";
                                    if( oData.tag == 0 ) {
                                        //no tag 
                                        tag = tagA;
                                    } else {
                                        tag = "<span class='tagnn'>"+$("a[data-rel-id='"+oData.tag+"']").text()+"</span>"+ tagU;
                                    }
                                    var ul = $("#MasterTagId").html().replace(new RegExp("option", 'g'), "li");
                                    ul = "<div class='tagmenuc'><ul><li>"+tag+"<ul>"+ul+"</ul></li></ul></div>";
                                    
                                    $(nTd).html(hUInput+hInput+hURInput+ul);
                                }
                           }
                    ],
                    fnPreDrawCallback: function() {
                        if( search.saveTagsData === null ) {
                            search.loadTagsData(function(options){
                               search.saveTagsData = options; 
                            });   
                        }
                    }
            });
        },
        refreshDt: function() {
            if( search.pageLoadStatus ) {
                search.pageLoadStatus = false;
                if( search.readCookie("mlsSearch") !== null ) {
                    //cookied 
                    var columnData = JSON.parse(search.readCookie("mlsSearch"));
                    search.dtCustomVars = columnData;
                    search.manageCookieSelection();
                }
            } else {
                var columnData = JSON.stringify(search.dtCustomVars);
                search.createCookie("mlsSearch", columnData, 7);   
            }
            search.mydatatable._fnAjaxUpdate();
        },
        manageCookieSelection: function() {
            //set datasource column
            $("#datasource_id").val(search.dtCustomVars.datasource).selectpicker("refresh");
            setTimeout(function() {
                //set country selected
                if( search.dtCustomVars.col.county_code !== null && search.dtCustomVars.col.county_code != "all") {
                    debug("county code is not null value");
                    $("#mslcountry").val(search.dtCustomVars.col.county_code).selectpicker('refresh');
                    //on country loaded set city selected
                    search.dropdownLoaderCountry(true, function() {
                        debug('all county dropdown has loaded now');
                        if( search.dtCustomVars.col.city !== null ) {
                            var cvalues = search.dtCustomVars.col.city.replace("@array", "").split(",");
                            debug(cvalues);
                            setTimeout(function() {
                                $("#mlscity").val(cvalues).selectpicker('refresh');
                                    debug('city selection done now');
                                    //on load of cities set zipcode selected
                                    search.cookieZipcodeLoad();
                            }, 1000);
                        }
                    });
                }
                //now set tag, status, slider, bed, bath values
                //tag
                if( search.dtCustomVars.col.tags !== null ) {
                    var taggs = search.dtCustomVars.col.tags.replace("@join", "").split("-");
                    $.each(taggs, function(i, t) {
                        $("a[data-rel-id='"+t+"']").addClass('active');
                        debug("activating tag => "+t);
                    });
                }
                //status
                $("#mslpropstatus").val(search.dtCustomVars.col.status || "all").selectpicker("refresh");
                //sliders
                if( search.dtCustomVars.col.appx_sqft !== null ) {
                    var minMax = search.dtCustomVars.col.appx_sqft.replace("@range", "").split("-");
                    search.sq_fit_range.slider("values", minMax);
                }
                if( search.dtCustomVars.col.motivation_score !== null ) {
                    var minMax = search.dtCustomVars.col.motivation_score.replace("@range", "").split("-");
                    search.deal_score.slider("values", minMax);
                }
                if( search.dtCustomVars.col.discount !== null ) {
                    var minMax = search.dtCustomVars.col.discount.replace("@range", "").split("-");
                    search.discount.slider("values", minMax);
                }
                if( search.dtCustomVars.col.list_price !== null ) {
                    var minMax = search.dtCustomVars.col.list_price.replace("@range", "").split("-");
                    search.asking_price_range.slider("values", minMax);
                }
                if( search.dtCustomVars.col.sold_price !== null ) {
                    var minMax = search.dtCustomVars.col.sold_price.replace("@range", "").split("-");
                    search.sale_price_range.slider("values", minMax);
                }
                if( search.dtCustomVars.col.appx_lot_sqft !== null ) {
                    var minMax = search.dtCustomVars.col.appx_lot_sqft.replace("@range", "").split("-");
                    search.lot_sqfit_range.slider("values", minMax);
                }
                if( search.dtCustomVars.col.year_built !== null ) {
                    var minMax = search.dtCustomVars.col.year_built.replace("@range", "").split("-");
                    search.year_build.slider("values", minMax);
                }
                //bed bath
                $("#mlsavailbeds").val(search.dtCustomVars.col.bedrooms || "all").selectpicker("refresh");
                $("#mlsavailbaths").val(search.dtCustomVars.col.bathrooms || "all").selectpicker("refresh");
            }, 1000);
        },
        cookieZipcodeLoad: function() {
            debug("in cookie zipcode load function");
            var cities = $("#mlscity").val().join(',');
            var country = $("#mslcountry option:selected").val();
            var queryvals = '?cond-col=city@array-county_code&cond-val='+cities+'-'+country;
            search.loadDistinctValues('zipcode'+queryvals, '#mlszipcode', function() {
                setTimeout(function() {
                    if( search.dtCustomVars.col.zipcode !== null ) {
                        var zvalues = search.dtCustomVars.col.zipcode.replace("@array", "").split(",");
                        debug(zvalues);
                        $("#mlszipcode").val(zvalues).selectpicker('refresh');
                    }
                    search.showGroupCollapse();
                    search.loadAllotherGroupCollapse(function() {
                        //if address exist then fill input with address
                        $("#addresstype").val(search.dtCustomVars.col.address || "");
                        
                        //set value for other dropdown
                        $("#msldwelingtype").val(search.dtCustomVars.col.dwelling_type || 'all').selectpicker('refresh');
                        $("#mslsubdivision").val(search.dtCustomVars.col.subdivision || 'all').selectpicker('refresh');
                        $("#msleleschool").val(search.dtCustomVars.col.elementary_school || 'all').selectpicker('refresh');
                        $("#mlmiddleschool").val(search.dtCustomVars.col.juniorhigh_school || 'all').selectpicker('refresh');
                        $("#mlshightschool").val(search.dtCustomVars.col.high_school || 'all').selectpicker('refresh');
                        
                        if( search.dtCustomVars.col.listing_id !== null ) {
                            var lid = search.dtCustomVars.col.listing_id.replace("@array", "").split(",");
                            debug(lid);
                            setTimeout(function() {
                                $("#mlslistingid").val(lid).selectpicker('refresh');
                            }, 1000);
                        }
                        if( search.dtCustomVars.col.apn !== null ) {
                            var apnl = search.dtCustomVars.col.apn.replace("@array", "").split(",");
                            debug(apnl);
                            setTimeout(function() {
                                $("#mlsapns").val(apnl).selectpicker('refresh');
                            });
                        }
                        
                        debug("all other loaded please check");
                        
                    });
                }, 1000);
            });
        },
        selectpicker: function(id, options) {
            //$(id).selectpicker(options);
        },
        loadTagsData: function(callback) {
            var datasource = $("#datasource_id option:selected").val();
            var url =  window.location.search+"/mls/api_getTags/"+datasource;
            search.httpAPI(url, "GET", {}, "json", function(data) {
                var options = "<option value=''>NA</option>";
                $.each(data, function(i, v) {
                    options = options + "<option value='"+i+"'>"+v+"</option>";
                });
                if( callback !== undefined ) {
                    callback(options);
                } else {
                    return options;
                }
            });
        },
        loadTags: function(callback) {
            var datasource = $("#datasource_id option:selected").val();
            var url =  window.location.search+"/mls/api_getTags/"+datasource;
            search.httpAPI(url, "GET", {}, "json", function(data) {
                $("#tagsmls").html("");
                var options = "<option value='delete'>NA</option>";
                $.each(data, function(i, v) {
                    options = options + "<option value='"+i+"'>"+v+"</option>";
                    $("#tagsmls").append('<a href="javascript:void(0)" class="btn btn-o btn-default" onclick="tagFilter(this);" data-rel-id="'+i+'" data-rel-type="'+datasource+'" >'+v+'</a>');
                });
                
                $("#MasterTagId").html(options).selectpicker("refresh");
                
                if( callback !== undefined ) {
                    callback();
                }
            });
        },
        statusChange: function() {
            search.dtCustomVars.col.status =  $("#mslpropstatus").val();
            search.refreshDt();                
        },
        dwelingtypeChange: function() {
            search.dtCustomVars.col.dwelling_type =  $("#msldwelingtype").val();
            search.refreshDt();                
        },
        mslsubdivisionChange: function() {
            search.dtCustomVars.col.subdivision =  $("#mslsubdivision").val();
            search.refreshDt();                
        },
        msleleschoolChange: function() {
            search.dtCustomVars.col.elementary_school =  $("#msleleschool").val();
            search.refreshDt();                
        },
        mlmiddleschoolChange: function() {
            search.dtCustomVars.col.juniorhigh_school =  $("#mlmiddleschool").val();
            search.refreshDt();                
        },        
        mlshightschoolChange: function() {
            search.dtCustomVars.col.high_school =  $("#mlshightschool").val();
            search.refreshDt();                
        },        
        typeaheadaddress: function() {
            var query_string = "";
            var county      = $("#mslcountry option:selected").val();
            var dtsource    = $("#datasource_id option:selected").val();
            var city        = $("#mslcity").val();
            var zipcode     = $("#mlszipcode").val();
            debug(county);
            query_string = "?datasource="+dtsource;
            
            debug(dtsource);
            query_string = query_string +"&county="+county;
            
            if( city != undefined && city != null && city.length > 0 ) {
                query_string = query_string +"&city="+city.join(',');
            }
            
            if( zipcode != undefined && zipcode != null && zipcode.length > 0 ) {
                query_string = query_string +"&zipcode="+zipcode.join(',');
            }
            debug(query_string);
            /*$("input#addresstype").typeahead({
                ajax: search.addresstypeUrl + query_string,
                onSelect: function(item) {
                    debug(item);
                },
                displayField: 'address',
                val: 'id'
            });*/
            
            $("input#addresstype").typeahead({
                onSelect: function(item) {
                    search.addreesHasChanged(item.text);
                },
                ajax: {
                    url: search.addresstypeUrl,
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
                            county:$("#datasource_id option:selected").val(),
                            query: query
                        }
                    },
                    preProcess: function (data) {
                        return data;
                    }
                }
            });
            
        },
        addreesHasChanged: function(address) {
            search.dtCustomVars.col.address =  address;
            search.refreshDt();            
        },
        dropdownLoader: function() {
            search.loadDistinctValues('county_code', '#mslcountry');
            /*var country = $("#mslcountry option:selected").val();
            search.loadDistinctValues('city?cond-col=county_code&cond-val='+country, '#mlscity');
            search.loadDistinctValues('zipcode?cond-col=county_code&cond-val='+country, '#mlszipcode');
            search.loadDistinctValues('status', '#mslpropstatus');
            search.loadDistinctValues('dwelling_type?cond-col=county_code&cond-val='+country, '#msldwelingtype');
            search.loadDistinctValues('subdivision?cond-col=county_code&cond-val='+country, '#mslsubdivision');
            search.loadDistinctValues('elementary_school?cond-col=county_code&cond-val='+country, '#msleleschool');
            search.loadDistinctValues('juniorhigh_school?cond-col=county_code&cond-val='+country, '#mlmiddleschool');
            search.loadDistinctValues('high_school?cond-col=county_code&cond-val='+country, '#mlshightschool');
            search.loadDistinctValues('listing_id?cond-col=county_code&cond-val='+country, '#mlslistingid');
            search.loadDistinctValues('apn?cond-col=county_code&cond-val='+country, '#mlsapns');
            search.loadTags();
            search.typeaheadaddress();*/
            search.dtCustomVars.datasource =  $("#datasource_id option:selected").val();
            search.dtCustomVars.col.county_code =  null;
            search.dtCustomVars.col.city =  null;
            search.dtCustomVars.col.zipcode =  null;
            search.dtCustomVars.col.address =  null;
            search.dtCustomVars.col.dwelling_type = null;//dwelling_tyoe
            search.dtCustomVars.col.listing_id = null;//listing_id
            search.dtCustomVars.col.apn = null;//apn
            search.dtCustomVars.col.subdivision = null;//subdivision
            search.dtCustomVars.col.juniorhigh_school = null;//middle school
            search.dtCustomVars.col.high_school = null;//hight school
            search.dtCustomVars.col.elementary_school = null;//elementory school
            search.countychangeStatus = false;
            search.showGroupCollapse(null, false);
            search.refreshDt();
        },
        dropdownLoaderCountry: function(bypass, callback) {
            var country = $("#mslcountry option:selected").val();
            search.loadDistinctValues('city?cond-col=county_code&cond-val='+country, '#mlscity', function() {
                search.showGroupCollapse(null, false);
                search.showGroupCollapse("mlscity");
                debug('Cities are loaded now');
                if( bypass !== undefined && bypass == true) {
                    debug('call back has returned');
                    callback();
                } else {
                    debug('Country changed');
                    search.dtCustomVars.col.county_code =  country;
                    search.dtCustomVars.col.city =  null;
                    search.dtCustomVars.col.zipcode =  null;
                    search.dtCustomVars.col.address =  null;
                    search.dtCustomVars.col.dwelling_type = null;//dwelling_tyoe
                    search.dtCustomVars.col.listing_id = null;//listing_id
                    search.dtCustomVars.col.apn = null;//apn
                    search.dtCustomVars.col.subdivision = null;//subdivision
                    search.dtCustomVars.col.juniorhigh_school = null;//middle school
                    search.dtCustomVars.col.high_school = null;//hight school
                    search.dtCustomVars.col.elementary_school = null;//elementory school
                    search.refreshDt();   
                }
            });
            /*search.loadDistinctValues('zipcode?cond-col=county_code&cond-val='+country, '#mlszipcode');
            search.loadDistinctValues('dwelling_type?cond-col=county_code&cond-val='+country, '#msldwelingtype');
            search.loadDistinctValues('subdivision?cond-col=county_code&cond-val='+country, '#mslsubdivision');
            search.loadDistinctValues('elementary_school?cond-col=county_code&cond-val='+country, '#msleleschool');
            search.loadDistinctValues('juniorhigh_school?cond-col=county_code&cond-val='+country, '#mlmiddleschool');
            search.loadDistinctValues('high_school?cond-col=county_code&cond-val='+country, '#mlshightschool');
            search.loadDistinctValues('listing_id?cond-col=county_code&cond-val='+country, '#mlslistingid');
            search.loadDistinctValues('apn?cond-col=county_code&cond-val='+country, '#mlsapns');*/
        },
        loadDropdownCity: function(event) {
            debug($(event.target).attr('aria-expanded'));
            if( $('button[data-id=mlscity]').attr('aria-expanded') == 'false' ) {
                debug('start loading city data');
                debug($("#mlscity").val());
                if( $("#mlscity").val() !== undefined && $("#mlscity").val() !== null && $("#mlscity").val().length > 0) {
                    //it has some value selected
                    var cities = $("#mlscity").val().join(',');
                    var country = $("#mslcountry option:selected").val();
                    var queryvals = '?cond-col=city@array-county_code&cond-val='+cities+'-'+country;
                    search.loadDistinctValues('zipcode'+queryvals, '#mlszipcode', function() {
                        search.showGroupCollapse();
                        search.loadAllotherGroupCollapse();
                    });
                    /*search.loadDistinctValues('dwelling_type'+queryvals, '#msldwelingtype');
                    search.loadDistinctValues('subdivision'+queryvals, '#mslsubdivision');
                    search.loadDistinctValues('elementary_school'+queryvals, '#msleleschool');
                    search.loadDistinctValues('juniorhigh_school'+queryvals, '#mlmiddleschool');
                    search.loadDistinctValues('high_school'+queryvals, '#mlshightschool');
                    search.loadDistinctValues('listing_id'+queryvals, '#mlslistingid');
                    search.loadDistinctValues('apn'+queryvals, '#mlsapns');*/
                    search.dtCustomVars.col.city =  "@array"+cities;
                    search.dtCustomVars.col.zipcode =  null;
                    search.dtCustomVars.col.address =  null;
                    search.refreshDt();
                }
            }
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
                    search.dtCustomVars.col[colName] =  "@array"+objectValues;
                    search.refreshDt();
                } else {
                    search.dtCustomVars.col[colName] =  null;
                    search.refreshDt();
                }
            }
        },
        loadDistinctValues: function(dist_value, target, callback) {
            var datasource = $("#datasource_id option:selected").val();
            var url =  window.location.search+"/mls/api_getSourceDistinct/"+datasource+"/"+dist_value;
            search.httpAPI(url, "GET", {}, "json", function(data) {
                if( callback !== undefined ) {
                    search.addDropdownOptions(data, target, callback);
                } else {
                    search.addDropdownOptions(data, target);
                }
            });
        },
        tagFilter: function(object) {
            debug('tag clicked');
            var type = $(object).attr('data-rel-type');
            var id   = $(object).attr('data-rel-id');
            //check for active class
            if ($(object).hasClass('active')) {
                //remove active class
                $(object).removeClass('active');
                //remove element from array
                /*
                 var y = [1, 2, 2, 3, 2]
                var removeItem = 2;

                y = jQuery.grep(y, function(value) {
                  return value != removeItem;
                });
                 */
                search.selTags = jQuery.grep(search.selTags, function(value) {
                  return value != id;
                });
            } else {
                //add active class
                $(object).addClass('active');
                //add in array
                search.selTags.push(id);
            }    
            
            //now go for server side
            //check for tags array length
            if( search.selTags.length > 0 ) {
                //there are some tag for filter
                var tagss = "@join"+search.selTags.join("-");
                search.dtCustomVars.col.tags = tagss;
                search.refreshDt();
            } else {
                //no tag to filter must remove and refresh dt table
                search.selTags = [];
                search.dtCustomVars.col.tags = null;
                search.refreshDt();
            }
        },
        addTagToDtsOnChange: function() {
                var dts = $("#datasource_id").val();
                var rowId = $(this).closest('td').find('input.nnew').val();
                var updateId = $(this).closest('td').find('input.update').val();
                var tagUpdate = $(this).closest('td').find('input.rupdate').val();
                var tagId = $(this).attr('value');
                var self = $(this);
            var url = search.addNewTag + "/"+dts+"/"+rowId+"/"+tagId+"/"+tagUpdate;
            search.httpAPI(url, "GET", {}, "json", function(data) {
                debug(data);
                if( data.status == "success" ) {
                    if( data.id == 0 ) {
                        //mean NA deleted
                        self.closest('td').find('input.rupdate').val(data.id);
                        self.closest('td').find('input.update').val(0);
                        var tag = "";
                        self.closest('td').find('span.tagnn').text('Add');
                        self.closest('td').find('a').removeClass('fa fa-edit').addClass('fa fa-plus-square');
                        alert("Tag Deleted");
                    } else {
                        //other
                        self.closest('td').find('input.rupdate').val(data.id);
                        self.closest('td').find('input.update').val(tagId);
                        var tag = $("a[data-rel-id='"+tagId+"']").text();
                        if( self.closest('td').find('span.tagnn').text() == "Add" ) {
                            //mean add
                            self.closest('td').find('span.tagnn').text(tag);
                            self.closest('td').find('a').removeClass('fa fa-plus-square').addClass('fa fa-edit');
                            alert("Tag added");
                        } else {
                            //mean edit
                            self.closest('td').find('span.tagnn').text(tag);
                            alert("Tag updated");
                        }
                    }
                } else {
                    alert(data.message + "Or some wrong step.");
                }
                debug(data.message);
            });       
        }
    };
}($));
search.init();



/**
 * 
 * https://github.com/truckingsim/Ajax-Bootstrap-Select
 * 
             { data: 'id},
            { data: 'images},
            { data: 'list_price},
            { data: 'address},
            { data: 'status},
            { data: 'appx_sqft},
            { data: 'appx_lot_sqft},
            { data: 'sold_price},
            { data: 'bedrooms},
            { data: 'bathrooms},
            { data: 'year_built},
            { data: 'subdivision},
            { data: 'pool},
            { data: 'adom},
            { data: 'coe'
 * DICTIONARY
 * 
 * 1. HIDE AND SHOW DATACOLUMNS
 https://datatables.net/examples/api/show_hide.html
 $(document).ready(function() {
    var table = $('#example').DataTable( {
        "scrollY": "200px",
        "paging": false
    } );
 
    $('a.toggle-vis').on( 'click}, function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = table.column( $(this).attr('data-column') );
 
        // Toggle the visibility
        column.visible( ! column.visible() );
    } );
} );
 * 
 * 
 */

//some public functions
function tagFilter(obj) {
    search.tagFilter(obj);
}