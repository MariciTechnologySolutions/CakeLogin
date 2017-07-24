//all the property related action will be handle from here

var properties = (function($){
    return {
        init: function(callback) {
            properties.__proto__ = Pankaj;
            properties.initialize();
        },
//        hideshowContent: function() {
//            if( !$(this).hasClass("selectedTab") ) {
//                $(this).closest("div.mytabview").find("div.selectedTab").removeClass("selectedTab");
//                $(this).addClass("selectedTab");
//                var selector = $.trim($(this).html());
//                if( selector == "Map" ) {
//                    $("#mapView").show();
//                    $("#imagedivv").hide();
//                    $("#inboxdivv").hide();
//                } else if( selector == "Images" ) {
//                    $("#mapView").hide();
//                    $("#imagedivv").show();
//                    $("#inboxdivv").hide();
//                }
//                
//                if( selector == "Inbox" ) {
//                    $("#mapView").hide();
//                    $("#imagedivv").hide();
//                    $("#inboxdivv").show();
//                }
//            }
//        },
        removeOneNote: function(e) {
            var object = $(e.currentTarget);
            var id = object.attr("data-id");
            
            var url = this.deleteNote+"/"+id;
            var self = this;
            this.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    self.listPropNotes();
                    $("#notetextbox").val("");
                }
                alert(data.message);
            });
        },
        listPropNotes: function() {
            this.httpAPI(this.listNotes+"/"+$("#property_id").val(), "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    //<li class="mb5">8/09/1200: This is note (Pankaj)</li>
                    if( data.data.length > 0 ) {
                        var LI = "";
                        $(data.data).each(function(i, v) {
                            debug(v);
                            var remove = "<a href='javascript:void(0)' class='removeThisNoteNow' data-id='"+v.id+"'>Remove</a>";
                            LI +='<li class="mb5">'+v.created+': '+v.note+'('+v.name+') '+remove+'</li>';
                        }); 
                        debug(LI);
                        $("#addNotesHere").html(LI);
                    }
                }
            });
        },
        addNewNote: function() {
            var note = $("#notetextbox").val();
            
            if( $.trim(note) == "" ) {
                alert('Please enter some text to note.');
                return ;
            }
            var mls_id = $("#property_id").val();
            var url = this.addNote+"/"+mls_id+"/"+note;
            var self = this;
            this.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    self.listPropNotes();
                    $("#notetextbox").val("");
                }
                alert(data.message);
            });
        },
        createNewTask: function(e) {
            e.preventDefault();
            var name = $("#PropertyTaskName").val();
            if( $.trim(name) == "" ) {
                alert("Please enter task.");
                return ;
            }
            var mls_id = $("#PropertyTaskMlsDataId").val();
            var url = this.addOneTask +"/"+ mls_id +"/"+ name;
            var self = this;
            this.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    self.listpropTask();
                    $("#addNewTask").modal("hide");
                }
                alert(data.message);
            });
        },
        openTaskPopup: function() {
            $("#addNewTask").modal("show");
        },
//        toggleMapImage: function() {
//            if( $.trim($(this).html()) == "Map" ) {
//                $("#imagedivv").hide();
//                $("#mapView").show();
//                $(this).html('Image');
//            } else {
//                $("#mapView").hide();
//                $("#imagedivv").show();
//                $("#imagedivv").css('height', $("#mapView").height()+"px");
//                $(this).html('Map');
//            }
//        },
        attachContactToProperty: function(){
            var self = $(this);
            var property_contact_id = self.attr('data-rel-id');
            var mls_id = $("#property_id").val();
            var prop = properties;
            
            prop.httpAPI(prop.attachContUrl+"/"+mls_id+"/"+property_contact_id, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    prop.listContacts();
                    self.closest('tr').remove();
                }
                alert(data.message);
            });
        },
        editPropContact: function() {
            var self = $(this);
            var id  = self.closest('tr').find('select.roleselect option:first').attr('data-rel-id');
            var role = self.closest('tr').find('select.roleselect').val();
            var name = self.closest('tr').find('.name').html();
            var email = self.closest('tr').find('.email').html();
            var phone = self.closest('tr').find('.phone').html();
            var company = self.closest('tr').find('.company').html();
            var mls_data_id = self.closest('tr').find('.mls_data_id').val();
            console.log(id+role+name+email+phone);
            var form  = $("#edit_prop_contact");
            form.find('#PropertyContactName').val('');
            form.find('#PropertyContactEmail').val('');
            form.find('#PropertyContactPhone').val('');
            form.find('#PropertyContactId').val('');
            form.find('#PropertyContactCompanyName').val('');
            form.find('#PropertyContactMlsDataId').val('');
            
            form.find('#PropertyContactName').val(name);
            form.find('#PropertyContactEmail').val(email);
            form.find('#PropertyContactPhone').val(phone);
            form.find('#PropertyContactRole').val(role);
            form.find('#PropertyContactId').val(id);
            form.find('#PropertyContactCompanyName').val(company);
            form.find('#PropertyContactMlsDataId').val(mls_data_id);
            
            $("#edit_prop_contact").modal("show");
        },
        removePropContact: function() {
            var self = $(this);
            var id  = self.closest('tr').find('select.roleselect option:first').attr('data-rel-id');
            var mls_id = $("#property_id").val();
            var prop = properties;
            prop.httpAPI(prop.rmPropContact+"/"+id+"/"+mls_id, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    self.closest('tr').remove();
                    if( $("#proprelcontacts table tbody tr").length <= 0 ) {
                        $("#buttonproprelcontacts").show();
                        $("#proprelcontacts").hide();
                    }
                }
                alert(data.message);
            });
        },
        changeRole: function() {
            var self = properties;
            var id = $(this).attr('data-rel-id');
            var role = $(this).val();
            var prop = properties;
            prop.httpAPI(prop.changeRoleC+"/"+id+"/"+role, "GET", {}, "json", function(data) {
                alert(data.message);
            });
        },
        addContact: function(e) {
            e.preventDefault();
            var modal = $(this).closest('div.modal');
            var formurl = $(this).attr('action');
            var data = $(this).serialize();
            var self = properties;
            $.ajax({
              url: self.addContUrl,
              type: "POST",
              dataType: 'json',
              data: data,
              success: function(response){
                  if( response.status == "success" ) {
                      modal.modal("hide");
                      self.listContacts();
                  }
                  alert(response.message);
              },
              cache: false
            });
        },
        listContacts: function() {
            var self = this;
            this.httpAPI(this.listContact+"/"+$("#property_id").val(), "GET", {}, "json", function(data) {
                debug(data);
                if( data.length > 0 ) {
                    var tbody = $("#proprelcontacts table tbody");
                    tbody.html('');
                    $("#buttonproprelcontacts").hide();
                    $("#proprelcontacts").show();
                    self.propertyContacts = data;
                    if( $("#PropertyComposeMailEmailContacts").length > 0 ) {
                        $("#PropertyComposeMailEmailContacts").html("");
                    }
                    $.each(data, function(i, v) {
                        var roleData = $("#edit_prop_contact #PropertyContactRole option");
                        debug("==============================================");
                        console.log(roleData);
                        var roleSelect = "<select class='roleselect'>";
                        roleData.each(function() {
                            var value = $(this).val();
                            var text = $(this).text();
                            
                            if( value == v.PropertyContact.role ) {
                                roleSelect = roleSelect + "<option value='"+value+"' data-rel-id='"+v.PropertyContact.id+"' SELECTED>"+text+"</option>";                                
                            } else {
                                roleSelect = roleSelect + "<option value='"+value+"' data-rel-id='"+v.PropertyContact.id+"'>"+text+"</option>";
                            }
                        });
                        roleSelect = roleSelect + "</select>";
                        var remove = '<a href="javascript:void(0);" class="removepropcontact"><span class="glyphicon glyphicon-remove"></span></a>';
                        var edit   = '<a href="javascript:void(0);" class="editpropcontact"><span class="fa fa-edit"></span></a>';
                        var mls_data_id = '<input type="hidden" value="'+v.PropertyContact.mls_data_id+'" class="mls_data_id">';
                        var tr = '<tr>\
                                    <td>'+(i + 1 )+mls_data_id+'</td>\
                                    <td title="'+v.PropertyContact.created+'" class="name">'+v.PropertyContact.name+'</td>\
                                    <td class="email">'+v.PropertyContact.email+'</td>\
                                    <td class="phone">'+v.PropertyContact.phone+'</td>\
                                    <td class="company">'+v.PropertyContact.company_name+'</td>\
                                    <td class="roleid">'+roleSelect+'</td>\
                                    <td class="action">'+edit+remove+'</td>\
                                </tr>';
                        //html for the select of compose email
                        if( $("#PropertyComposeMailEmailContacts").length > 0 ) {
                            $("#PropertyComposeMailEmailContacts").append("<option value='"+v.PropertyContact.email+"'>"+v.PropertyContact.email+"</option>");
                        }
                        tbody.append(tr);
                    });   
                } else {
                    $("#proprelcontacts").hide();
                }
            });    
        },
        changeTaskStatus: function() {
            var self = $(this);
            var status = self.attr('data-rel-status');
            var id     = self.attr('data-rel-id');
            var prop = properties;
            var url  = prop.chTaskStatus+"/"+id+"/"+status;
            prop.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == 'success' ) {
                    if( status == 0 ) {
                        self.attr('data-rel-status', '1');
                        self.html('CLOSE');
                    } else {
                        self.attr('data-rel-status', '0');
                        self.html('OPEN');
                    }
                }
                alert(data.message);
            });
        },
        createTask: function() {
            var self = $(this);
            var id   = self.attr('data-rel-id');
            var status = self.attr('data-rel-status');
            var status_name = $.trim(self.html());
            var changeTarget = self.closest('div').find('span.manage_listing');
            var type = self.attr('data-rel-type');
            var btntxt = self.text();
            var prop = properties;
            var url  = prop.addTask+"/"+id+"/"+type+"/"+status;
            prop.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == 'success' ) {
                    prop.listpropTask();
                    prop.changeStatusOfpropText(changeTarget, type, status_name);
                } else if(data.secureCode != undefined || data.secureCode != "fail") {
                    prop.changeStatusOfpropText(changeTarget, type, status_name);
                }
                
                if( data.status == 'error' ) {
                    prop.openTaskPopup();
                }
                
                alert(data.message);
            });
        },
        changeStatusOfpropText: function(target, type, name) {
            var status_text = "";
            if( type == 0 ) {
                status_text = "Purchase Status: "+name;
            } else {
                status_text = "Sale Status: "+name;
            }
            
            target.html(status_text);
        },
        listpropTask: function() {
            this.httpAPI(this.listTask+"/"+$("#property_id").val(), "GET", {}, "json", function(data) {
                debug(data);
                if( data.length > 0 ) {
                    var tbody = $("#taskmanager table tbody");
                    tbody.html('');
                    $.each(data, function(i, v) {
                        var status = "<a href='#' class='taskstatus' data-rel-status='0' data-rel-id='"+v.id+"'>OPEN</a>";
                        if(v.status == 1) {
                            status = "<a href='#' class='taskstatus' data-rel-status='1' data-rel-id='"+v.id+"'>CLOSE</a>";
                        }
                        if( v.task_id == "0" ) {
                            v.name = v.task;
                        }
                        var tr = '<tr>\
                                    <td>'+(i + 1 )+'</td>\
                                    <td>'+v.name+'</td>\
                                    <td title="'+v.created+'">'+status+'</td>\
                                </tr>';
                        tbody.append(tr);
                    });   
                } else {
                    //$("#taskmanager").hide();
                }
            });
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


                var lat = $("#lat").val();
                var lng = $("#lng").val();
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
                properties.createInfobox();
                //infobox html
                var infoboxContent = '<div class="infoW">' +
                        '<div class="propImg">' +
                            '<div style="background-color: #0d9095;height: 40px"></div>' +
                            '<div class="propBg">' +
                                '<div class="propPrice">' + $.trim($("#propprice").html()) + '</div>' +
                                '<div class="propType" style="color: #505050">' + $("#mlsstatus").html() + '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="paWrapper">' +
                            '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + $("#mlsstreetnum").val() + '</div>' +
                            '<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + $("#mlscity").val() + ' AZ ' + $("#mlszipcode").val() + '</div>' +
                            '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + '' + '</div>' +
                        '</div>' +
                         '<ul class="propFeat">' +
                            '<li><span class="fa fa-moon-o"></span> ' + $("#mlsbedroom").html() + '</li>' +
                            '<li><span class="icon-drop"></span> ' + $("#mlsbathroom").html() + '</li>' +
                            '<li><span class="icon-frame"></span> ' + $("#mlsappsft").html() + '</li>' +
                        '</ul>' +   
                        '<div class="clearfix"></div>' +
                        '<div class="infoButtons">' +
                            '<a class="btn btn-sm btn-round btn-gray btn-o closeInfo">Close</a>' +
                            '<a href="#" target="_blank" class="btn btn-sm btn-round btn-green viewInfo">View</a>' +
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
                })(marker, 1));
                //on click map add event to zoom it
                google.maps.event.addListener(properties.map, "click", function (event) {
                    properties.infobox.open(null, null);
                    properties.map.fitBounds(properties.bounds);
                    properties.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
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
        processOffer: function(){
            var self = $(this);
            var id   = self.attr('data-rel-id');
            var prop = properties;
            var url  = prop.cntUrl+prop.sendOffer+"/"+id;
            $.ajax({
                url: url,
                success: function(response){
                    console.log(response);
                }
            });
        },        
    };
}($));
$(window).load(function() {
   //properties.init(properties.datatable); 
   emailComposer.__proto__ = properties;
   emailComposer.start();
});


