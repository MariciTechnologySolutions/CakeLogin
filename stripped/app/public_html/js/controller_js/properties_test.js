var properties = (function($) {
    return {
        Url: window.location.origin+"/properties/test",
        sortsalea:[],
        sortpurchasea: [],
        mlsstatus: [],
        fieldQuery: [],
        datasource: '',
        
        init: function() {
//            this.__proto__ = Pankaj;
//            this.initialize();
//            this.eventHandlers();
            $('.handleFilter').click(function () {
                $('.filterForm').slideToggle(200);
            });
            //on page load
            properties.apiDataSource();
            properties.apiMlsStatus();
            properties.apiPurchaseStatus('get');
            properties.apiSaleStatus('get');
            properties.apiFieldQuery('get');
            
            $("#datasource_id").on('change',function(){
                properties.apiDataSource();
            });
            
            $('.query').on('blur',function(){
                var data = $('#fieldQuery').serialize();
                properties.fieldQuery = data;
                properties.apiFieldQuery('set');
            });
            
            $('#getQuery').on('click',function(){
                window.location.reload();
            });
            
        },
        apiMlsStatus: function(data){
            $.ajax({
                type: 'post',
                url: '/properties/apiMlsStatus',
                data: {data:data},
                success: function(response){
                    //console.log(response);
                    var taggs = response.replace("@mlsstatus", "").split("-");
                    properties.mlsstatus = taggs;
                    $.each(taggs, function(i, t) {
                        $("a[data-rel-type='mlsstatus'][data-rel-id='"+t+"']").addClass('btn-success').removeClass('btn-default');
                    });
                    
                }
            });
        },
        apiPurchaseStatus: function(type){
            
            if(type == 'get'){
                var pstat = 'get';
                
            }else{
                //called with set
                var pstat = properties.sortpurchasea.join('-');
            }
            
                
            $.ajax({
                type: 'post',
                url: '/properties/apiPurchaseStatus',
                data: {pstat:pstat},
                success: function(response){
                    //properties.output(response);

                    var taggs = response.split("-");
                    properties.sortpurchasea = taggs;
                    $.each(taggs, function(i, t) {
                        $("a[data-rel-type='purchase'][data-rel-id='"+t+"']").addClass('btn-info').removeClass('btn-default');
                        //debug("activating tag => "+t);
                    });
                    
                }
            });

        },
        apiSaleStatus: function(type){
            
            if(type == 'get'){
                var sstat = 'get';
                
            }else{
                //called with set
                var sstat = properties.sortsalea.join('-');
            }
                
            $.ajax({
                type: 'post',
                url: '/properties/apiSaleStatus',
                data: {sstat:sstat},
                success: function(response){
                    //properties.output(response);

                    var taggs = response.split("-");
                    properties.sortsalea = taggs;
                    $.each(taggs, function(i, t) {
                        $("a[data-rel-type='sale'][data-rel-id='"+t+"']").addClass('btn-info').removeClass('btn-default');
                        //debug("activating tag => "+t);
                    });
                    
                }
            });
        },
        apiFieldQuery: function(type){
            
            var data = properties.fieldQuery;
            if(type == 'get'){var data = 'get';}//overwrite if 'get' for controller conditions
            
            $.ajax({
                type: 'post',
                url: '/properties/apiFieldQuery',
                data: {data:data},
                success: function(response){
                    var arr = response.split('&');
                    //break into each field
                    $.each(arr, function(i, t) {
                        //i: index t: field=value
                        var k = t.split('=');
                        if(k[1].length > 0){
                            //console.log(k[0] + ' = ' + k[1]);
                            $("input[name='" + k[0] + "']").val(k[1]);
                        }
                        
                    });
                    
                }
            });
        },
        mlsStatusFilter: function(object){
            //called on click from view page.
            
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
            
            var data = "@mlsstatus"+properties.mlsstatus.join('-');
            properties.apiMlsStatus(data)
        },
        statusfilter: function (object) {
            //Called on click from inline js
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
            //properties.output(properties.sortpurchasea);
            properties.apiPurchaseStatus('set');
            properties.apiSaleStatus('set');
        },
        apiDataSource: function(){
            
            var datasource = $("#datasource_id").val();
            
            $.ajax({
                type: 'post',
                url: '/properties/apiDataSource',
                data: {datasource:datasource},
                success: function(response){
                    $("#datasource_id").val(response);
                    //properties.output(response);
                }
            });
             
            $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > button > span.filter-option.pull-left').text(datasource);
            
            if(datasource == 'All'){
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(1)').addClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(2)').removeClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(3)').removeClass('active selected');
            }
            
            if(datasource == 'MlsPhoenix'){
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(1)').removeClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(2)').addClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(3)').removeClass('active selected');
            }
            
            if(datasource == 'MlsLasvegas'){
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(1)').removeClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(2)').removeClass('active selected');
                $('#content > div.filter > form > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(3)').addClass('active selected');
            }
        },
        resetFilter: function(){
            $.ajax({
                type: 'post',
                url: '/properties/apiResetFilter',
                data: {reset:true},
                success: function(response){
                    console.log(response);
                }
            });
        },
        output: function(data){
            $('#output').html(data);
        },
    };
}($));
$(window).load(function() {properties.init();});