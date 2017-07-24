var map = (function($) {
    return {
        url: window.location.origin+"/rets/",
        target: '',
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            $('.table-overflow').height($('.inner-content').height() - 120).css({'overflow-y':'scroll'});

            $('#searchTable1').on('keyup',function(){
                var search = $(this).val().toLowerCase();
                $('#table1 tr').filter(function(){
                    var t = $(this).text().toLowerCase();
                    if(t.indexOf(search) !== -1){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                });
                REDIPS.drag.init();
            });
            
            $('#searchTable2').on('keyup',function(){
                var search = $(this).val().toLowerCase();
                $('#table2 tr').filter(function(){
                    var t = $(this).text().toLowerCase();
                    if(t.indexOf(search) !== -1){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                });
                REDIPS.drag.init();
            });
            
            
            
            map.redipsInit();
            if (window.addEventListener) {
                window.addEventListener('load', map.redipsInit, false);
            }else if (window.attachEvent) {
                window.attachEvent('onload', map.redipsInit);
            }
            map.buildTargetTable();
            map.buildRetsTable();
//            if (window.addEventListener) {
//                window.addEventListener('load', map.redipsInit, false);
//            }else if (window.attachEvent) {
//                window.attachEvent('onload', map.redipsInit);
//            }
        },
        redipsInit: function(){
            var	rd = REDIPS.drag,
                msg = document.getElementById('message'),
                table_content;
            rd.init();
            rd.dropMode = 'single';
            rd.event.dropped = function () {
                
                var source = map.target;
                var target = $(rd.td.current).attr('data-rel-id');
                debug(source + ' was dropped on: ' + target);
                if(typeof target === 'undefined'){
                    return false;
                };
                $.ajax({
                    type: 'post',
                    url: '/rets/phoenix/apiMapItem',
                    data: {source:source,target:target},
                    success: function(response){
                        debug(response);
                        window.location.reload();
                    }
                });
                //map.moveFile(property_id,source,target);
                setTimeout(function(){
                    //map.getNewFiles();
                    //debug('wtf');
                },500);
            };
            rd.event.clicked = function () {
		var t = rd.obj;
                map.target = $(t).attr('data-rel-id');
                debug(map.target);
                //alert(files.target);
            };
            rd.event.deleted = function(){
                var property_id = $('#property_id').val();
                var obj = rd.obj;
                var file = $(obj).attr('data-rel-id');
                $.ajax({
                    type: 'post',
                    url: '/file-api_delete_file',
                    data: {property_id:property_id,file:file},
                    success: function(response){
                        //map.getNewFiles();
                        REDIPS.drag.init();
                    }
                });
            };
        },          
        buildTargetTable: function(){
            $.ajax({
                type: 'post',
                url: '/rets/phoenix/builtTargetTable',
                success: function(response){
                    $('#right').html(response);
                    REDIPS.drag.init();
                    
                }
            });
        },
        buildRetsTable: function(){
            $.ajax({
                type: 'post',
                url: '/rets/phoenix/buildRetsTable',
                success: function(response){
                    $('#left').html(response);
                    REDIPS.drag.init();
                }
            });
        },
    };
}($));
$(window).load(function() {map.init();});