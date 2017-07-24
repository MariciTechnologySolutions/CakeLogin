var test = (function($) {
    return {
        oTable: '',
        oColumns: '',
        dtDrawCount: 0,
        Url: window.location.origin+"/tests/",
        searchRole: '',
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            
            $('.handleFilter').click(function () {
                $('.filterForm').slideToggle(200);
            });
            
            $('#dataTable thead tr#filterrow th').each( function (i) {
                var title = $('#dataTable tfoot th').eq( $(this).index() ).text();
                $(this).html( '<input type="text" onclick="" class="form-control" placeholder="'+title+'" data-index="'+i+'" />' );
            } );
            
            test.dtBuildObject();
            
            $('.limiter').on('blur', function(){
                test.filter();
            });
            
            //test.getCurrentFilter();
        },
        getCurrentFilter: function(){
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/tests/apiGetCurrentFilter',
                success: function(response){
                    console.log(response);
                    
                    $('#list_price').val(response.list_price);
                    $('#est_yield').val(response.est_yield);
                    $('#motivation_score').val(response.motivation_score);
                    
                }
            });
        },
        filter: function(){
    
    
            var list_price       = $('#list_price').val();
            var est_yield        = $('#est_yield').val();
            var motivation_score = $('#motivation_score').val();
            var year_built       = $('#year_built').val();
            
            
//            console.log(list_price);
//            console.log(est_yield);
//            console.log(motivation_score);
            
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/tests/apiFilter',
                data: {list_price:list_price,est_yield:est_yield,motivation_score:motivation_score,year_built:year_built},
                success: function(response){
                    console.log(response);
                    //console.log(response.year_built);
                    
                    $('#list_price').val(response.list_price);
                    $('#est_yield').val(response.est_yield);
                    $('#motivation_score').val(response.motivation_score);
                    $('#year_built').val(response.year_built);
                    window.location.reload();
                }
            });
            
            
        },
        buyer: function(btn){
            var o = $(btn).toggleClass('btn-default btn-info');
            var sel = 'false';
            var classes = o[0].className;
            if(classes.indexOf('btn-default') == -1){
                sel = 'true';
            }
            var user_id = $(btn).attr('data-rel-id');
            
            $.ajax({
                type: 'post',
                url: '/tests/apiSelectBuyer',
                data: {sel:sel,user_id:user_id},
                success: function(response){
                    test.oTable.ajax.reload( null, false );
                        console.log(response);
                }
            });
        }, 
        status: function(btn){
            $(btn).toggleClass('btn-default btn-info');
            var sel = $(btn).attr('data-rel-id');
            var btn = sel.split('-');
            //console.log(sel);
            test.searchRole = btn[1];
            
            $.ajax({
                type: 'post',
                url: '/tests/apiFetchData',
                data: {sel:sel},
                success: function(response){
                    test.oTable.ajax.reload( null, false );
                }
            });
        }, 
        tagger: function(btn){
            $(btn).toggleClass('btn-default btn-info');
            var tag = $(btn).attr('data-rel-id');
            
            $.ajax({
                type: 'post',
                url: '/tests/apiSetTag',
                data: {tag:tag},
                success: function(response){
//                        console.log(response);
                    test.oTable.ajax.reload( null, false );
                }
            });
        },
        postDtCss: function(){
            $('tr#filterrow th input.form-control').width('100px');
            $('.buttons-colvis').text('Columns');
            $('.dt-buttons').width('40%').height('40px').addClass('pull-left show').css({'padding':'5px 0 0 10px'});
            $('.sorting, .sorting_asc, .sorting_desc').css({
                'font-weight':'bold',
                'font-size':'1.1em',
                'white-space':'nowrap',
                'overflow':'hidden'
            });
            $('ul.pagination').css({'font-size':'8px'});
            $('div.dt-buttons').children().addClass('btn-xs');
            $('body').css({'overflow-y':'hidden'});
        },
        dtInit: function(){
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/tests/apiGetColumns',
                data: {1:1},
                success: function(response){
                    test.dtBuildObject(response);
                }
            });
        },
        dtBuildObject: function(){
            
            var obj = {
                'ajax' : {
                    url: '/tests/apiFetchData'
//                    ,success: function(res){
//                        console.log(res);
//                    }        
                },
                'dom':  "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'p>>" +
                        "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row padtop3'<'col-sm-5'i><'col-sm-7'p>>",
                'buttons': ['colvis','excel','pdf',
                {
                    text: 'Reset',
                    action: function () {
                        test.clearState();
                    }
                }],
                lengthMenu: [
                    [ 5, 10, 50, -1 ],
                    [ '5 rows', '10 rows', '50 rows', 'Show all' ]
                ],
                'iDisplayLength': 50,
		'stateSave': true,
                'scrollX': true,
                "scrollCollapse": true,
                'orderCellsTop': false,
                'deferRender': true,
                drawCallback: function(){
                    if(test.dtDrawCount > 0){
                        test.postDtCss();
                    }
                    test.dtDrawCount++;
                },
                'columnDefs': [
                    {
                        'type': 'num-fmt',
                        'targets': [4,6,15,18]
                    },
                    {
                        "visible":false,
                        "targets":[2,3,4,5,6,16,17] 
                    }
                ],        
                'columns': [ 
                    { 
                        'data': '0.address',
                        createdCell: function (nTd, sData, oData, iRow, iCol) {
                            var linkA = "<a href='/properties/view/" + oData.MlsData.id + "' style='white-space: nowrap' target='_blank'>" + test.ucwords(sData) + "</a>";
                            $(nTd).html(linkA);
                        }
                    },
                    { 
                        'data': 'MlsData.city'
                    },
                    { 
                        'data': 'MlsData.zipcode'
                    },
                    { 
                        'data': 'MlsData.status',
                        createdCell: function (nTd, sData, oData, iRow, iCol) {
                            var pending = ['UCB (Under Contract-Backups)','CCBS (Contract Contingent on Buyer Sale)'];
                            var status = oData.MlsData.status;
                            if(status == 'Active' && test.inArray(oData.MlsData.ucb,pending)){
                               status = 'Pending'; 
                            }
                            $(nTd).html(status);
                        }
                    },
                    { 
                        'data': 'MlsData.list_price',
                        render: $.fn.dataTable.render.number( ',', '.', 0, '$' )
                    },
                    { 
                        'data': 'MlsData.motivation_score'
                    },
                    { 
                        'data': '0.est_yield',
                        render: function ( data, type, row ) {
                            if(row[0].est_yield > 0){
                                var up = parseInt(row[0].est_yield * 100);
                                var down = up/100;
                                return  down + '%';
                            }else{
                                return 0 + '%';
                            }
                        }
                    },
                    { 
                        'data': 'Property.contract_date'
                    },
                    { 
                        'data': 'Property.phase_1_inspection'
                    },
                    { 
                        'data': 'Property.due_diligence_expires',
                        createdCell: function (nTd, sData, oData, iRow, iCol) {
                            
                            if(oData.Property.due_diligence_expires && !oData.Property.phase_2_binsr_accepted){
                                
                                var expire = oData.Property.due_diligence_expires;
                                
                                var today = $('#currDate').val();
                                
                                var delta = parseInt(test.businessDays(today,expire));
                                
                                console.log(delta);
                                
                                if(delta == 2 || delta == 3){
                                    
                                    $(nTd).html(oData.Property.due_diligence_expires).addClass('csh_yellow');
                                
                                }else if(delta < 2){
                                
                                    $(nTd).html(oData.Property.due_diligence_expires).addClass('csh_red');
                                
                                }else{
                                
                                    $(nTd).html(oData.Property.due_diligence_expires);
                                
                                }
                                
                                
                                
                                
                                
                            }else{
                                if(oData.Property.phase_2_binsr_accepted)
                                    $(nTd).html(oData.Property.due_diligence_expires).addClass('csh_green');
                            }
                        }
                    },
                    { 
                        'data': 'Property.phase_2_binsr_accepted',
                        createdCell: function (nTd, sData, oData, iRow, iCol) {
                            var binsr_date;
                            if(oData.Property.phase_2_binsr_rejected){
                                $(nTd).html(oData.Property.phase_2_binsr_rejected).addClass('csh_red');
                            }else{
                                if(oData.Property.phase_2_binsr_accepted)
                                    $(nTd).html(oData.Property.phase_2_binsr_accepted).addClass('csh_green');
                            }
                        }
                    },
                    { 
                        'data': 'Property.phase_1_submitted'
                    },
                    { 
                        'data': 'Property.phase_2_submitted'
                    },
                    { 
                        'data': 'Purchasestatus.name'
                    },
                    { 
                        'data': 'Property.purchase_date'
                    },
                    { 
                        'data': 'Property.purchase_amt',
                        render: $.fn.dataTable.render.number( ',', '.', 0, '$' )
                    },
                    { 
                        'data': 'Salestatus.name'
                    },
                    { 
                        'data': 'Property.sale_date'
                    },
                    { 
                        'data': 'Property.sale_amt',
                        render: $.fn.dataTable.render.number( ',', '.', 0, '$' )
                    },
                    { 
                        'data': 'Property.csh_id'
                    },
                    { 
                        'data': 'Followup.date'
                    }
                ]
            };
            test.dtCreate(obj);
        },
        businessDays: function(start,end){
            
            var count = 0;
            
            var startPart = start.split("-");
            var curDate = new Date(startPart[0], startPart[1] - 1, startPart[2]);
            
            var endPart = end.split("-");
            var endDate = new Date(endPart[0], endPart[1] - 1, endPart[2]);
            
            //console.log(curDate);
            //console.log(endDate);
            
            while (curDate <= endDate) {
                var dayOfWeek = curDate.getDay();
                if(!((dayOfWeek == 6) || (dayOfWeek == 0)))
                   count++;
                curDate.setDate(curDate.getDate() + 1);
            }
            return count - 1;
            
        },
        dtCreate: function(obj){
            test.oTable = $('#dataTable').DataTable(obj);
            var total = test.oTable.context[0]._iDisplayLength;
            $( test.oTable.table().container() ).on( 'keyup', 'thead input', function (e) {
                test.oTable
                    .column( $(this).data('index') )
                    .search( this.value )
                    .draw();
                    e.stopPropagation();
            });
        },
        ucwords: function(str){
            var str = str.toLowerCase();
            return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                return $1.toUpperCase();
            });
        },
        stopPropogation: function(evt){
            if (evt.stopPropagation !== undefined) {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }
        },
        fetchData: function(){
            $.ajax({
                type: 'post',
                url: '/tests/apiFetchData',
                success: function(response){
                    //console.log(response);
                    test.dtData = response;
                    
                }
            });
        },
        clearState: function(){
            $.ajax({
                type: 'post',
                url: '/tests/clearSearchSession',
                success: function(response){
                    test.oTable.state.clear();
                    window.location.reload();
                }
            });
        },
        resetFilter: function(){
//            $.ajax({
//                type: 'post',
//                url: '/properties/apiResetFilter',
//                data: {reset:true},
//                success: function(response){
//                    console.log(response);
//                }
//            });
        }
    };
}($));
$(window).load(function() {test.init();});