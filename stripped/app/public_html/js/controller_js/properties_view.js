var properties = (function($){
    return {
        cntUrl: window.location.origin+"/properties",
        listNotes: window.location.origin+"/property_notes/api_index",
        addNote: window.location.origin+"/property_notes/api_add",
        deleteNote: window.location.origin+"/property_notes/api_delete",
        listTask: window.location.origin+"/property_tasks/api_list_task",
        addTask: window.location.origin+"/property_tasks/api_add_task",
        addOneTask: window.location.origin+"/property_tasks/api_add_one_task",
        chTaskStatus: window.location.origin+"/property_tasks/api_change_status",
        listContact: window.location.origin+"/property_contacts/api_list_contact",
        addContUrl: window.location.origin+"/property_contacts/api_add_contact", 
        attachContUrl: window.location.origin+"/property_contacts/api_attach_contact",
        changeRoleC: window.location.origin+"/property_contacts/api_change_role",
        rmPropContact: window.location.origin+"/property_contacts/api_remove_contact",
        sendOffer: window.location.origin+"/api_send_offer",
        getComps: window.location.origin+"/comps/get_comps",
        getEstValue: window.location.origin+"/comps/api_get_est_value",
        deleteComps: window.location.origin+"/comps/delete",
        getEmails: window.location.origin+"/property-emails",
        makeAsRead: window.location.origin+"/mark-as-read",
        createFolders: window.location.origin+"/create-property-folders",
        mapOptions: {zoom: 16},
        map: null,
        bounds: null,
        init: function(callback) {
            properties.__proto__ = Pankaj;
            properties.initialize();  
            properties.id = $('#property_id').val();
            console.log(properties.id);
            
            $('#showOfferCalculator').on('click',function(){
                var est_value = $('#est_value').val().replace(/[^0-9.]/g,'');
                var est_repairs = $('#est_repairs').val().replace(/[^0-9.]/g,'');
                var asis = est_value - est_repairs;
                var out;
                for(var i=75;i<=85;i++){
                    var amt = asis * (i/100);
                    
                    var str = i + '% $' + amt.toLocaleString() + '<br>';
                    $('#hvaOfferTable').append(str);
                }
                $('#hvaCalc').modal('show');
                
            });
            properties.zest();
            $('#getMaricopaTaxes').on('click',function(e){
                
                $('.taxspinner').removeClass('hidden');
                
                var id = properties.id;
                var apn = $('#apn').val();
                
                $.ajax({
                    type: 'post',
                    url: '/properties/apiMaricopaTaxes',
                    data: {id:id,apn:apn},
                    success: function(response){
                        //console.log(response);
                        //var obj = JSON.parse(response);
                        //console.log(obj);
                        window.location.reload();
                    }
                });
                
                
                e.preventDefault();
            });
            
            
            properties.cshFoldersExist();
            $('#csh_folder_button').on('click',function(e){
                
                properties.createCshFolders();
                $('#csh_folder_button').addClass('hidden');
                
                e.preventDefault();
            });
            
            $('#showLogModal').on('click',function(e){
                var id = properties.id;
                $.ajax({
                    type: 'post',
                    url: '/properties/apiGetPropertyLog',
                    data: {id:id},
                    success: function(response){
                        $('#logOutput').html(response);
                        $("#showLog").modal("show");
                    }
                });
                e.preventDefault();
            });
            
            $('.titleSelect').click(function(e){
                var title = $(this).text();
                var title_id = $(this).attr('data-rel-id');
                properties.selectTitle(title,title_id);
                e.preventDefault();
            });
            //this.drawMap();
            //this.fetch_comparables();//drawMap is called within this. comps are passed to drawMap
            //add splitter
            //this.activateSplitter($("#split-bar"), $("#leftWrapperDiv"), $("#content"));
            //$("#showImages").click(this.toggleMapImage);
            //this.listpropTask();
            $(".changestatus").click(this.createTask);
            $(document).on('click', '.taskstatus', this.changeTaskStatus);
//            this.listContacts();
            $("a.addpropertyContact").on('click',function() {
                var form  = $("#PropertyContactAddNewContact");
                form.find('#PropertyContactName').val('');
                form.find('#PropertyContactEmail').val('');
                form.find('#PropertyContactPhone').val('');
                form.find('#PropertyContactId').val('');
                form.find('#PropertyContactCompanyName').val('');
                $("#add_prop_contact").modal("show");
            });
            $("#PropertyContactViewForm, #PropertyContactAddNewContact").submit(this.addContact);
            $(document).on('change', 'select.roleselect', this.changeRole);
            $(document).on('click', 'a.removepropcontact', this.removePropContact);
            $(document).on('click', 'a.editpropcontact', this.editPropContact);
            $("a[href='#users']").click(function() {
                $("#forchangeinwidth").attr('style', 'margin-top: 150px;width: auto;');
            });
            $("a[href='#properties']").click(function() {
                $("#forchangeinwidth").attr('style', 'margin-top:150px;');
            });
            $("a.attchcontact").click(this.attachContactToProperty);
            $("#existcontacttable").dataTable();
            $(document).on('click', '#send_offer', this.processOffer);
            
            //add task form
            $("#addpropertyTask").click(this.openTaskPopup);
            $("#PropertyTaskViewForm").submit(this.createNewTask.bind(this));
            
            //notes
            this.listPropNotes();
            $("#addNewNoteNow").click(this.addNewNote.bind(this));
            $(document).on("click", ".removeThisNoteNow", this.removeOneNote.bind(this));
            
            //for custom table in map area
            $("div.mytabview div").click(this.hideshowContent);
            //load comps
            $("#reload_comps").click(this.reload_comps);
            //load emails of porpety
            //this.loadEmails();
            //remove email
            var self = this;
            $(document).on('click', 'a.removethisemailcommu', function(e) {
                e.preventDefault();
                var link = $(this).attr("href");
                self.httpAPI(link, "GET", {}, "json", function(data) {
                    if( data.status == "success" ) {
                        self.loadEmails();
                    }
                    alert(data.message);
                });
           });
            $("a#refreshMailList").click(this.loadEmails.bind(this));
           
            $(document).on("click", "a.headerofemailsubject", this.makeEmailAsRead.bind(this));
            this.leftContentSelect();
            $('.delete_property').bind('click',function(){
                var id = $(this).attr('data-rel-id');
                var source = $(this).attr('data-rel-type');
                
                $.ajax({
                    type: 'post',
                    url: '/properties/apiDeleteProperty',
                    data: {id:id,source:source},
                    success: function(response){
//                        if(response == 'Record Deleted'){
//                            
//                        }
                    }
                });
                
                setTimeout(function(){
                    window.location.href = '/properties/search';
                },500);
            });
            setTimeout(function(){
                $('.fa').on('click',function(){
//alert(1);
//                    var mls_data_id = $('#property_id').val();                   
//                    var sqft = $('#sqft').val();                   
//                    var id = $(this).attr('id');//mls_data.id of the comp clicked
//                    console.log('--------: ' + id);
//                    $(this).toggleClass('fa-heart , fa-heart-o');
//                    var like = 0;
//                    if($(this).hasClass('fa-heart')){
//                        like = 1;
//                    }
//                    //console.log(like);
//                    $.ajax({
//                        type: 'post',
//                        url: '/comps/like',
//                        data: {id:id,like:like,mls_data_id:mls_data_id,sqft:sqft},
//                        success: function(response){
//                            $('#estValue').html(response);
//                        }
//                    });
                });
                
                $(document).on('click', '.viewComp', function(){
                    var primaryId = $(this).attr('primaryKey');
                    var modelName = $(this).attr("modelId");
                    var title = $(this).text();
                    //modal-title
                    //modal-body
                    var url = properties.cntUrl + "/comp_view/"+modelName+"/"+primaryId; 
                    properties.httpAPI(url, "GET", {}, "html", function(resp) {
                        $("#viewComp").find(".modal-title").html(title);
                        $("#viewComp").find(".modal-body").html(resp);
                        $("#viewComp").modal("show");
                    });            
                });
                
            },1000);
            //on page load get est value
            //this.getEstimatedValue();
            
            
            $(document).on("click", "a.fav-ad-rm-ic", function() {
                var comp_id = $(this).attr("id");
                var anchorDOM = $(this);
                //fa-heart-o=> blank fa-heart=>field
                var makeFav = 1;
                if( $(this).find("span").hasClass("fa-heart") ) {
                    //already fav
                    makeFav = 0;
                    var comment = prompt("Please add comment for making un-favorite");
                    
                    if( $.trim(comment) == "" ) {
                        alert("Comment is required.");
                        return true;
                    }
                    makeFav = makeFav + "/" + comment;
                }
                var url = properties.cntUrl + "/comp_fav/"+comp_id+"/"+makeFav; 
                properties.httpAPI(url, "GET", {}, "json", function(resp) {
                    if( makeFav == 1 ) {
                        anchorDOM.find("span").removeClass("fa-heart-o").addClass("fa-heart");
                    } else {
                        anchorDOM.find("span").removeClass("fa-heart").addClass("fa-heart-o");
                    }
                    alert(resp.message);
                });            
            });
            
            $("div.maptag").html('<ul>'+
                                    '<li>'+
                                        '<a href="#" class="mapHandler"><span class="icon-map"></span></a>'+
                                        '<ul>'+
                                            '<li>Map</li>'+
                                            '<li>Images</li>'+
                                            //'<li>Email</li>'+
                                            '<li>Documents</li>'+
                                            '<li>Sale</li>'+
                                            '<li>Details</li>'+
                                        '</ul>'+
                                    '</li>'+
                                '</ul>');
            
            //event handle for mobile togger
            $("div.maptag ul li ul li").click(function() {
                var selectedContent = $.trim($(this).html());
                //console.log(selectedContent);
                if( selectedContent == "Details" ) {
                    $("#leftWrapperDiv").addClass("hidden");
                    $("#content").removeClass("hidden").width('100%');
                } else {
                    $("button[name="+selectedContent+"]").click();
                    $("#leftWrapperDiv").removeClass("hidden").width('100%');
                    $("#content").addClass("hidden");
                    if(selectedContent == "Map"){
                        properties.drawMap();
                    }
                    if(selectedContent == "Sale"){
                        
                        
                        
                        
                        
                       tinyMCE.init({
                            selector: "#marketing_comment",
                            theme: "modern",
                            menubar: "tools",
                            plugins: [
                                "preview fullscreen paste textcolor link"
                            ],
                            fontsize_formats: "9pt 12pt 16pt 20pt",
                            toolbar: "undo redo | bold italic underline | forecolor backcolor fontsizeselect | link | preview | templates ",
                            forced_root_block : "",
                            browser_spellcheck : true
                        });
                        
                        $('.eblast').click(function(e){
                            var data = $(this).attr('data-rel');
                            //console.log(data);
                            $.ajax({
                                type: 'post',
                                url: '/marketing/eblast',
                                data: {data:data},
                                success: function(response){
            //                        console.log(response);
                                    window.location.reload();
                                }
                            });
                            //e.preventDefault();
                        });
                        $('.send_all').click(function(e){

                            var data = $(this).attr('data-rel');
                            
                            $.ajax({
                                type: 'post',
                                url: '/marketing/ajax_eblast_job_create',
                                data: {data:data},//id-market 
                                success: function(response){
                                    //console.log(response);
                                    window.location.reload();
                                }
                            });

                            e.preventDefault();
                        });
                        //properties.updateZestimate();

                        $('#marketing_comment_updated').hide();
                        $('#marketing_comment_submit').on('click',function(e){

                            var id   = $('#id').val();
                            var data = tinyMCE.get('marketing_comment').getContent();

                            $.ajax({
                                type: 'post',
                                url: '/properties/apiMarketingComment',
                                data: {id:id,marketing_comment:data},
                                success: function(response){
                                    console.log(response);
                                    $("#marketing_comment_updated").show().delay(2000).fadeOut('slow');
                                }
                            });

                            e.preventDefault();
                        });
                        
                        
                        
                        
                        
                        
                        
                    }
                }
                selectedContent = null;
            });
            $("button#createFoldersNow").click(this.createFoldersNow.bind(this));
            
//            $('#csh_id').on('change',function(){
//                var value = $( this ).val();
//                var id    = $('#property_id').val();
//                $.ajax({
//                    type: 'post',
//                    url: '/properties/apiChangeColonyId',
//                    data: {csh_id:value,id:id},
//                    success: function(response){
//                        console.log(response);
//                    }
//                });
//            });
            
            $('.calculator').on('change',function(){
                var value = $( this ).val();
                var field = $( this ).attr('id');
                var id    = $('#property_id').val();//this is the mls_data.id  property.mls_data_id
                $.ajax({
                    url: '/properties/jqxhr_calculator',
                    data: {id:id,field:field,value:value},
                    success: function(response){
                        
                        $('#' + field).val(response);
                        
                        
                        var as_is = $('#est_value').val().replace(/[^0-9.]/g,'') - $('#est_repairs').val().replace(/[^0-9.]/g,'');
                        $('#as_is').val('$' + as_is.toLocaleString());

                        if(field == 'purchase_amt'){
                            Pankaj.logit(properties.id,'Offer Amount', response);
                        }
                        if(field == 'est_value'){
                            Pankaj.logit(properties.id,'ARV',response);
                        }
                        if(field == 'est_repairs'){
                            Pankaj.logit(properties.id,'Estimated Repairs',response);
                        }
                        if(field == 'est_rent'){
                            Pankaj.logit(properties.id,'Estimated Rent',response);
                        }
                        if(field == 'counter'){
                            Pankaj.logit(properties.id,'Counter',response);
                        }
                        if(field == 'csh_repairs'){
                            
                            var est_repairs = $('#est_repairs').val().replace(/[^0-9.]/g,'');
                            var csh_repairs = $('#csh_repairs').val().replace(/[^0-9.]/g,'');
                            
                            est_repairs = parseInt(est_repairs);
                            csh_repairs = parseInt(csh_repairs);
                            if(csh_repairs > 10000){
                                csh_repairs = csh_repairs * 1.1;
                            }else{
                                csh_repairs = csh_repairs + 1000;
                            }
                            
                            
                            
                            if(csh_repairs > est_repairs){
                                var strconfirm = confirm("Do you want to send Matt an 'UNDERBID' Message?");
                                if (strconfirm == true) {
                                    $.ajax({
                                        type: 'post',
                                        url: '/properties/apiCrmAlert',
                                        data: {property_id:properties.id,receiver:4,message:'Property was Underbid. Click Here.'},
                                        success: function(response){
                                            //console.log(response);
                                        }
                                    });
                                }
                            }
                            
//                            Pankaj.logit(properties.id,'Counter',response);
                        }

                        if(Pankaj.inArray(field,['est_rent','purchase_amt','est_repairs','counter','est_value','csh_repairs'])){
                            
                            properties.update_yield();
                        }
                        


                    }
                });
            }); 
            
            $(".show_tip").on({
                mouseenter: function () {
                    $('.action').toggleClass('hidden');
                    var as_is = $('#est_value').val().replace(/[^0-9.]/g,'') - $('#est_repairs').val().replace(/[^0-9.]/g,'')

                    for(var i = 75;i<=85;i++){
                        $('#calculator_tip').append(i + '% $' + (i * as_is / 100).toLocaleString() + '<br>');
                    }
                    
                },
                mouseleave: function () {
                    $('.action').toggleClass('hidden');
                    $('#calculator_tip').html('');
                }
            });
            
            properties.update_yield();
            
            properties.getMyTags();
            
            $('#est_rent').on('blur',function(){
                properties.calcYield();
            });
            
            //prop.ih();
            $('#getCshId').on('click',function(e){
                $('#csh_id_button').hide();
                //button was clicked....
                //send property_id to controller.
                //insert row into csh_id table
                //get last insert
                //update property record to contain new colony id.
                $.ajax({
                    type: 'post',
                    url: '/properties/apiChangeColonyId',
                    data: {property_id:properties.id},
                    success: function(response){
                        //console.log(response);
                        $('#csh_id').val(response);
                        
                    }
                });
                
                e.preventDefault();
            });
            
            
            $('.override').on('click',function(e){
                $('#override_modal').modal('show')
                
                e.preventDefault();
            });
            $('.hoa_freq').on('click',function(e){
                //console.log($(this).text());
                $('#hoa_paid_override').val($(this).text());
                e.preventDefault();
            });
            
            $('.gs').on('click',function(e){
                
                
                properties.gs();
                
                e.preventDefault();
            });
                
            
        },
        gs: function(){
            
            var id        = properties.id;
            var latitude  = $("#lat").val();
            var longitude = $("#lng").val();
            
            var listing_id = $('#listing_id').val();
            
            $.ajax({
                type: 'post',
                url: '/properties/apiUpdateGreatSchools',
                data: {id:id,listing_id:listing_id,latitude:latitude,longitude:longitude},
                success: function(response){
                    //console.log(response);
                    properties.__proto__.logit(id,'School Score Updated',response);
                    window.location.reload();
                }
            });
            
            
        },
        calcYield: function(){
            
            
            var est_rent     = parseInt($('#est_rent').val().replace(/[^0-9.]/g,''));
            var purchase_amt = parseInt($('#purchase_amt').val().replace(/[^0-9.]/g,''));//offer
            var est_repairs  = parseInt($('#est_repairs').val().replace(/[^0-9.]/g,''));
            var est_value    = parseInt($('#est_value').val().replace(/[^0-9.]/g,''));
            est_rent     = est_rent > 0 ? est_rent : 0;
            purchase_amt = purchase_amt > 0 ? purchase_amt : 0;
            est_repairs  = est_repairs > 0 ? est_repairs : 0;
            est_value    = est_value > 0 ? est_value : 0;
            
            var year         = parseInt($('#year').val().replace(/[^0-9.]/g,''));
            var hoa_xfer     = parseInt($('#hoa_xfer').val().replace(/[^0-9.]/g,''));
            hoa_xfer = hoa_xfer > 0 ? hoa_xfer : 0;
            var hoa_fee      = parseInt($('#hoa_fee').val().replace(/[^0-9.]/g,''));
            hoa_fee = hoa_fee > 0 ? hoa_fee : 0;
            var hoa_paid     = $('#hoa_paid').val();
            var sqft         = parseInt($('#sqft').val());
            var taxes        = parseInt($('#taxes').val());
            taxes = taxes > 0 ? taxes : 0;
            var apn          = $('#apn').val();
            var poolstring   = $('#pool').val();
            var pool = '0';
            var allpools = ['Pool - Private','Diving Pool','Play Pool','Fenced Pool','Lap Pool','Diving'];
            $.each(allpools,function(i,v){
                if(poolstring.indexOf(v) > -1){
                    pool = 1;
                }
            });
            
            //Income y1
            var y1_gar = est_rent * 9;
            var y1_vac = y1_gar * -.045;
            var y1_credit_loss = y1_gar * -.02;
            var y1_egi = y1_gar + y1_vac + y1_credit_loss;
            
            //Income y2
            var y2_gar = est_rent * 12 * 1.058;
            var y2_vac = y2_gar * -.045;
            var y2_credit_loss = y2_gar * -.02;
            var y2_egi = y2_gar + y2_vac + y2_credit_loss;
            
            //expenses y1
            var y1_pm = y1_egi * .055;
            var y1_leaseup = est_rent * .75 / 3;
            var y1_mntc = 600;
            var y1_taxes = taxes;
            var y1_ins = (sqft * .04) + 85;//TODO
            var hoa_mult;
            
            switch(hoa_paid) {
                case 'Quarterly':
                    hoa_mult = 4;
                    break;
                case 'Monthly':
                    hoa_mult = 12;
                    break;
                case 'Semi-Annually':
                    hoa_mult = 2;
                    break;
                case 'Semi-Annual':
                    hoa_mult = 2;
                    break;
                case 'Annually':
                    hoa_mult = 1;
                    break;
                default:
                    hoa_mult = 0;
            }
            //console.log(hoa_paid);
            //console.log(hoa_mult);
            var y1_hoa = hoa_fee * hoa_mult;
            var y1_turnover = est_rent * 1.5 / 3;
            var y1_landscape = 120;
            var y1_pool = pool == 1 ? 22*12 : 0;
            
            //expenses y2
            var y2_pm        = y2_egi * .055;
            var y2_leaseup   = y1_leaseup * 1.02;
            var y2_mntc      = y1_mntc * 1.02;
            
            var y2_taxes     = y1_taxes * 1.02;
            
            var y2_ins       = y1_ins * 1.02;//TODO
           
            var y2_hoa       = y1_hoa * 1.02;
            var y2_turnover  = y1_turnover * 1.02;
            var y2_landscape = y1_landscape * 1.02;
            var y2_pool      = y1_pool * 1.02;
            
            var y2_total_expenses = parseFloat(y2_pm) +  y2_leaseup + y2_mntc + y2_taxes + y2_ins + y2_hoa + y2_turnover + y2_landscape + y2_pool;
            
            var noi_pre_cap_ex = y2_egi - y2_total_expenses;  
            
            var reserve;
            
            switch(true){
                case year < 1975:
                    reserve = .06;
                    break;
                case year < 1995:
                    reserve = .05;
                    break;
                case year < 2011:
                    reserve = .04;
                    break;
                case year < 16:
                    reserve = .03;
                    break;
                default:
                    reserve = .02;
                    break;  
            }
            
            
            
            var cap_ex_reserve = y2_egi * reserve;
            
            var noi_post_cap_ex = noi_pre_cap_ex - cap_ex_reserve;
            
            
            //var basis = (purchase_amt * 1.005) + est_repairs + (est_rent + .75) + hoa_xfer;
            
            //var net = noi_post_cap_ex / basis;
            
                
                if(
                    est_value    > 0 &&
                    est_repairs  > 0 &&
                    est_rent     > 0 &&
                    purchase_amt == 0

                ){
                    var noi = noi_post_cap_ex;
                    
                    var gross = parseFloat(noi / .05);
                    
                    var basis =  parseInt(est_repairs) + parseFloat(gross * .005) + parseInt(est_rent * .75) + hoa_xfer;
                    
                    var MaxOffer = (gross - basis).toFixed(0);
                    $('#purchase_amt').val(MaxOffer); 
                }
        },
        getDeedInfo: function(){
            
            var apn    = $('#apn').val();
            var county = $('#county').val();
            var state  = $('#state').val();
            
            $.ajax({
                type: 'post',
                url: '/properties/apiGetDeedInfo',
                data: {apn:apn,county:county,state:state},
                success: function(response){
                    
                    if(response.length > 0){
                        //found one
                        
                    }else{
                        //not found
                    }
                    
                }
            });
            
            
            
        },        
        zest: function(){
            
            var address      = $('#address').val();
            var citystatezip = $('#citystatezip').val();
            var listing_id = $('#listing_id').val();
            
            var z = $('#zestimate').html();
            var r = $('#rentzestimate').html();
            
            var lat = $('#lat').val();
            var lon = $('#lng').val();
            
            
            if(z == 'Waiting for Zillow' || r == 'Waiting for Zillow' || lat.length == 0 || lon.length == 0){
            
            console.log('running zillow');
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/properties/zproxy',
                data: {address:address,citystatezip:citystatezip,property_id:properties.id,listing_id:listing_id},
                success: function(response){
                    //console.log(response);
                    //console.log(response.latitude);
                    //console.log(response.longitude);
                    //console.log(response.rentzestimate);
                    $('#zestimate').html('Zestimate: $' + parseInt(response.zestimate).toLocaleString());
                    $('#rentzestimate').html('RentZestimate: $' + parseInt(response.rentzestimate).toLocaleString());
                    $('#lat').html(response.latitude);
                    $('#lng').html(response.longitude);
                    
                }
            });
        }
            
        },
        buttonToggle: function(btn){
            
            var isSelected = $(btn).hasClass('btn-default');
            
            $(btn).toggleClass('btn-default btn-blue');
            var pidtid = $(btn).attr('data-rel-id').split('-');
            var pid = pidtid[0];
            var tid = pidtid[1];
            
            
            $.ajax({
                type: 'post',
                url: '/tags/apiAddRemove',
                data: {pid:pid,tid:tid,isSelected:isSelected},
                success: function(response){
                    //console.log(response);
                }
            });
        },
        getMyTags: function(){
            
            $.ajax({
                type: 'post',
                url: '/tags/apiFetchPropertyTags',
                data: {id:properties.id},
                success: function(response){
                    //console.log(response);
                    $('#tags').html(response);
                    $('#tags').append('<br><a href="/tags/index">TagManager</a>');
                }
            });
            
            
            
        },
        update_yield: function(){
            
            var est_rent     = parseInt($('#est_rent').val().replace(/[^0-9.]/g,''));
            var purchase_amt = parseInt($('#purchase_amt').val().replace(/[^0-9.]/g,''));//offer
            var est_repairs  = parseInt($('#est_repairs').val().replace(/[^0-9.]/g,''));
            var est_value    = parseInt($('#est_value').val().replace(/[^0-9.]/g,''));
            var csh_repairs  = parseInt($('#csh_repairs').val().replace(/[^0-9.]/g,''));
            var counter      = $('#counter').val().replace(/[^0-9.]/g,'');
            
            est_rent     = est_rent > 0 ? est_rent : 0;
            purchase_amt = purchase_amt > 0 ? purchase_amt : 0;
            est_repairs  = est_repairs > 0 ? est_repairs : 0;
            csh_repairs  = csh_repairs > 0 ? csh_repairs : 0;
            est_value    = est_value > 0 ? est_value : 0;
            counter      = counter > 0 ? counter : 0;
            
            if(counter > 0){
                purchase_amt = counter;
            }
            
            if(csh_repairs > 0){
                est_repairs = csh_repairs;
            }

            if(
                    est_rent     > 0 &&
                    purchase_amt > 0 &&
                    est_repairs  > 0 &&
                    est_value  > 0

            ){
                
                
                var year         = parseInt($('#year').val().replace(/[^0-9.]/g,''));
                var hoa_xfer     = parseInt($('#hoa_xfer').val().replace(/[^0-9.]/g,''));
                hoa_xfer = hoa_xfer > 0 ? hoa_xfer : 0;
                var hoa_fee      = $('#hoa_fee').val().replace(/[^0-9.]/g,'');
                hoa_fee = hoa_fee > 0 ? hoa_fee : 0;
                var hoa_paid     = $('#hoa_paid').val();
                var sqft         = parseInt($('#sqft').val());
                var taxes_assessed        = parseFloat($('#taxes_assessed').val());
                var taxes_credit        = parseFloat($('#taxes_credit').val());
                var taxes        = parseFloat($('#taxes').val());
                taxes = taxes > 0 ? taxes : 0;
                var apn          = $('#apn').val();
                var poolstring   = $('#pool').val();
                var pool = '0';
                var allpools = ['Pool - Private','Diving Pool','Play Pool','Fenced Pool','Lap Pool','Diving'];
                $.each(allpools,function(i,v){
                    if(poolstring.indexOf(v) > -1){
                        pool = 1;
                    }
                });
                
                //Income y1
                var y1_gar = est_rent * 9;
                var y1_vac = y1_gar * -.045;
                var y1_credit_loss = y1_gar * -.02;
                var y1_egi = y1_gar + y1_vac + y1_credit_loss;
                
                //Income y2
                var y2_gar = est_rent * 12 * 1.058;
                var y2_vac = y2_gar * -.045;
                var y2_credit_loss = y2_gar * -.02;
                var y2_egi = y2_gar + y2_vac + y2_credit_loss;
                
                //expenses y1
                var y1_pm = y1_egi * .055;
                var y1_leaseup = est_rent * .75 / 3;
                var y1_mntc = 600;
                var y1_taxes = taxes;
                var y1_ins = (sqft * .04) + 85;
                var hoa_mult;
                
                switch(hoa_paid) {
                    case 'Quarterly':
                        hoa_mult = 4;
                        break;
                    case 'Monthly':
                        hoa_mult = 12;
                        break;
                    case 'Semi-Annually':
                        hoa_mult = 2;
                        break;
                    case 'Semi-Annual':
                        hoa_mult = 2;
                        break;
                    case 'Annually':
                        hoa_mult = 1;
                        break;
                    default:
                        hoa_mult = 0;
                }
                
                var y1_hoa = hoa_fee * hoa_mult;
                var y1_turnover = est_rent * 1.5 / 3;
                var y1_landscape = 120;
                var y1_pool = pool == 1 ? 22*12 : 0;
                
                
                
                
                //expenses y2
                var y2_pm        = y2_egi * .055;
                var y2_leaseup   = y1_leaseup * 1.02;
                var y2_mntc      = y1_mntc * 1.02;

                var y2_taxes     = y1_taxes * 1.02;

                var y2_ins       = y1_ins * 1.02;//TODO

                var y2_hoa       = y1_hoa * 1.02;
                var y2_turnover  = y1_turnover * 1.02;
                var y2_landscape = y1_landscape * 1.02;
                var y2_pool      = y1_pool * 1.02;

                var y2_total_expenses = parseFloat(y2_pm) +  y2_leaseup + y2_mntc + y2_taxes + y2_ins + y2_hoa + y2_turnover + y2_landscape + y2_pool;
                
                
                
                var noi_pre_cap_ex = y2_egi - y2_total_expenses;  
                
                var reserve;
                switch(true){
                    case year < 1975:
                        reserve = .06;
                        break;
                    case year < 1995:
                        reserve = .05;
                        break;
                    case year < 2011:
                        reserve = .04;
                        break;
                    case year < 2016:
                        reserve = .03;
                        break;
                    default:
                        reserve = .02;
                        break;  
                }
                
                var cap_ex_reserve  = y2_egi * reserve;
                var noi_post_cap_ex = noi_pre_cap_ex - cap_ex_reserve;
                var noi             = noi_post_cap_ex;  //est_rent * 1.058 * 12 * .925 * .62;
                var basis           = parseFloat(purchase_amt * 1.005) + parseInt(est_repairs) + parseFloat(est_rent * .75) + hoa_xfer;
                var netYield        = noi / basis;
                var net             = (netYield * 100).toFixed(2);
                
                if(net >= 5){
                    $('#netYield').html('NetCap: ' + net + '%  <a href="#yieldlog" data-toggle="modal"><span class="fa fa-check-square" style="color: green"></span></a>');
                }else{
                    $('#netYield').html('NetCap: ' + net + '%  <a href="#yieldlog" data-toggle="modal"><span class="fa fa-warning" style="color: red"></span></a>');
                }
                
                $('#netPreYield').html('PreCapEx: ' + (noi_pre_cap_ex / basis).toFixed(4) * 100 + '%');

                basis = Math.round(basis);
                
                //log('*******Begin Yield Calculations*******');
                //log(' ');
                log('--INPUTS--');
                
                
                log('Est Rent: ' + est_rent);
                log('Purchase Amt: ' + purchase_amt);
                log('Counter Offer (overrides Purchase Amt): ' + counter);
                log('Est Repairs: ' + est_repairs);
                log('CSH Repairs (overrides Est Repairs): ' + csh_repairs);
                log('Est Value: ' + est_value);
                log('Year: ' + year);
                log('HOA Txfr: ' + hoa_xfer);
                log('HOA Fee: ' + hoa_fee);
                log('HOA Paid: ' + hoa_paid);
                log('SqFt: ' + sqft);
                log('Taxes_assessed: ' + taxes_assessed.toFixed(2));
                log('Taxes_credit: ' + taxes_credit.toFixed(2));
                log('Taxes: ' + taxes.toFixed(2));
                log('Pool: ' + pool);
                log(' ');
                
                log('--YR1 INCOME--');
                log('y1_gar (est_rent * 9): ' + y1_gar);
                log('y1_vac (y1_gar * -.045): ' + y1_vac);
                log('y1_credit_loss (y1_gar * -.02): ' + y1_credit_loss);
                log('y1_egi (y1_gar + y1_vac + y1_credit_loss): ' + y1_egi.toFixed(2));
                log(' ');
                
                log('--YR2 INCOME--');
                log('y2_gar (est_rent * 12 * 1.058): ' + y2_gar.toFixed(2));
                log('y2_vac (y2_gar * -.045): ' + y2_vac.toFixed(2));
                log('y2_credit_loss (y2_gar * -.02): ' + y2_credit_loss.toFixed(2));
                log('y2_egi (y2_gar + y2_vac + y2_credit_loss): ' + y2_egi.toFixed(2));
                log(' ');
                
                log('--YR1 EXPENSES--');
                log('y1_pm (y1_egi * .055): ' + y1_pm.toFixed(2));
                log('y1_leaseup (est_rent * .75 / 3): ' + y1_leaseup.toFixed(2));
                log('y1_mntc (600 fixed):' + y1_mntc);
                log('y1_taxes (taxes): ' + y1_taxes);
                log('y1_ins ((sqft * .04) + 85): ' + y1_ins.toFixed(2));
                log('hoa_mult (switch statement from hoa_paid): ' + hoa_mult);
                log('y1_hoa (hoa_fee * hoa_mult): ' + y1_hoa);
                log('y1_turnover (est_rent * 1.5 / 3): ' + y1_turnover.toFixed(2));
                log('y1_landscape (120 fixed): ' + y1_landscape);
                log('y1_pool (if pool 12 X 22): ' + y1_pool);
                log(' ');
                
                log('--YR2 EXPENSES--');
                log('y2_pm (y2_egi * .055): ' + y2_pm.toFixed(2));
                log('y2_leaseup (y1_leaseup * 1.02): ' + y2_leaseup.toFixed(2));
                log('y2_mntc (y1_mntc * 1.02): ' + y2_mntc.toFixed(2));
                log('y2_taxes (y1_taxes * 1.02): ' + y2_taxes.toFixed(2));
                log('y2_ins (y1_ins * 1.02):' + y2_ins.toFixed(2));
                log('y2_hoa (y1_hoa * 1.02): ' + y2_hoa.toFixed(2));
                log('y2_turnover (y1_turnover * 1.02): ' + y2_turnover.toFixed(2));
                log('y2_landscape (y1_landscape * 1.02): ' + y2_landscape.toFixed(2));
                log('y2_pool (y1_pool * 1.02):' + y2_pool.toFixed(2));
                log('y2_total_expenses (y2_pm +  y2_leaseup + y2_mntc + y2_taxes + y2_ins + y2_hoa + y2_turnover + y2_landscape + y2_pool): ' + y2_total_expenses.toFixed(2));
                
                log(' ');
                log('--CALCULATIONS--');
                log('noi_pre_cap_ex (y2_egi - y2_total_expenses): ' + noi_pre_cap_ex.toFixed(2));
                log('reserve (switch statement from year built): ' + reserve.toFixed(2));
                log('cap_ex_reserve (y2_egi * reserve): ' + cap_ex_reserve.toFixed(2));
                log('noi_post_cap_ex (noi_pre_cap_ex - cap_ex_reserve): ' + noi_post_cap_ex.toFixed(2));
                log('noi (noi_post_cap_ex): ' + noi.toFixed(2));
                log('basis (purchase_amt * 1.005 + est_repairs + est_rent * .75 + hoa_xfer): ' + basis.toFixed(0));
                log('netYield (noi / basis):' + netYield.toFixed(4));
                log('rounded net yield ((netYield * 100).toFixed(2)): ' + net);
                log('Pre CapEx Yield: ' + (noi_pre_cap_ex / basis).toFixed(4) );
                log(' ');
                
                
                //log('*******End Yield Calculations*******');
                
                
                //log('*******CSH MODEL INPUTS*******');
                csh('Colony ID: ' + $('#csh_id').val());
                csh('Full Address: ' + $('#csh_address').val());
                csh('City: ' + $('#mlscity').val());
                csh('State: ' + $('#state').val());
                csh('Zip: ' + $('#mlszipcode').val());
                csh('BD: ' + $('#mlsbedroom').text());
                csh('BA: ' + $('#mlsbathroom').text());
                csh('SF: ' + $('#mlsappsft').text());
                csh('Lot SF: ' + $('#mlsapplotsft').text());
                csh('Year Built: ' + $('#mlsyearbuilt').text());
                csh('Asking Price: ' + $('#list_price_raw').text());
                csh('Market Value: ' + $('#est_value_raw').text());
                csh('HOA Related Costs: ' + hoa_xfer);
                csh('Rehab Cost: ' + est_repairs);
                csh('Rent Estimate: ' + est_rent);
                csh('HOA (Mo): ' + Math.round(y1_hoa / 12));
                csh('HOA 2: Check MLS for 2nd HOA');
                csh('Taxes Assessed: ' + taxes_assessed.toFixed(2));
                csh('Taxes Credit: ' + taxes_credit.toFixed(2));
                csh('Taxes Total: ' + taxes.toFixed(2));
                csh('Bid Price: ' + purchase_amt);
                csh('County: ' + $('#county').val());
                csh('# of Stories: ' + $('#stories').text());
                if(parseInt($('#garage').text()) > 0 ){
                    var hasGarage = 'Yes';
                } else{
                    var hasGarage = 'No';
                }
                csh('Garage: ' + hasGarage);
                csh('Garage Spaces: ' + parseInt($('#garage').text()));
                var hasPool = pool == 1 ? 'Yes' : 'No';
                csh('Pool: ' + hasPool);
                csh('Flood Zone: No');
                csh('Last Sale: Monsoon');
                csh('Last Sale Date: Monsoon');
                csh('School Rating: <a href="http://greatschools.org" target="_blank">GreatSchools.org</a>');
                csh('APN: ' + apn);
                
                
                //log('*******!CSH MODEL INPUTS*******');
                
                
                
                
                
                if(est_value >= basis){
                    $('#costBasis').html('Basis: $' + basis.toLocaleString() + ' <span class="fa fa-check-square" style="color: green"></span>');
                }else{
                    $('#costBasis').html('Basis: $' + basis.toLocaleString()  + ' <span class="fa fa-warning" style="color: red"></span>');
                }
            
            }else{
                $('#costBasis').html('Basis: N/A');
                $('#netYield').html('NetCap: N/A');
            }
            
            $.ajax({
                type: 'post',
                url: '/properties/apiCshCapRate',
                data: {id:properties.id,csh_cap_rate:net},
                success: function(response){
                    //console.log(response);
                }
            });
        },
//        updateZestimate: function(){
//            var id = properties.id;
//            return false;
//            $.ajax({
//                async: 'true',
//                dataType: 'json',
//                type: 'post',
//                url: '/properties/updateZestimate',
//                data: {id:id},
//                success: function(response){
//                    
//                    console.log(response);
////                    $.each(response,function(k,v){
////                        console.log(k + ' - ' + v);
////                    });
//                    
//                }
//            });
//        },
        selectTitle: function (title,title_select){
            var title = title;
            var title_select = title_select;
            var id = $('#property_id').val();
            $.ajax({
                url: '/properties/title_select',
                type: 'post',
                async: 'true',
                data: {id:id,title_select:title_select},
                success: function(response){
                    console.log(response);
                    if(response){
                        $('#title').val(title);
                        properties.__proto__.logit(id,'Set Selected Title Company',title);
                    }
                }
            });
        },   
        createFoldersNow: function() {
            this.httpAPI(this.createFolders+"/"+$("#property_id").val(), "GET", {}, "json", function(resp) {
                    $("button#createFoldersNow").fadeOut("slow");
                    alert(resp.message);
            });            
        },
        getEstimatedValue: function(){
            this.httpAPI(this.getEstValue+"/"+$("#property_id").val()+"/"+$('#sqft').val(), "GET", {}, "html", function(value) {
                //console.log(value);
                $('#estValue').html(value);
            });
        },
        leftContentSelect: function(){
            var selector = this.readCookie("tabOfContent")
            if( selector == null  ) {
                selector = $("div.mytabview").find("button.active").text();
            }
            properties.showhideTabAndContent(selector);
            $("div.mytabview").find("button").removeClass("active");
            $("div.mytabview").find("button:contains('"+selector+"')").addClass("active");
        },
        hideshowContent: function() {
            if(!$(this).children('button').hasClass('active')){
                $(this).closest("div.mytabview").find("button.active").removeClass("active");
                $(this).children('button').addClass('active');
                var selector = $.trim($(this).children('button').text());
                //var divvHt = windowHeight - $('#header').height()-1;
                properties.showhideTabAndContent(selector);
                properties.createCookie("tabOfContent", selector, 365, window.location.pathname);
            }
        },
        showhideTabAndContent: function(selector) {
            $('.mapDivSize100').hide();
            var section = selector.toLowerCase();
            
            $("#" + section + "View").show();
            
//            switch(selector) {
//                case "Map":
//                        $("#mapView").show();
//                        break;
//                case "Images":
//                        $("#imagedivv").show();
//                    break;
//                case "Email":
//                        $("#inboxdivv").show();
//                    break;
//                case "Documents": 
//                        $("#documentsdivv").show();
//                    break;
//                case "Sale": 
//                        $("#saledivv").show();
//                    break;
//            }
        },
        removeOneNote: function(e) {
            var object = $(e.currentTarget);
            var del = object.parent('li').text().replace('Remove','');
            
            var id = object.attr("data-id");
            
            var url = this.deleteNote+"/"+id;
            var self = this;
            this.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    self.listPropNotes();
                    $("#notetextbox").val("");
                }
                //console.log('------------ ' + del + ' --------------------');
                
                //console.log(del);
                 properties.__proto__.logit(properties.id,'Delete Note','' + del + '');
                object.parent('li').text('');
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
                 properties.__proto__.logit(properties.id,'New Note',note);
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
                //alert(data.message);
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
                //alert(data.message);
            });
        },
        createTask: function() {
            var self = $(this);
            var id   = self.attr('data-rel-id');
            var status = self.attr('data-rel-status');
            var status_name = $.trim(self.html());
            var changeTarget = self.closest('div').find('span.manage_listing');
            //alert(changeTarget);
            var type = self.attr('data-rel-type');
            var btntxt = self.text();
            var prop = properties;
            
            
            
            var url  = prop.addTask+"/"+id+"/"+type+"/"+status;
            prop.httpAPI(url, "GET", {}, "json", function(data) {
                //console.log(data);
                
                
                if( data.status == 'success' ) {
                    //this function auto adds pre defined tasks
                    //prop.listpropTask();
                    prop.changeStatusOfpropText(changeTarget, type, status_name);
                    if(status_name.indexOf('CSH Buying') == 0){
                        
                        var existingCshId = $('#csh_id').val();
                        if(existingCshId.length == 0){
                        
                            $.ajax({
                                type: 'post',
                                url: '/properties/apiSetContractDate',
                                data: {id:properties.id},
                                success: function(response){
                                    //console.log(response);
                                    $('#contract_date').val(response);
                                }
                            });

                            $.ajax({
                                type: 'post',
                                url: '/properties/apiChangeColonyId',
                                data: {property_id:properties.id},
                                success: function(response){
                                    //console.log(response);
                                    $('#csh_id').val(response);
                                    properties.createCshFolders(response);
                                    properties.__proto__.logit(properties.id,'Contract Date',$('#currentDate').val());    
                                    properties.__proto__.logit(properties.id,'Created CSH ID',response);    
                                }
                            });
                            
                        }
                    }
                } 
//                else if(data.secureCode != undefined || data.secureCode != "fail") {
//                    
//                    prop.changeStatusOfpropText(changeTarget, type, status_name);
//                    
//                }
//                
//                if( data.status == 'error' ) {
//                    //prop.openTaskPopup();//this pops up a task box if there are no tasks defined
//                }
//                
                //alert(data.message);
            });
        },
        cshFoldersExist: function(){
            var csh_id = $('#csh_id').val();
            $.ajax({
                type: 'post',
                url: '/properties/apiCshFoldersExist',
                data: {csh_id:csh_id},
                success: function(response){
                    //console.log(response);
                    if(response == 'nofolder'){
                        $('#csh_folder_button').removeClass('hidden');
                    }
                }
            });
        },
        createCshFolders: function(){
            
            var csh_id = $('#csh_id').val();
            var add1   = $('#csh_address').val();
            var add2   = $('#citystatezip').val();
            
            
            $.ajax({
                type: 'post',
                url: '/properties/apiCreateCshFolders',
                data: {csh_id:csh_id,add1:add1,add2:add2},
                success: function(response){
                    console.log(response);
                }
            });
            
        },
        changeStatusOfpropText: function(target, type, name) {
            var status_text = "";
            if( type == 0 ) {
                status_text = "Purchase Status: "+name;
                properties.__proto__.logit(properties.id,'Set Purchase Status',name);
            } else {
                status_text = "Sale Status: "+name;
                properties.__proto__.logit(properties.id,'Set Sale Status',name);
                if(name == 'Selling' || name == 'Sold'){
                    $('#sale_fields').removeClass('hidden');
                }else{
                    $('#sale_fields').addClass('hidden');
                }
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
//                    properties.map.fitBounds(properties.bounds);
                    properties.map.setZoom(10);
                    properties.map.setCenter(latlng);
                    properties.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                });
                
                
                //this.addComps(comps);
        },
        addComps: function(comps){
            //var model = $('#model').val();
            $.each(comps, function(i,comp) {
                var latlng = new google.maps.LatLng(comp.MlsPhoenix.latitude,comp.MlsPhoenix.longitude);
                var address = comp.MlsPhoenix.address;
                var price = comp.MlsPhoenix.list_price.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                
                var blue_icon  = '/images/marker-blue.png';
                var red_icon   = '/images/marker-red.png';
                var green_icon = '/images/marker-green.png';
                var initial_icon = green_icon;
                if(comp.Comp.like == 1){
                    initial_icon = red_icon;
                    //TODO: set pins to proper status color
                }
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: properties.map,
                    icon: new google.maps.MarkerImage( 
                        initial_icon,
                        null,
                        null,
                        null,
                        new google.maps.Size(32, 32)
                    ),
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    optimized: false
                });
                
                marker.set('id',comp.MlsPhoenix.id);
                properties.bounds.extend(new google.maps.LatLng(comp.MlsPhoenix.latitude,comp.MlsPhoenix.longitude));
                properties.map.fitBounds(properties.bounds);
                
                var infoboxContent = '<div class="infoW">' +
                                    '<div class="propImg">' +
                                        '<div style="background-color: #0d9095;height: 40px"></div>' +
                                        '<div class="propBg">' +
                                            '<div class="propPrice">$' + price + '</div>' +
                                            '<div class="propType" style="color: #505050">Comparable Sale</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="paWrapper">' +
                                        '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + address + '</div>' +
                                        '<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + address + '</div>' +
                                        '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: darkcyan;font-weight: bold">' + '' + '</div>' +
                                    '</div>' +
                                    '<ul class="propFeat">' +
                                        '<li><span class="fa fa-moon-o"></span> ' + '' + '</li>' +
                                        '<li><span class="icon-drop"></span> ' + '' + '</li>' +
                                        '<li><span class="icon-frame"></span> ' + '' + '</li>' +
                                        '<li><span class="fa fa-heart-o" style="color: red;cursor: pointer"></span></li>' + 
                                    '</ul>' +
                                    '<div class="clearfix"></div>' +
                                    '<div class="infoButtons">' +
                                        '<a class="btn btn-sm btn-round btn-gray btn-o closeInfo">Close</a>' +
                                        '<a href="' + '' + '" target="_blank" class="btn btn-sm btn-round btn-green viewInfo">View</a>' +
                                    '</div>' +
                                 '</div>';
                   //open infobox, zoom in, set satellite      
                   google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            properties.infobox.setContent(infoboxContent);
                            properties.infobox.open(properties.map, marker);
                            properties.map.setZoom(19);
                            properties.map.setCenter(latlng);
                            properties.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                        };
                    })(marker, 1));
                    
                    //close infobox
                    google.maps.event.addListener(properties.map, "click", function (event) {
                        properties.infobox.open(null, null);
                        properties.map.fitBounds(properties.bounds);
                        properties.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
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
        fetch_comparables: function(){
            this.httpAPI(this.getComps+"/"+$("#property_id").val(), "GET", {}, "json", function(comps) {
                properties.drawMap(comps);
                
                //console.log(comps);
                
                $.each(comps, function(i,comp) {
                    
                    
                    var address = comp.MlsPhoenix.street_number + ' ' + comp.MlsPhoenix.street_compass + ' ' + comp.MlsPhoenix.street_name + ' ' + comp.MlsPhoenix.street_suffix + ', ' + comp.MlsPhoenix.city + ' ' + comp.MlsPhoenix.zipcode;
                    
                    var list_price   = comp.MlsPhoenix.list_price.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); 
                    
                    var sold_price   = comp.MlsPhoenix.sold_price.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); 
                    var persqft = (comp.MlsPhoenix.sold_price/comp.MlsPhoenix.appx_sqft).toFixed(0);
                    var images  = JSON.parse(comp.MlsPhoenix.images);
                    
                    var heart = 'fa-heart-o';
                    if(comp.Comp.like == 1){
                        heart = 'fa-heart';
                    }
                    
                    
                    var thumb = '/images/house.png';
                    
                    if(images){
                        for(i=0; i<images.length; i++){
                            var thumb = images[0].slice(0,-4)+'.jpg';
                        }
                    }
                    /**
                    * http://cdn.photos.flexmls.com/az/20150709180238408967000000-t.jpg //thumb
                    * http://cdn.photos.flexmls.com/az/20150709180238408967000000.jpg //photo
                    * http://cdn.resize.flexmls.com/az/640x480/true/20150709180238408967000000-o.jpg //good size
                    */
                    
                var out = '<li style="border-bottom: 1px solid #ededed">'; 
                    
//                    out += '<a id="' + comp.MlsPhoenix.id + '" class="viewComp" data-toggle="modal" href="#viewComp">'; 
//                    out += '<div class="image"><img src="'+thumb+'" alt="avatar" height="100"></div>'; 
//                    out += '<div class="info text-nowrap">'; 
//                    out += '<div class="name">' + address + '</div>'; 
//                    out += '<div class="address">' + comp.MlsPhoenix.bedrooms + ' Bed/ ' + comp.MlsPhoenix.bathrooms + ' Bath/ ' + comp.MlsPhoenix.appx_sqft + ' SqFt ...  $' + persqft + '/sqft</div>'; 
//                    out += '<div class="address">' + comp.MlsPhoenix.public_remarks + '</div>'; 
//                    out += '<div class="price text-red">$' + sold_price + ' <span class="badge"> ' + comp.MlsPhoenix.status + '</span></div>'; 
//                    out += '</div>'; 
//                    out += '<div class="liRight">'; 
//                    out += '<span id="' + comp.Comp.id + '" class="fa ' + heart + '"></span>'; 
//                    out += '</div>'; 
//                    out += '<div class="clearfix"></div>';
//                    out += '</a>';
//                    out += '</li>'; 

                       
                    out += '<div class="userWidget-2" style="margin-bottom: 0px; box-shadow: 0 0 0 0">';
                        out += '<div style="width: 120px; height: 80px; border-radius: 3px; float:left; text-align: center; overflow: hidden; margin: 10px" >';
                            out += '<img src="'+ thumb +'" height="90">';
                        out += '</div>';
                        out += '<div class="info text-nowrap" style="margin:0px">';
                            out += '<a primaryKey="'+comp.MlsPhoenix.id+'" modelId="MlsPhoenix" id="' + comp.Comp.id + '" class="viewComp" href="#" style="border: none; margin: 0px; padding: 0px">'; 
                            out += '<div class="name" style="font-size: 16px">' + address + '</div>';
                            out += '</a>';
                            out += '<div class="title">' + comp.MlsPhoenix.bedrooms + ' Bed/ ' + comp.MlsPhoenix.bathrooms + ' Bath/ ' + comp.MlsPhoenix.appx_sqft + ' SqFt ...  $' + persqft + '/sqft</div>';
                            out += '<div class="text-nowrap" style="width: 90%; overflow: hidden">' + comp.MlsPhoenix.public_remarks + '</div>';
                            out += '<div class="price text-red">$' + sold_price + ' <span class="badge"> ' + comp.MlsPhoenix.status + '</span></div>'; 
                    
                    out += '</div>';
                        out += '<div class="ops">';
                            out += '<a href="#" style="border: none" id="'+ comp.Comp.id +'" class="fav-ad-rm-ic"><span class="fa ' + heart + '"></span></a>';
                        out += '</div>';
                        out += '<div class="clearfix"></div>';
                    out += '</div>';










                    
                    $('#comps').append(out);
                });
                
                
            });
        },
        reload_comps: function(){
            var id = $("#property_id").val();
            $.ajax({
                url: '/comps/delete_comps',
                type: 'post',
                data: {id:id},
                success: function(response){
                    window.location.reload();
                }
            });
                
           
        },
        loadEmails: function() {
            var property_id = $("#property_id").val();
            var self = this;
            this.httpAPI(this.getEmails+"/"+property_id, "GET", {}, "json", function(emails) {
                $("#accordion").html("");
                self.forIterator(emails, 
                function(v, i, next) {
                    self.oneCommunicationTemp(v, next);
                }, function() {
                    debug("all done");
                });
            });
        },
        oneCommunicationTemp: function(data, nextCall) {
            var self = this;
            self.isUnread = false;
            self.unreadMailId = null;
            var comment = "";
            self.commedCllabck(data, comment, function(commt) {
                var randStrr = self.randStr();
                var headerLabel = "";
                debug("unread status "+self.isUnread);
                if( self.isUnread == true ) {
                    headerLabel = '<span class="unread">'+data.Email.subject+'('+data.Email.to+')</span>';
                    self.isUnread = false;
                } else {
                    headerLabel = data.Email.subject+'('+data.Email.to+')';
                }
                var template = '<div class="panel panel-default">'+
                                        '<div class="panel-heading">'+
                                            '<h4 class="panel-title">'+
                                                '<a data-toggle="collapse" class="headerofemailsubject" data-e-id="'+self.unreadMailId+'" data-parent="#accordion" href="#'+randStrr+'">'+headerLabel+'</a>'+
                                            '</h4>'+
                                        '</div>'+
                                        '<div id="'+randStrr+'" class="panel-collapse collapse">'+
                                            '<div class="commentsWidget">'
                                                +commt+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';

                $("#accordion").append(template); 
                nextCall();
            });
        },
        commedCllabck: function(data, comment, callback) {
            var self = this;
            var isReply = true;
            if( data.Email.message_id.indexOf("mail.us-acquisitions.com") > 1  ) {
                isReply = false;
            }
            self.unreadMailId = data.Email.id;
            if( self.isUnread != true && data.Email.read == false || data.Email.read == 0 ) {//its unread flag set
                debug(data.Email.read);
                self.isUnread = true;
            }
            comment = comment + self.getCommentHtml(data.Email, isReply, data.Media);
            if( data.children !== undefined && data.children.length > 0 ) {
                self.commentChildren(data.children, comment, function(ccmm) {
                    callback(ccmm);
                });
            } else {
                callback(comment);
            }
        },
        commentChildren: function(childs, comment, callback, start) {
            var self = this;
            var start = start || 0;
            if( start < childs.length ) {
                var data = childs[start];
                var isReply = true;
                if( data.Email.message_id.indexOf("mail.us-acquisitions.com") > 1  ) {
                    isReply = false;
                }
                if( self.isUnread != true && data.Email.read == false || data.Email.read == 0 ) {//its unread flag set
                    debug(data.Email.read);
                    self.isUnread = true;
                }
                
                comment = comment + self.getCommentHtml(data.Email, isReply, data.Media);
                if( data.children !== undefined && data.children.length > 0 ) {
                    self.commentChildren(data.children, comment, function(commetsc) {
                        self.commentChildren(childs, commetsc, callback, (start+1));
                    });
                } else {
                    self.commentChildren(childs, comment, callback, (start+1));
                }
            } else {
                callback(comment);
            }
        },
        getCommentHtml: function(data, reply, media) {
            var property_id = $("#property_id").val();
            var replyUL =   '<ul>'+
                                '<li><a href="'+window.location.origin+'/reply-p-mail/'+data.id+'/'+property_id+'"><span class="icon-action-undo"></span></a></li>'+
                            '</ul>';
            var commentUL = '<ul>'+
                                '<li><a href="'+window.location.origin+'/delete-email/'+data.id+'" class"removethisemailcommu"><span class="fa fa-trash-o"></span></a></li>'+
                            '</ul>';
                    
            var ULL = commentUL;
            var commentClass = "";
            if( reply == true ) {
                ULL = replyUL;
                commentClass = "reply";
            }
            var filesRelated = "";
            if( media.length > 0 ) {
                $.each(media, function(i, v) {
                    var downloadURL = window.location.origin+"/download/"+v.id;
                    filesRelated = filesRelated + '<a target="_blank" href="'+downloadURL+'" class="btn btn-round btn-o btn-blue btn-xs">'+
                                        v.file+
                                        '<span class="icon-arrow-down"></span>'+
                                    '</a>';
                })
            }
            
            var comment =                   '<div class="comment '+commentClass+'">'+
                                                '<div class="commentContent">'+
                                                    '<div class="commentBody">'
                                                        +data.body+
                                                    '</div>'+
                                                    '<div class="commentActions">'+
                                                        '<div class="commentTime"><span class="icon-clock"></span> '+data.created+'</div>'
                                                        +filesRelated+" "+ULL+
                                                        '<div class="clearfix"></div>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="clearfix"></div>'+
                                            '</div>';    
                                    
            return comment;
        },
        makeEmailAsRead: function(e) {
            var anchor = $(e.currentTarget);
            var self = this;
            if( anchor.find("span.unread").length > 0 ) {
                var url = self.makeAsRead+"/"+anchor.attr("data-e-id");
                self.httpAPI(url, "GET", {}, "json", function(data) {
                    if( data.status == "success" ) {
                        anchor.find("span.unread").removeClass("unread");
                    } else {
                        alert(data.message);
                    }
                });
            }
        }
    };
}($));
$(window).load(function() {
//   properties.init(properties.datatable); //why did he pass datatable function to the view??
   properties.init(); 
});
function log(data){
    $('#log').append(data + '<br>');
    //console.log(data);
}
function csh(data){
    $('#csh_model_data').append(data + '<br>');
}