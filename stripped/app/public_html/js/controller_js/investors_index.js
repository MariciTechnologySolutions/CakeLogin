var investors = (function($){
    return{
        cntUrl: window.location.origin+'/investors/',
        out: '',
        init: function(callback) {
            investors.__proto__ = Pankaj;
            //$('#edit_investor').modal('show');
            investors.initialize();
            $('#inboxTable').DataTable({
                "pageLength": 25,
                "drawCallback":function(){
                    //investors.tagFormat();
                }
            });
            $('#inboxTable').on('click','.edit-investor',function(){
                var id = $(this).attr('id');
                console.log(id);
                investors.getInvestor(id);
                
            })
            $('.tagCheckbox').on('change',function(){
                var tag = $(this).attr('data-rel');
                
                $.ajax({
                    type: 'post',
                    //dataType: 'json',
                    url: '/investors/apiTagSearch',
                    data: {tag:tag},
                    success: function(response){
                        console.log(response);
                        $('.tagCheckbox').each(function(){
                            var t = $(this).attr('data-rel');
                            a = response.indexOf(t);
                            if(a !== -1){
                                $(this).checked = true;
                            }else{
                                $(this).checked = false;
                            } 
                      });
                      //window.location.reload();
                    }
                });
                
                
            });
            $('#clearTags').on('click',function(){
                investors.clearTags();
            });
            $('#newTagButton').on('click',function(e){
                var tag = $('#newTag').val();
                if(tag.length > 3)
                investors.newTag(tag);
                e.preventDefault();
            });
            $('.sortable').sortable({
                update: function(evt, ui) {
//                    console.log($(this).sortable('toArray').toString());
                    
                    $.ajax({
                        type: 'post',
                        url: '/investors/apiSortTags',
                        data: {data:$(this).sortable('toArray').toString()},
                        success: function(response){
                            console.log(response);
                        }
                    });
                }
            });
            $('#investorDelete').on('click',function(e){
                var id = $('#investor_id').val();
                $.ajax({
                    type: 'post',
                    url: '/investors/apiDeleteInvestor',
                    data: {id:id,deleted:1,unsubscribed:1},
                    success: function(response){
                        console.log(response);
                        window.location.reload();
                    }
                });
                
                e.preventDefault();
            });
        },
        newTag: function(tag){
            $.ajax({
                type: 'post',
                url: '/investors/apiAddTag',
                data: {tag:tag},
                success: function(response){
//                    console.log(response);
                    window.location.reload();
                    
                }
            });
        },
        clearTags: function(){
            $.ajax({
                type: 'post',
                url: '/investors/apiClearTags',
                data: {i:1},
                success: function(response){
//                    console.log(response);
                    window.location.reload();
                    
                }
            });
        },
        tagFormat: function(){
            $('#inboxTable .tag-text').each(function(index,value){
                
                var t = $(value).text();
                console.log(t);
                //var text = JSON.parse(t);
                
                investors = new Array();
                
//                $.each(text,function(k,v){
//                    if(v > 2){
//                        //investors.out += '<button class="btn btn-xs btn-blue" style="margin-left: 5px;margin-bottom: 2px">' + k.replace('_',' ') + '</button><span style="color:white">,</span>';
//                        investors.push = k.replace('_',' ');
//                    }
//                });
//                console.log(investors.trim());
//                //var newString = investors.out.substr(0, investors.out.length-2);
//                $(this).html(investors);
                
            });
        },        
        getInvestor: function(id){
            $.ajax({
                url: investors.cntUrl + 'api_get_investor/' + id,
                dataType: 'json',
                type: 'get',
                success: function(data){
                    
                    console.log(data);
                    
                    $('#edit_investor').modal('show');
                    $('#investor_id').val(data.Investor.id);
                    $('#investor_name').val(data.Investor.name);
                    $('#investor_phone').val(data.Investor.phone);
                    $('#investor_email').val(data.Investor.email);
                    $('#note').val(data.Investor.note);
                    
                    
//                    console.log(data.Investor.tags);
                    if(data.Investor.tags !== null){
                        var tags = data.Investor.tags.split(',');

                        $.each(tags,function(i,item){
                            var tag = 'inv-' + item.replace(' ','-');
                            console.log(tag);
                            $('#' + tag).attr('checked','checked');
                        });
                    }
                    
                }
            });
        },
    };
}($));
$(window).load(function() {
   investors.init(); 
});