var search = (function($) {
    return {
        listNotes: window.location.origin+"/property_notes/api_index",
        addNote: window.location.origin+"/property_notes/api_add",
        deleteNote: window.location.origin+"/property_notes/api_delete",
        folder: null,
        cshId: null,
        currentTxId: 0,
        map: null,
        bounds: null,
        infobox: null,
        data: null,
        pid: null,
        buyer_id: null,
        formatter: null,
        init: function () {
            search.__proto__ = Pankaj;
            search.initialize();
            search.eventHandlers();
            
            //notes
            
            $(document).on("click", ".addNewNoteNow",function(){
                var txid = $(this).attr('data-rel');
                search.addNewNote(txid);
            });
            $(document).on("click", ".removeThisNoteNow", this.removeOneNote.bind(this));
            
            search.buyer_id = $("[name=buyer_id]").val();
            $("[name=buyer_id]").on('change', function (e) {
                search.buyer_id = $(this).val();
                e.preventDefault();
            });

            $.fn.editable.defaults.mode = 'popup';
            $.fn.editable.defaults.url = '/search/ajaxEditableSubmit';

            $('#drawMap').on('click', function () {

                var windowHeight = window.innerHeight;
                var headerHeight = $('#header').height();
                var contentHeight = windowHeight - headerHeight;

                $('#map').height(contentHeight);
                setTimeout(function () {

                    search.drawMap();
                }, 500);

            });

            $('#searchSubmit').on('click', function (e) {
                var searchCriteria = $('#searchForm').serializeObject();
                jQuery('#properties').html('Please wait.. <span class="fa fa-spin fa-3x fa-spinner"></span>');
                jQuery('#exception').addClass("hidden");
                jQuery('[href=#properties][role=tab]').click();
                $.ajax({
                    type: 'post',
                    url: '/search/ajaxMatchingProperties',
                    data: {searchCriteria: JSON.stringify(searchCriteria)},
                    success: function (response) {
                        jQuery('#properties').html(response);
                    },
                    error: function (response) {
                        jQuery('#exception').removeClass('hidden').html(response.responseText);
                    }
                });

                e.preventDefault();
            });

            $('#searchClear').on('click', function (e) {
                var searchCriteria = {"config_page": 1};
                jQuery('#properties').html(jQuery('#loaderNotifier').html());
                $.ajax({
                    type: 'post',
                    url: '/search/ajaxMatchingProperties',
                    data: {searchCriteria: JSON.stringify(searchCriteria)},
                    success: function (response) {
                        jQuery('#properties').html(response);
                    },
                    error: function (response) {
                        jQuery('#exception').removeClass('hidden').html(response.responseText);
                    }
                });

                e.preventDefault();
            });
            /**   ___                  _   ___                  _
             *   / __| __ ___ _____ __| | / __| ___ __ _ _ _ __| |_  ___ ___
             *   \__ \/ _` \ V / -_) _` | \__ \/ -_) _` | '_/ _| ' \/ -_|_-<
             *   |___/\__,_|\_/\___\__,_| |___/\___\__,_|_| \__|_||_\___/__/
             */

            function updateSavedSearchEdit(action, id, parameter) {
                jQuery('#savedSearches').html(jQuery('#loaderNotifier').html());
                $.ajax({
                    type: action != null ? 'post' : 'get',
                    url: '/search/editSavedSearches',
                    data: action != null ? {
                        'action': action,
                        'id': id,
                        'parameter': parameter,
                        'criteria': $('#searchForm').serializeObject()
                    } : {},
                    success: function (response) {
                        jQuery('#savedSearches').html(response);
                    },
                    error: function (response) {
                        jQuery('#exception').removeClass('hidden').html(response.responseText);
                    }
                });
            }

            $('#showSavedSearches').on('click', function (e) {
                jQuery('#savedSearches').html(jQuery('#loaderNotifier').html());
                $.ajax({
                    type: 'get',
                    url: '/search/savedSearches',
                    success: function (response) {
                        jQuery('#savedSearches').html(response);
                    },
                    error: function (response) {
                        jQuery('#exception').removeClass('hidden').html(response.responseText);
                    }
                });
            });

            $('#searchSave').on('click', function (e) {
                e.preventDefault();

                $('#showSavedSearches').tab('show');
                updateSavedSearchEdit();
            });

            $(document).on('click', '#add-saved-search', function (e) {
                //If the blank one is selected
                e.preventDefault();

                var newName = false;
                newName = window.prompt("What would you like to name the new search?");
                if (newName) {
                    updateSavedSearchEdit("add", 0, newName);
                }
            });

            $(document).on('click', '#rename-saved-search', function (e) {
                e.preventDefault();

                //If the blank one is selected
                if ($('#saved_searches [name=id]').val() == '')
                    return;

                var newName = false;
                newName = window.prompt("What would you like to name this?", $('#saved_searches [name=id] option:selected').text());
                if (newName) {
                    updateSavedSearchEdit("rename", $('#saved_searches [name=id]').val(), newName);
                }
            });

            $(document).on('click', '#delete-saved-search', function (e) {
                e.preventDefault();

                //If the blank one is selected
                if ($('#saved_searches [name=id]').val() == '')
                    return;

                var confirmDelete = false;
                confirmDelete = confirm("Are you sure you want to delete this saved search?  (This cannot be undone) (No really, Steve can't recover these)");
                if (confirmDelete) {
                    updateSavedSearchEdit("delete", $('#saved_searches [name=id]').val());
                }
            });

            $(document).on('click', '#save-search', function (e) {
                e.preventDefault();

                //If the blank one is selected
                if ($('#saved_searches [name=id]').val() == '')
                    return;


                updateSavedSearchEdit("save", $('#saved_searches [name=id]').val());

                $('#flashMessage').html('Saving');
            });

            $(document).on('click', '.changestatus', function (e) {
                var url = $(this).attr('data-rel-status');
                alert(url);
                e.preventDefault();
            });

            $(document).on('click', '.showImages', function (e) {

                var id = $(this).attr('data-rel-id');
                
                //2 hidden fields to identify where images will be uploaded on S3. modal at bottom of /parts/index.ctp
                //console.log($(this).attr('data-rel'));
                $('#market_for_image_upload').val($(this).attr('data-rel'));
                $('#s3ImageLoaderMlsDataId').val(id);
                
                
                
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/search/ajaxGetPropertyImages',
                    data: {id: id},
                    success: function (data) {

                        var out = '';
                        $.each(data, function (k, v) {
                            out += '<img src="' + v + '" style="float: left; width: 49%; margin-right: 1%; margin-bottom: 0.5em;">';
                        });

                        out += '<p style="clear: both;">';
                        $('#imageModalBody').html(out);

                    }
                });

                e.preventDefault();
            });

            $(document).on('click', '.showDetail', function () {

                var id = this.id;
                if ($('#detail-' + id).hasClass('hidden')) {

                    //hide all divs initialy
                    $('.detaildiv').addClass('hidden');//hide any expanded divs which might be open.

                    $('.closeDetail').addClass('hidden');//hide all small X buttons used close expanded divs.
                    $('#closeDetail-' + id).removeClass('hidden');//show X button for selected li

                    $('.showDetail').addClass('notSelected');//add grey backgrounds to all list items
                    $('#' + id).removeClass('notSelected');//remove grey backgound from selected div

                    $('#detail-' + id).removeClass('hidden');

                    $('.liParent').removeClass('highlightExpandedDiv');//remove from all
                    $('#liParent-' + id).addClass('highlightExpandedDiv');//add to selected

                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: '/search/ajaxPropertyDetail',
                        data: {id: id},
                        success: function (data) {

                            var MlsData = data.MlsData;
                            search.pid = MlsData.MlsData_id;

                            $.each(MlsData, function (field, val) {
                                $('#' + field + '-' + search.pid).editable({
                                    value: val,
                                    pk: search.pid,
                                    url: '/search/ajaxEditableSubmit',
                                    title: field.replaceAll('_', ' '),
                                    success: function (response) {
                                        //   console.log(response);
                                    }
                                });
                            });
                            //console.log(data);
                            search.getTransactions(data.Property)


                        }//!success
                    });


                } else {
                    
                    var listing_id = $('#listing_id_' + id).attr('data-rel-id');
                    //console.log(listing_id);
                    window.location.href = '/search/index?quicksearch=' + listing_id;//can't forward on this link. need transaction id
                    //$('.detaildiv').addClass('hidden');//hide any expanded divs which might be open.
                    
                }

            });

            $(document).on('click', '[action=newOffer]', function (e) {
                e.preventDefault();

                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/search/createPropertyRecord',
                    data: {
                        mls_data_id: $(this).data('mls-id'),
                        buyer_id: $('[name=buyer_id]').val()
                    },
                    success: function (data) {
                        search.loadSingleTransaction(data.id);
                    }
                });
            });

            $(document).on('click', '[action=dead]', function (e) {
                e.preventDefault();

                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/search/makePropertyDead',
                    data: {
                        mls_data_id: $(this).data('mls-id'),
                        buyer_id: $('[name=buyer_id]').val()
                    },
                    success: function (data) {
                        search.closeDetail();
                    }
                });
            });

            $(document).on('click', '.listItemClick', function (e) {


                var string = $(this).attr('data-rel-id');
                //console.log(string);
                var txid = $(this).closest('div').attr('data-rel-id');
                //console.log(txid);
                var bit = string.split('-');
                //console.log(bit);
                var field = bit[0];//field name
                var pid = bit[1];//mls_data_id
                var value = bit[2];//string value
                var index = bit[3];//index id of the selected item

                //console.log('PID: ' +pid);

                $('#' + field + '-' + pid).text(value);

                $.ajax({
                    type: 'post',
                    url: '/search/ajaxBtnSelectUpdate',
                    data: {id: pid, field: field, index: index, txid: txid},
                    success: function (data) {
                        console.log(data);
                    }
                });


                e.preventDefault();
            });

            $(document).on('click', '.newAction', function (e) {
                var str = $(this).attr('data-rel-id');
                var bit = str.split('-');
                var action = bit[0];
                var pid = bit[1];
                var clientid = jQuery('[name=special_client_id]').val();
                //alert(action +  ' - ' + id);
                $.ajax({
                    type: 'post',
                    url: '/search/ajaxChangeStatus',
                    data: {pid: pid, action: action, clientid: clientid},
                    success: function (data) {
                        console.log(data);
                    }
                });

                if (action == 'reject' || action == 'dead') {
                    jQuery(this).closest('.liParent').remove();
                }
                e.preventDefault();
            });


            $("[name=salestatus_id],[name=purchasestatus_id],[name=special_listing_cond],[name=dwelling_type]").multiselect({
                enableFiltering: false,
                includeSelectAllOption: false,
                selectAllJustVisible: false,
                enableCaseInsensitiveFiltering: false,
                maxHeight: 350,
                numberDisplayed: 2
            });

            $("[name=purchasestatus_id]").multiselect({
                enableFiltering: false,
                includeSelectAllOption: false,
                selectAllJustVisible: false,
                enableCaseInsensitiveFiltering: false,
                maxHeight: 350,
                numberDisplayed: 2
            });

            $("[name=agent_id_in]").multiselect({
                enableFiltering: false,
                includeSelectAllOption: false,
                selectAllJustVisible: false,
                enableCaseInsensitiveFiltering: false,
                maxHeight: 350,
                numberDisplayed: 2
            });

            $("[name=city]").multiselect({
                enableFiltering: false,
                includeSelectAllOption: false,
                selectAllJustVisible: false,
                enableCaseInsensitiveFiltering: false,
                maxHeight: 350,
                numberDisplayed: 2
            });

            $("[name=market]").multiselect({
                enableFiltering: false,
                includeSelectAllOption: false,
                selectAllJustVisible: false,
                enableCaseInsensitiveFiltering: false,
                maxHeight: 350,
                numberDisplayed: 1,
                onChange: function (option, checked, select) {
                    var data = $('[name=market]').serializeObject();
                    $.ajax({
                        type: 'post',
                        url: '/search/ajaxCityList',
                        data: {data: JSON.stringify(data)},
                        success: function (response) {
                            $('[name=city]').multiselect('dataprovider', JSON.parse(response));
                        },
                        error: function (response) {
                            jQuery('#exception').removeClass('hidden').html(response.responseText);
                        }
                    });
                }
            });

            $(document).on('click', '.txlist', function (e) {
                var el = $(this).attr('id');
                var bit = el.split('-');
                var txid = bit[1];

                search.loadSingleTransaction(txid);

                e.preventDefault();
            });

            $('.linksAction').on('click', function () {
                var bit = $(this).attr('data-rel-id').split('-');
                var key = bit[0];
                var mls_id = bit[1];
                var txid = $(this).attr('data-rel');
                
                /*

                key options
                school
                taxes
                dropbox
                cshId
                */
               
                if(key == 'cshId'){search.getCshId(txid,1)};
                if(key == 'school'){search.greatSchools(mls_id)};
                if(key == 'dropbox'){search.actionDropbox(txid,1)};
                if(key == 'taxes'){search.actionTaxes(txid,mls_id);}
                if(key == 'eblast'){search.actioneBlast(txid,mls_id);}
                
            });
            
            $('.linksModal').on('click',function(){
                var bit = $(this).attr('data-rel-id').split('-');
                var key = bit[0];
                var pid = bit[1];

                if (key == 'calc') {
                    search.linksShowCalc(pid);
                }
                if (key == 'log') {
                    search.linksShowLog(pid);
                }
                if (key == 'yield') {
                    search.linksShowYield(pid);
                }
                if (key == 'inputs') {
                    search.linksShowInputs(pid);
                }
            });

            $(document).on('click', '.offerPageLink', function () {

            });


            search.formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
            });

            search.createInfobox();
            $('#mainSearchPanel').removeClass('hidden');
            search.adjustMultiSelectDropdownHeight();

            /** eBlast Stuff **/

            $('#eblast').on('shown.bs.modal', function() {
                search.initEblast();
            });

            $('#marketing_comment_preview').click(function (e) {
                search.updateMarketingComments(function(){window.location = "/marketing/preview/" + search.currentTxId;});
                e.preventDefault();
            });

            $('#marketing_comment_send_all').click(function (e) {
                search.updateMarketingComments();
                var data = {
                  txId: search.currentTxId
                };
                $.ajax({
                    type: 'post',
                    url: '/marketing/ajax_eblast_job_create',
                    data: {data: data},//id-market
                    success: function (response) {
                        //console.log(response);
                        window.location.reload();
                    }
                });

                e.preventDefault();
            });
            //properties.updateZestimate();

            $('#marketing_comment_updated').hide();
            $('#marketing_comment_submit').on('click', function (e) {
                search.updateMarketingComments();
                e.preventDefault();
            });
        },
        getCshId: function(txid,create,onSuccess){
            
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/search/ajaxGetColonyId',
                data: {property_id:txid,create:create},
                success: function(response){
                    search.cshId = response;
                    console.log(response);
                    if(onSuccess){
                        onSuccess();
                    }
                }
            });
            
        },
        actionDropbox: function(txid,create,onSuccess){
            
            $.ajax({
                type: 'post',
                url: '/search/getDropboxTransactionFolder/',
                dataType: 'json',
                data: {txid:txid,create:create},
                success: function(response){
                    search.folder = response;
                    if(onSuccess){
                        onSuccess();
                    }
                }
            });
            
        },
        getClientYield: function(field,mls_id,txid){
            
            var est_value    = $('#Property_est_value-' + mls_id).text();
            var est_repairs  = $('#Property_est_repairs-' + mls_id).text();
            var est_rent     = $('#Property_est_rent-' + mls_id).text();
            var purchase_amt = $('#Property_purchase_amt-' + mls_id).text();
            var csh_cap_rate = $('#Property_csh_cap_rate-' + mls_id).text();
            var irr = $('#Property_irr-' + mls_id).text();

            //values needed for offerpad calc
            if (est_value != 'Empty' && est_repairs != 'Empty' && purchase_amt != 'Empty') {
                var calc;
                if (field == 'Property_irr' && irr != 'Empty') {
                    calc = 'purchase';//console.log('calc purchase based on irr');
                }
                if (field == 'Property_purchase_amt' && purchase_amt != 'Empty') {
                    calc = 'irr';//console.log('calc irr based on purchase');
                }

                $.ajax({
                    type: 'post',
                    url: '/search/ajaxOfferpadYieldGoalSeek',
                    data: {
                        mls_id: mls_id,
                        txid: txid,
                        est_value: est_value,
                        est_repairs: est_repairs,
                        purchase_amt: purchase_amt,
                        calc: calc,
                        irr: irr
                    },
                    success: function (response) {
                        if (calc == 'irr') {
                            $('#Property_irr-' + mls_id).text(response);
                        } else if (calc == 'purchase') {
                            $('#Property_purchase_amt-' + mls_id).text(response);
                        }
                    }
                });
            }

            //values needed for colony calc
            if (est_value != 'Empty' && est_repairs != 'Empty' && est_rent != 'Empty') {
                var dir;
                if (field == 'Property_csh_cap_rate' && csh_cap_rate != 'Empty') {
                    dir = 'purchase';//console.log('calc purchase based on cap');
                }
                if (field == 'Property_purchase_amt' && purchase_amt != 'Empty') {
                    dir = 'cap';//console.log('calc cap based on purchase');
                }
                $.ajax({
                    type: 'post',
                    url: '/search/ajaxColonyYieldGoalSeek',
                    data: {dir: dir, txid: txid, csh_cap_rate: csh_cap_rate},
                    success: function (response) {
                        if (dir == 'cap') {
                            $('#Property_csh_cap_rate-' + mls_id).text(response);
                        } else if (dir == 'purchase') {
                            $('#Property_purchase_amt-' + mls_id).text(response);
                        }
                    }
                });
            }
        },
        actionTaxes: function (txid,mls_id) {
            
            var apn = $('#MlsData_apn-' + mls_id).text();
            
            if(apn == 'Empty'){
                alert('Missing Apn');
                return false;
            }
            
            
            
            
            $.ajax({
                type: 'post',
                url: '/search/ajaxGetMaricopaTaxes',
                data: {mls_id:search.pid,apn:apn,txid:txid},
                success: function (response) {
                    console.log(response);
//                    var obj = JSON.parse(response);
//                    console.log(obj);
                    
                    $('#taxOverride-body').html(response);
                    $('#taxOverride').modal('show');
                    
                }
            });
        },
        linksShowInputs: function (pid) {
            $.ajax({
                type: 'post',
                //dataType: 'json',
                url: '/search/ajaxFetchColonyModelInputs',
                data: {pid: pid},
                success: function (response) {
//                        var out = '<table class="table table-bordered table-condensed table-striped"><tbody>';
//                        $.each(response,function(k,v){
//                            out += '<tr><td>' + k + '</td><td>' + v + '</td></tr>'
//                        });
//                        out += '</tobdy></table>';
                    $('#inputs-body').html(response);
                }
            });
        },
        linksShowYield: function (pid) {

            var txid = $('#pk-' + pid).val();

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/search/ajaxCalculateColonyYield',
                data: {txid: txid},
                success: function (response) {
                    console.log(response);
                    var out = '<table class="table table-bordered table-condensed table-striped"><tbody>';
                    $.each(response, function (k, v) {
                        out += '<tr><td>' + k + '</td><td>' + v + '</td></tr>'
                    });
                    out += '</tobdy></table>';
                    $('#yield-body').html(out);
                }
            });
        },
        linksShowLog: function (pid) {
            $.ajax({
                type: 'post',
                url: '/properties/apiGetPropertyLog',
                data: {id: pid},
                success: function (response) {
                    $('#log-body').html(response);

                }
            });
        },
        linksShowCalc: function (pid) {

            var est_value = $('#Property_est_value-' + pid).text().replace(/[^0-9.]/g, '');
            var est_repairs = $('#Property_est_repairs-' + pid).text().replace(/[^0-9.]/g, '');
            var asis = est_value - est_repairs;

            for (var i = 75; i <= 85; i++) {
                var amt = asis * (i / 100);
                var str = i + '% $' + amt.toLocaleString() + '<br>';
                $('#calc-body').append(str);
            }

        },
        loadSingleTransaction: function (id) {

            //id = the id from the properties table, not mls_data_id
            //write this value to the dropdown buttons so we can update the correct property record.
            $('#pk-' + search.pid).val(id);
            search.currentTxId = id;
            $('#transaction-detail-' + search.pid).removeClass('hidden');

            $('.offerPageLink').attr('href', '/offers/index/' + id);
            $('.propertyDetailPageLink').attr('href', '/properties/view/' + id);
            $('.eblastPageLink').attr('href', '/marketing/investors/send_property/' + id);

            $('.linksAction').attr('data-rel', id);
            $('.addNewNoteNow').attr('data-rel', id);
            $('#Purchasestatus_name-' + search.pid + '-field').attr('data-rel-id',id);
            $('#Salestatus_name-' + search.pid + '-field').attr('data-rel-id',id);
            $('#User_name-' + search.pid + '-field').attr('data-rel-id',id);
            $('#Title_name-' + search.pid + '-field').attr('data-rel-id',id);
            
            //hide create folder button if folder exists
            search.actionDropbox(id,0,function(){
                if(search.folder.exists == true){
                    $('a[data-rel-id=dropbox-' + search.pid + ']').closest('li').hide().prev().hide();
                }
            });
            
            search.getCshId(id,0,function(){
                if(search.cshId.exists == true){
                    $('a[data-rel-id=cshId-' + search.pid + ']').closest('li').hide().prev().hide();
                }else{
                    console.log('no csh id');
                }
            });
            
            search.listPropNotes(id);
            Income.list(search.pid);

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/search/ajaxGetTransactionDetail',
                data: {txid: id},
                success: function (data) {
                    if(data.Property_marketing_comment === null){
                        data.Property_marketing_comment = "";
                    }
                    $('#marketing_comment').text(data.Property_marketing_comment);
                    if(tinyMCE.activeEditor) {
                        tinyMCE.activeEditor.setContent(data.Property_marketing_comment);
                    }
                    var pid = data.Property_mls_data_id;
                    var pk = data.Property_id;

                    var selectFields = [
//                            'MlsData_dwelling_type',
//                            'MlsData_hoa_paid',
//                            'MlsData_pool',
//                            'MlsData_horses'
                    ];

                    var buttonFields = [
                        'Purchasestatus_name',
                        'Salestatus_name',
                        'Buyer_company',
                        'User_name',
                        'Title_name'
                    ];

                    var dateFields = [
                        'Property_offer_date',
                        'Property_purchase_date',
                        'Property_purchase_date_ext',
                        'Property_contract_date',
                        'Property_emd_date',
                        'Property_insp_exp',
                        'Property_insp_exp_ext',
                        'Property_insp_sched',
                        'Property_insp_actual',
                        'Property_binsr_accepted',
                        'Property_binsr_rejected',
                        'Property_final_walk_sched',
                        'Property_final_walk_date',
                    ];

                    $.each(data, function (field, val) {

                        if (search.inArray(field, dateFields)) {

                            $('#' + field + '-' + pid).editable({
                                type: 'date',
                                format: 'yyyy-mm-dd',
                                viewformat: 'yyyy-mm-dd',
                                datepicker: {
                                    weekStart: 1,
                                    todayBtn: 'linked',
                                    todayHighlight: true,
                                    autoclose: true
                                },
                                value: val,
                                pk: pk,
                                title: field.replaceAll('_', ' '),
                                url: '/search/ajaxEditableSubmit',
                                success: function (response) {
                                    //console.log(response);
                                }
                            });

                        } else if (search.inArray(field, buttonFields)) {

                            if (field == 'Buyer_company') field = 'Buyer_name';
                            $('#' + field + '-' + pid).text(val);
                            $('#Buyer_name-' + pid + '-field').text(data.Buyer_company);

                        } else if (search.inArray(field, selectFields)) {

                            $('#' + field + '-' + pid).editable({
                                value: val,
                                pk: pk,
                                type: 'select',
                                source: search.select(field),
                                url: '/search/ajaxEditableSubmit',
                                title: field.replaceAll('_', ' '),
                                success: function (response) {

                                }
                            });

                        } else {

                            $('#' + field + '-' + pid).editable({
                                value: val,
                                pk: pk,
                                url: '/search/ajaxEditableSubmit',
                                title: field.replaceAll('_', ' '),
                                success: function (response) {
                                    var bit = $(this).attr('id').split('-');
                                    var field = bit[0];
                                    var mls_id = bit[1];

                                    setTimeout(function () {
                                        search.getClientYield(field, mls_id, pk);
                                    }, 500);
                                }
                            });

                        }

                    });
                }
            });
        },
        getTransactions: function (data) {
            var buyerTxId = null;
            var tx_count = data.length;

            var currentBuyerHasTransaction = 'false';

            var out = '<div style="margin-left: 15px;margin-bottom: 0px;font-size: .9em;font-weight: bold;">Transactions</div>';
            out += '<ul style="list-style-type: none;padding-left: 15px">';

            $.each(data, function (i, v) {

                if (search.buyer_id == v.Buyer.id) {
                    currentBuyerHasTransaction = 'true';
                    buyerTxId = v.Property.id;
                }
                out += '<li>';
                out += 'TXID#: ' + v.Property.id + ' ';
                out += v.Buyer.company;
                out += ' ( ' + v.User.name + ': ';
                out += ' ' + v.Purchasestatus.name + ' ) ';
                out += '</li>';
            });
            out += '</ul>';

            if (currentBuyerHasTransaction == 'false') {
                var html = $('#noTxButtons-' + search.pid).html();
                out += html;
            }

            $('#transactions-' + search.pid).html(out);
            if (buyerTxId != null) {
                search.loadSingleTransaction(buyerTxId);
            }

        },
        select: function (field) {
            var list;
            switch (field) {
                case 'MlsData_dwelling_type':
                    list = [{
                        value: 'Single Family - Detached',
                        text: 'Single Family - Detached'
                    }, {value: 'Mfg/Mobile Housing', text: 'Mfg/Mobile Housing'}, {
                        value: 'Patio Home',
                        text: 'Patio Home'
                    }, {value: 'Townhouse', text: 'Townhouse'}, {
                        value: 'Gemini/Twin Home',
                        text: 'Gemini/Twin Home'
                    }, {value: 'Manufactured Home', text: 'Manufactured Home'}];
                    break;
                case 'MlsData_hoa_paid':
                    list = [{value: 'No HOA', text: 'No HOA'}, {value: 'Monthly', text: 'Monthly'}, {
                        value: 'Quarterly',
                        text: 'Quarterly'
                    }, {value: 'Semi-Annually', text: 'Semi-Annually'}, {value: 'Annually', text: 'Annually'}];
                    break;
                case 'MlsData_pool':
                    list = [{value: 'Private', text: 'Private'}, {
                        value: 'Community',
                        text: 'Community'
                    }, {value: 'Both', text: 'Both'}, {value: 'No Pool', text: 'No Pool'}];
                    break;
                case 'MlsData_horses':
                    list = [{value: 'No', text: 'No'}, {value: 'Yes', text: 'Yes'}];
                    break;
            }
            return list;


        },
        btnSelect: function (id) {

            var bit = id.split('-');

            var field = bit[0];//ie buyer_name
            var pid = bit[1];
            $('.' + field).removeClass('active');
            var value = $('#' + field + '-' + pid).text().replace(' ', '_');

            $('.' + field + '-li-' + pid).addClass('active');

        },
        closeDetail: function () {

            $(this).addClass('hidden');
            $('.closeDetail').addClass('hidden');
            $('.detaildiv').addClass('hidden');
            $('.liParent').removeClass('highlightExpandedDiv');
            $('.showDetail').removeClass('notSelected');

        },
        drawMap: function () {

            var currentClient = 'CSH'

            var height = $(window).height();
            $('#map').height(height - 100);

            var propertyText = $('#plist').text();
            var properties = JSON.parse(propertyText);

            var mapOptions = {
                center: {lat: 33.5, lng: -112},
                scrollwheel: true,
                zoom: 8,
                mapTypeId: 'roadmap',
            };


            search.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            search.bounds = new google.maps.LatLngBounds();


            $.each(properties, function (i, p) {

                //console.log(p.MlsData);

                var pin;
                switch (p.MlsData.status) {
                    case 'Active':
                        pin = 'marker-green.png';
                        break;
                    case 'Pending':
                        pin = 'marker-yellow.png';
                        break;
                    case 'Closed':
                        pin = 'marker-blue.png';
                        break;
                    default:
                        pin = 'marker-red.png';
                        break;

                }

                var latlng = new google.maps.LatLng(p.MlsData.latitude, p.MlsData.longitude);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: search.map,
                    icon: new google.maps.MarkerImage(
                        '/images/' + pin,
                        null,
                        null,
                        null,
                        new google.maps.Size(25, 25)
                    ),
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                });
                search.bounds.extend(latlng);
                search.map.fitBounds(search.bounds);

                var infoboxContent = '<div class="infoW">' +
                    '<div class="propImg">' +
                    '<div style="background-color: #0d9095;height: 40px"></div>' +
                    '<div class="propBg">' +
                    '<div class="propPrice">' + search.formatter.format(p.MlsData.list_price) + '</div>' +
                    '<div class="propType" style="color: #505050">tbd</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="paWrapper">' +
                    '<div class="propTitle" style="text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);">' + p.MlsData.address + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;font-size: 1.2em; color: #404040">' + address[1] + '</div>' +
                    '<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: bold">' + ' ' + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.purchase + '</div>' +
                    //'<div class="propAddress" style="margin: 7px 0;padding: 3px;font-size: 1.2em; color: #404040;font-weight: ">' + prop._aData.sale + '</div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '<div class="infoButtons">' +
                    '<a class="btn btn-sm btn-round btn-gray btn-o closeInfo">Close</a>' +
                    '<a href="/properties/view/' + p.MlsData.id + '" target="_blank" class="btn btn-sm btn-round btn-green viewInfo">View</a>' +
                    '</div>' +
                    '<div class="infoButtons">' +
                    '<a class="btn btn-xs btn-red bnt-o">Mark Dead for: ' + currentClient + '</a>' +
                    '</div>' +
                    '</div>';

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        search.infobox.setContent(infoboxContent);
                        search.infobox.open(search.map, marker);
                        search.map.setZoom(19);
                        search.map.setCenter(latlng);
                        search.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    };
                })(marker, i))
                google.maps.event.addListener(search.map, "click", function (event) {
                    search.infobox.open(null, null);
                    search.map.fitBounds(search.bounds);
                    search.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                });
            });


        },
        createInfobox: function () {
            search.infobox = new InfoBox({
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
        eventHandlers: function () {
            var acc = document.getElementsByClassName("accordion");
            var i;

            for (i = 0; i < acc.length; i++) {
                acc[i].onclick = function () {
                    this.classList.toggle("active");
                    var panel = this.nextElementSibling;
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                }
            }
        },
        adjustMultiSelectDropdownHeight: function () {
            $('.multiselect-container').each(function () {

                var currentHeight = $(this).height();
                if (currentHeight < 348) {
                    $(this).height(currentHeight + 10);
                }

            });
        },
        greatSchools: function(mls_id){
            $.ajax({
                type: 'post',
                url: '/schools/ajaxGetSchoolScore',
                data: {mls_id:mls_id},
                success: function(response){
                    $('#greatSchoolsScore-body').html(response);
                    $('#greatSchoolsScore').modal('show');
                }
            });
        },
        /*
         This is where the eblast stuff is.
         */
        initEblast: function () {
            if(!tinyMCE.activeEditor) {
                tinyMCE.init({
                    selector: "#marketing_comment",
                    theme: "modern",
                    menubar: "tools",
                    plugins: [
                        "preview fullscreen paste textcolor link"
                    ],
                    fontsize_formats: "9pt 12pt 16pt 20pt",
                    toolbar: "undo redo | bold italic underline | forecolor backcolor fontsizeselect | link | preview | templates ",
                    forced_root_block: "",
                    browser_spellcheck: true
                });
            }
        },
        updateMarketingComments: function(successCallback) {
            var id = search.currentTxId;
            var data = tinyMCE.get('marketing_comment').getContent();

            $.ajax({
                type: 'post',
                url: '/properties/apiMarketingComment',
                data: {id: id, marketing_comment: data},
                success: function (response) {
                    console.log(response);
                    $("#marketing_comment_updated").show().delay(2000).fadeOut('slow');
                    if(successCallback)
                        successCallback();
                }
            });
        },
        /*
         * Notess 
         */
        removeOneNote: function(e) {
            var object = $(e.currentTarget);
            var del = object.parent('li').text().replace('Remove','');
            
            var id = object.attr("data-id");
            
            var url = this.deleteNote+"/"+id;
            var self = this;
            this.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    self.listPropNotes();
                    $(".notetextbox").val("");
                }
                //console.log('------------ ' + del + ' --------------------');
                
                //console.log(del);
                 //search.__proto__.logit(properties.id,'Delete Note','' + del + '');
                object.parent('li').text('');
            });
        },
        listPropNotes: function(txid) {
            
            //$(".addNotesHere").remove();
            
            this.httpAPI(this.listNotes+"/"+ txid, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    
                    var LI = "";
                    
                    if( data.data.length > 0 ) {
                        $(data.data).each(function(i, v) {
                            //debug(v);
                            var remove = "<a href='javascript:void(0)' class='removeThisNoteNow' data-id='"+v.id+"'>Remove</a>";
                            LI +='<li class="mb5" style="white-space: nowrap;dispaly: block;">'+v.created+': '+v.note+'('+v.name+') '+remove+'</li>';
                        }); 
                        $(".addNotesHere").html(LI);
                    }
                    
                    
                }
            });
        },
        addNewNote: function(txid) {
            
            
            var note = $('#transaction-detail-' + search.pid + " .notetextbox").val();
            
            if( $.trim(note) == "" ) {
                alert('Please enter some text to note.');
                return ;
            }
            
            var url = this.addNote+"/"+txid+"/"+note;
            var self = this;
            this.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    
                    $(".notetextbox").val('');
                    
                    
                    search.listPropNotes(txid);

                }
                 //search.__proto__.logit(properties.id,'New Note',note);
            });
        },
    }

}($));

var Income = (function() {
    listIncomeUrl = window.location.origin+"/property_income/api_list";
    addIncomeUrl = window.location.origin+"/property_income/api_add";
    removeIncomeUrl = window.location.origin+"/property_income/api_delete";

    income = {
        init: function(){
            $('.addNewNoteNow').attr('data-rel', id);
            $(document).on("click", ".addIncome",function(e){
                var txid = $(this).attr('data-rel');
                Income.add(txid);
                e.preventDefault();
            });
            $(document).on("click", ".removeIncome", function(e){
                Income.remove(e);
                e.preventDefault();
            });

        },
        add: function() {
            var amount = $('#transaction-detail-' + search.pid + " .incomeamount").val();
            var incomeType = $('#transaction-detail-' + search.pid + " .incometype").val();
            var description = $('#transaction-detail-' + search.pid + " [name=income_description]").val();

            if( $.trim(amount) == "" ) {
                alert('Please enter amount.');
                return ;
            }

            var url = addIncomeUrl+"/"+search.pid+"/"+encodeURIComponent(amount)+"/" + incomeType + "/" + encodeURIComponent(description);
            var self = this;
            search.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {

                    $(".incomeamount").val('');
                    Income.list(search.pid);
                }
                //search.__proto__.logit(properties.id,'New Note',note);
            });
        },
        remove: function(e) {
            var object = $(e.currentTarget);
            var del = object.parent('li').text().replace('Remove','');

            var id = object.attr("data-id");

            var url = removeIncomeUrl+"/"+id;
            var self = this;
            search.httpAPI(url, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {
                    Income.list(search.pid);
                }
                object.parent('li').text('');
            });
        },
        list: function(pid) {

            //$(".addNotesHere").remove();

            search.httpAPI(listIncomeUrl+"/"+ pid, "GET", {}, "json", function(data) {
                if( data.status == "success" ) {

                    var LI = "";

                    if( data.data.length > 0 ) {
                        $(data.data).each(function(i, v) {
                            //debug(v);
                            var remove = "<a href='javascript:void(0)' class='removeIncome' data-id='" + v.id + "'><span class='label label-danger'>Remove</span></a>";
                            LI +='<li class="list-group-item mb5" style="white-space: nowrap;">' + v.type + ': ' + v.amount + '(' + v.description + ') ' + remove + '</li>';
                        });
                        $(".addIncomeHere").html(LI);
                    }
                }
            });
        },
    };

    return income;
}($));

$(window).load(function() {
    search.init();
    Income.init();
});
