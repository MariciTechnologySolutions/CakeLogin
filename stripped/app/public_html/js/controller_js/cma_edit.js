var comp = (function($) {
    return {
        init: function() {
            
            var leftColumn  = $('.leftColumn').height();
            $('.rightColumn').height(leftColumn);
            var panelHeader = $('.panelHeader').height();
            $('.panelBody').height(leftColumn -  panelHeader - 30);
            
            comp.loadData();
            

            
            
            $('#searchSave').on('click',function(e){
                
                var mls_data_id = $('#property_id').val();
                
                var search = $('#searchForm').serialize();
                
                search = search.replace('property_id=' + mls_data_id + '&','',search);
                
                
                
                $.ajax({
                    type: 'post',
                    url: '/cma/ajaxSaveCmaDefaultSearchCriteria',
                    data: {search:search,mls_data_id:mls_data_id},
                    success: function(response){
                        comp.loadData();
                        
                        var g = $.growl.notice({ title: "Success", message: "Current Search Saved as Default." });
                        
                        setTimeout(function(){
                            $('#growls').remove();
                        },5000);
                    }
                });
                
                e.preventDefault();
            });
            
            $('#searchReset').on('click',function(e){
                
                var mls_data_id = $('#property_id').val();
                
                $.ajax({
                    type: 'post',
                    url: '/cma/ajaxResetToCmaDefaultSearchCriteria',
                    data: {mls_data_id:mls_data_id},
                    success: function(response){
                        comp.loadData();
                        
                        var g = $.growl.notice({ title: "Success", message: "Default Search Criteria Reset" });
                        
                        setTimeout(function(){
                            $('#growls').remove();
                        },5000);
                    }
                });
                
                
                
                e.preventDefault();
            });
            
                
                
            $('#searchSubmit').on('click',function(e){
                
                var mls_data_id = $('#property_id').val();
                var search = $('#searchForm').serialize();
                
                $.ajax({
                    type: 'post',
                    url: '/cma/ajaxUpdateSearchCriteria',
                    data: {mls_data_id:mls_data_id,search:search},
                    success: function(response){
                        comp.loadData();
                        
                    } 
                });
                
                
                e.preventDefault();
            });
            
             
            
        },
        loadData: function(){
            var mls_data_id = $('#property_id').val();
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/cma/ajaxGetDataFromSession',
                data: {mls_data_id:mls_data_id},
                success: function(response){
                    
                    comp.loadSearchForm(response.search)
                    
                    $('#propertiesFound').html('updating');
                    
                    var out = '<span style="font-size: 1.4em; font-weight: bold; padding: 10px">';
                    out += response.filteredComps.length;
                    out += ' Properties Found Matching Your Criteria.';
                    out += '</span>';
                    
                    
                    if(response.filteredComps.length > 0){
                    
                        out += '<span style="font-size: 1.1em; font-weight: italic">';
                        out += '<div style="" class="list-group">';
                        out += '<a href="/cma/index" class="list-group-item">Click Here To List All Properties</a>';
                        out += '<a href="/cma/map" class="list-group-item">Click Here To Map All Properties</a>';
                        out += '</div>';
                        out += '</span>';
                    
                    }else{
                        out += '<span style="font-size: 1.1em; font-weight: italic">';
                        out += '<div style="" class="list-group">';
                        out += '<div class="list-group-item" style="font-weight: bold">Sorry. Try casting a wider net!</div>';
                        out += '</div>';
                        out += '</span>';
                    }
                    
                    $('#propertiesFound').html(out);
                    
                }
            });
        },
        loadSearchForm: function(criteria){
            
            $.each(criteria.split('&'), function (index, elem) {
                var vals = elem.split('=');
                $("[name='" + vals[0] + "']").val(decodeURIComponent(vals[1].replace(/\+/g, ' ')));
                //handle checkboxes
                if(vals[1] == 'checked'){
                    $('#' + vals[0]).prop('checked',true);
                }
            });
            //now check if we want to match subject and set the form to match subject values
            $.each(criteria.split('&'), function (index, elem) {
                var vals = elem.split('=');
                if(vals[0] == 'match_subject_config'){
                    comp.setSearchFormMatchSubjectConfig();
                }
            });
            
        },
        setSearchFormMatchSubjectConfig: function(){
            
            var subjectPropertyData = JSON.parse($('#subjectData').text());
            
            var criteria = new Array();
            
            var bedrooms  = subjectPropertyData['bedrooms'];
            var bathrooms = subjectPropertyData['bathrooms'];
            var parking   = subjectPropertyData['parking'];
            var level     = subjectPropertyData['level'];
            
            $('#bed-min').val(bedrooms);
            $('#bed-max').val(bedrooms);
            $('#bath-max').val(bathrooms);
            $('#bath-min').val(bathrooms);
            $('#parking-min').val(parking);
            $('#parking-max').val(parking);
            $('#level-max').val(level);
            $('#level-min').val(level);
            
        }
    };
}($));
$(window).load(function() {comp.init();});