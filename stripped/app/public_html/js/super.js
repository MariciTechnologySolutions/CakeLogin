//Pankaj Badukale <pankajbadukale@gmail.com>
var Pankaj = {
    firstTimer: true,
    waitMsg: "Please wait...",
    successMsg: "Completed",
    loaderDiv: $("#loaderNotifier"),
    bindAll: function() {
        var self = this;
        $.each(self, function(i, fn) {
            if( typeof fn === "function" ) {
                fn.bind(self);
            }
        });
    },
    initialize: function () {
        //ajax request handlers
        
        
        String.prototype.replaceAll = function(search, replace)
        {
            //if replace is not sent, return original string otherwise it will
            //replace search string with 'undefined'.
            if (replace === undefined) {
                return this.toString();
            }

            return this.replace(new RegExp('[' + search + ']', 'g'), replace);
        };
        String.prototype.ucwords = function () {
            return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
        }

        //when ajax start
        $(document).ajaxStart(function () {
            if( Pankaj.smsServiceCall !== undefined && Pankaj.smsServiceCall == 0 ) {
                //Pankaj.loaderDiv.html(Pankaj.waitMsg).show();   
            }
            //debug('Ajax started');
        });

        //when ajax request stop
        $(document).ajaxStop(function () {
            //Pankaj.loaderDiv.html(Pankaj.successMsg);
            Pankaj.timeout(Pankaj.loaderDiv, 1000);
            ////debug('Ajax stopped');
            //$('#content').width(
//                $(window).width() - $('#mapView').width() - $('#leftSide').width() - 5
                //$(window).width() - $('#leftSide').width() - 5
           // );
            
            
//            var intElemScrollHeight = document.getElementById('content').scrollHeight; 
//            console.log('------>>>>>> ' + intElemScrollHeight);
//            $('#wrapper').height(intElemScrollHeight);
//            $('#content').height(intElemScrollHeight);
//            $('#leftWrapperDiv').height(intElemScrollHeight);
//            $('#leftSide').height(intElemScrollHeight);
//            $('#mapDivSize100').height(intElemScrollHeight);
    
        });

        //when ajax request stop
        $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
            Pankaj.loaderDiv.html('').show();
            Pankaj.timeout(Pankaj.loaderDiv, 1000);
            //debug(settings.url);
            //debug('Ajax error occured');
            if(jqxhr.status === 403 ) {
                //not logged in
                var conf = confirm("Session expired. Please logged in");
                if( conf ) {
                    window.location.reload();
                }
            }
        });
        
        //cookie clear function 
        $("a#clearCookieNow").click(this.clearCookie.bind(this));
        
        //array prototype
        Array.prototype.unique = function(a){
            return function(){ return this.filter(a) }
        }(function(a,b,c){ return c.indexOf(a,b+1) < 0 });
    },
    inArray: function(needle, haystack){
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) return true;
        }
        return false;
    },
    logit: function(mls_data_id,action,detail){
        $.ajax({
            type: 'post',
            url: '/app/logit',
            data: {mls_data_id:mls_data_id,action:action,detail:detail},
            success: function(response){
                console.log(response);
            }
        });
    },        
    httpAPI: function (url, method, data, responsetype, callback, needPreloader) {
        $.ajax({
            url: url,
            type: method,
            data: data,
            dataType: responsetype,
            beforeSend: function (xhr) {
            },
            success: function (response, textStatus, xhr) {
                //debug(xhr.status);
                Pankaj.last_request_status = xhr.status;
                callback(response);
            },
            complete: function (xhr, textStatus) {
                //debug(xhr.status);
                Pankaj.last_request_status = xhr.status;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //debug("=============================================");
                //debug(textStatus, errorThrown);
                Pankaj.last_request_status = jqXHR.status;
                callback("error_code", jqXHR.status);
            },
            cache: false
        });
    },
    activateSplitter: function(spitter, leftTarget, rightTarget) {
        var min = 30;
        var max = 5000;
        var mainmin = 30;

        spitter.mousedown(function (e) {
            e.preventDefault();
            $(document).mousemove(function (e) {
                e.preventDefault();
                var x = e.pageX - leftTarget.offset().left;
                console.log('x: ' + x);
                
                if (x > min && x < max && e.pageX < ($(window).width() - mainmin)) {  
                  leftTarget.css("width", x);
                  rightTarget.css("margin-left", x);
                }
            })
        });
        $(document).mouseup(function (e) {
            $(document).unbind('mousemove');
        });
    },
    addDropdownOptions: function (data, target, callback) {//target is your id Exp #abc
        var options = "<option value='all'>All</option>";
        if( $.trim(target) == "#mslcountry" ) {
            //options = "";
        }
        $(data).each(function (i, v) {
            options = options + "<option value='" + v + "'>" + v + "</option>";
        });
        $(target).html(options).selectpicker('refresh');
        if (callback !== undefined) {
            callback();
        }
    },
    addDropdownOption: function (data, target, callback) {//target is your id Exp #abc
        var options = "";
        $.each(data, function (i, v) {
            options = options + "<option value='" + i + "'>" + v + "</option>";
        });
        $(target).html(options);
        if (callback !== undefined) {
            callback();
        }
    },
    slider: function(slider_id, min, max, values, step, tooltiptext, respColumn, onchangeCallback) {
            var slider_instance = $(slider_id).slider({
                range: true,
                min: min,
                max: max,
                values: values,
                step: step,
                animate: true,
                slide: function (event, ui) {
                    $(slider_id+' .sliderTooltip .stLabel').html(
                            ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' '+ tooltiptext+
                            ' <span class="fa fa-arrows-h"></span> ' +
                            ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' '+tooltiptext
                    );
                    var areaSliderRangeLeft = parseInt($(slider_id+' .ui-slider-range').css('left'));
                    var areaSliderRangeWidth = $(slider_id+' .ui-slider-range').width();
                    var areaSliderLeft = areaSliderRangeLeft + (areaSliderRangeWidth / 2) - ($(slider_id+' .sliderTooltip').width() / 2);
                    $(slider_id+' .sliderTooltip').css('left', areaSliderLeft);
                },
                change: function(event, ui) {
                    var min = ui.values[0];
                    var max = ui.values[1];
                    onchangeCallback(min, max, respColumn);
                }
            });
            this[slider_id.replace("#", "")] = slider_instance;
        },
    timeout: function(object, interval, callback) {
        setTimeout(function(){
            object.hide();
            if( callback != undefined ) {
                callback();
            }
        }, interval);
    },
    randStr: function () {
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

          for( var i=0; i < 10; i++ )
              text += possible.charAt(Math.floor(Math.random() * possible.length));

          return text;
    },
    createCookie: function(name,value,days, path) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        var path = path || "/";
        document.cookie = name+"="+value+expires+"; path="+path;
    },
    readCookie: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
    eraseCookie: function(name) {
        Pankaj.createCookie(name,"",-1);
    },
    autoComplete: function(idd, sourceFn) {
        $( "#"+idd ).autocomplete({
            minLength: 0,
            source: sourceFn,
            focus: function() {
                return false;
            },
            select: function( event, ui ) {
                
                var terms = split( this.value );
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push( ui.item.value );
                // add placeholder to get the comma-and-space at the end
                terms.push( "" );
                this.value = terms.join( "," );

                return false;
            }
        });
        function split(val) {
          return val.split( /,\s*/ );
        }
        function extractLast(term) {
          return split( term ).pop();
        }
    },
    clearCookie: function(e) {
        var cookieName = $(e.currentTarget).attr('data-cookie');
        if( this.readCookie(cookieName) !== null ) {
            //debug(cookieName);
            //debug(this);
            this.eraseCookie(cookieName);
            //window.location.reload();
        }
    },
    forIterator: function(data, executor, callback, start) {
        var start = start || 0;
        var self = this;
        if( start < data.length ) {
            executor(data[start], start, function() {
                self.forIterator(data, executor, callback, (start+1));
            });
        } else {
            callback();
        }
    },
    exportToCsv: function(datatableObject, title, columns, extraParameters, callback) {
        var self = this;
        /**
         *  Get one page only
         * var currentPageData = datatableObject.fnGetData();
         * self.JSONToCSVConvertor(currentPageData,"" , true); 
         */

        var dtAjaxParam = datatableObject._fnAjaxParameters();
        if( extraParameters != undefined ) {
            dtAjaxParam.custom = extraParameters;
        }

        var requestUrl = datatableObject.fnSettings().ajax.url + "?" + $.param(dtAjaxParam) + "&export=CSV";

        self.httpAPI(requestUrl, "GET", {}, "json", function(data) {
            dtAjaxParam = null;
            self.JSONToCSVConvertor(data.data, title, columns, true);
        });

        if( callback != undefined ) {
            callback();
        }
    },
    JSONToCSVConvertor: function(JSONData, ReportTitle, columns, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '';    
        //Set Report title in first row or line
        //CSV += ReportTitle;
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                //Now convert each value to string and comma-seprated
                if( columns.indexOf(index) > -1 ) {
                    row += index + ',';
                }
            }
            row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r';
        }
    
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            if( arrData[i].images != undefined ) {
                if( arrData[i].images == "" || arrData[i].images == '[""]' || arrData[i].images == "['']" ) {
                    arrData[i].images = "";   
                } else {
                    arrData[i].images = JSON.parse(arrData[i].images)[0];   
                }
            }
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                if( columns.indexOf(index) > -1 ) {
                    row += '"' + arrData[i][index] + '",';
                }
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            CSV += row + '\r\n';
        }
        if (CSV == '') {        
            alert("Invalid data");
            return;
        }   
        //Generate a file name
        var fileName = "CSV_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"_");       
        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension        
        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");    
        link.href = uri;
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    getMessageUpdate: function() {
        //if logged in user
        //console.log('getMessageUpdate');
        $.ajax({
            type: 'post',
            async: 'false',
            url: '/users/apiCheckLoggedInStatus',
            success: function(response){
                
                if(response == 'true'){
                    if( $("input#loginPageNotifier").length > 0 ) {
                        //debug("login page");
                    } else {
                        var url = window.location.origin + "/sms/get_message_global_update";
                        var self = Pankaj;
                        self.smsServiceCall = true;
                        self.httpAPI(url, "GET", {}, "JSON", function(data) {
                        self.smsServiceCall = false;

                            if(data.length > 0){

                                var total = data != undefined && data != null ? data[0].Message.notify : '';
                                
                                var g = $.growl.error({ title: "Messages", message: "<a href='/sms' style='color: white'>You have " + total + " unread messages.</a>" });
                                //document.getElementById('sound1').play();
                                setTimeout(function(){
                                    $('#growls').remove();
                                },5000);
                                
                                
                                document.getElementById('sound1').play();
                            
                            }else{
                                total = '';
                            }
                            $("#message_notify_num").html(total);
                            setTimeout(function() {
                                //Pankaj.getMessageUpdate();
                            }, 60000);
                        });
                    }//!else
                }//!response true
            }//!success
        });
        
        
    }
};
setTimeout(Pankaj.getMessageUpdate, 2000);

var debug = function (msg) {
    console.log(msg);
};

var debugj = function (data) {
    console.log(JSON.stringify(data));
};