var files = (function($){
    return{
        cntUrl: window.location.origin+"/files/",
        init: function(callback) {
            var movedFile;
            files.redipsInit();
            if (window.addEventListener) {
                window.addEventListener('load', files.redipsInit, false);
            }else if (window.attachEvent) {
                window.attachEvent('onload', files.redipsInit);
            }
            files.getNewFiles();
            files.getSavedFiles();
            files.getPhotos();
            //files.getOldFiles();
            var dz = new Dropzone("#newFileDropArea", {url: "/file-upload-dropped"});//media controller upload function
            var dp = new Dropzone("#photoFileDropArea", {
                url: "/photo-upload-dropped",
                dictDefaultMessage: 'Drop photos here'
            });//media controller upload function
            dz.uploadMultiple = true;
            dp.uploadMultiple = true;
            dz.on("success", function(file,response) {
                $('.dz-preview').html('');
                files.getNewFiles();
            });
            dp.on("success", function(file,response) {
                $('.dz-preview').html('');
                files.getPhotos();
                
            });
            $(document).on('change','.brkr_checkbox',function(){
                if($(this).is(':checked')){
                    var old_file = $(this).attr('data-rel-id');
                    files.addBrkrCheck(old_file);
                    files.getSavedFiles();
                    //rename file brkr1
                }else{
                    var old_file = $(this).attr('data-rel-id');
                    files.removeBrkrCheck(old_file);
                    files.getSavedFiles();
                    //console.log(this);
                    //rename file brkr0
                }
            });
        },
        addBrkrCheck: function(old_file){
            $.ajax({
                type: 'post',
                url: '/file-api_add_brkr_check',
                data: {old_file:old_file},
                success: function(response){
                    console.log(response);
                    
                }
            });
        },
        removeBrkrCheck: function(old_file){
            $.ajax({
                type: 'post',
                url: '/file-api_remove_brkr_check',
                data: {old_file:old_file},
                success: function(response){
                    console.log(response);
                }
            });
        },
        moveFile: function(property_id,source,target){
            $.ajax({
                type: 'post',
                url: '/file-api_move_file',
                data: {property_id:property_id,source:source,target:target},
                success: function(response){
                    files.getSavedFiles();
                    REDIPS.drag.init();
                }
            });
        },        
        redipsInit: function(){
            var	rd = REDIPS.drag,
                msg = document.getElementById('message'),
                table_content;
            rd.init();
            rd.dropMode = 'overwrite';
            rd.event.dropped = function () {
                var property_id = $('#property_id').val();
                var source = files.movedFile;
                var target = $(rd.td.current).attr('data-rel-id');
                if(typeof target === 'undefined'){
                    return false;
                };
                files.moveFile(property_id,source,target);
                setTimeout(function(){
                    files.getNewFiles();
                },500);
            };
            rd.event.clicked = function () {
		var t = rd.obj;
                files.movedFile = $(t).attr('data-rel-id');
                //alert(files.movedFile);
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
                        files.getNewFiles();
                        REDIPS.drag.init();
                    }
                });
            };
        },        
        getNewFiles: function(){
            var property_id = $.trim($('#property_id').val());
            var csh_id = $('#csh_id').val();
            if(csh_id.length  > 0){
                //colony id exists change all the paths for colony
                var url = window.location.origin + '/file-get_new_csh_files';
                $.ajax({
                    type: 'post',
                    url: url,
                    data: {csh_id:csh_id},
                    success: function(res){
                        //console.log('::::' + res);
                        $('#fileList').html(res);
                        REDIPS.drag.init();
                    }
                });
                
            }else{
                //not colony
                var url = window.location.origin + '/file-get_new_files';
                $.ajax({
                    type: 'post',
                    url: url,
                    data: {property_id:property_id},
                    success: function(res){
                        //console.log('::::' + res);
                        $('#fileList').html(res);
                        REDIPS.drag.init();
                    }
                });
            }
            
        },
        getPhotos: function(){
            var property_id = $.trim($('#property_id').val());
            var url = window.location.origin + '/get_photos';
            //console.log('URL: ' + url);
            $.ajax({
                type: 'post',
                url: url,
                data: {property_id:property_id},
                success: function(res){
                    $('#images').html(res);
                    //REDIPS.drag.init();
                    var width = $('#images').width();
                    var cnt = Math.floor(width/100);
                    var mod = width - (cnt * 9);
                    var nw = mod / cnt;
                    $('.image').width(nw);
                }
            });
        },
        getSavedFiles: function(){
            var property_id = $.trim($('#property_id').val());
            var model = $.trim($('#model').val());
            var address = $.trim($('#wasaddress').text());
            var url = window.location.origin + '/file-get_saved_files';
            
            
            $.ajax({
                type: 'post',
                url: url,
                data: {property_id:property_id,address:address,model:model},
                success: function(res){
                    $('#savedFiles').html(res);
                    REDIPS.drag.init();
                }
            });
        },
//        getEditedFiles: function(){
//            var property_id = $.trim($('#property_id').val());
//            var address = $.trim($('#address').text());
//            var url = window.location.origin+'/file-get_edited_files';
//            $.ajax({
//                type: 'post',
//                url: url,
//                data: {property_id:property_id,address:address},
//                success: function(res){
//                    console.log(res);
//                    $('#editedFiles').html(res);
//                    REDIPS.drag.init();
//                }
//            });
//        }
    };
}($));
$(window).load(function() {
   files.init(); 
});