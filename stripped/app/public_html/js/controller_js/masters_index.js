var mydatatable=null, dtsettings=null, childRows=[];
var sourceUrl = window.location.search + "/masters/api_index";
var dtCustomVars = {
    default: 0
};

//once window loaded successfully
$(document).ready(function () {
    
    $(document).on('click', '#inboxTable tbody tr', function () {
        var id = $(this).attr('id');
        $("tr.child-" + id).toggle();
    });    
    
    mydatatable = $('#inboxTable').dataTable({
            dom            : '<"toolbar">',
            destroy        : true,
            processing     : true,
            serverSide     : true,
            ajax           : {
                url: sourceUrl,
                data: dtCustomVars
            },
            columns        : [
                {
                    data: 'id',
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html(oData.id+"<input type='hidden' value='"+oData.id+"' class='idd'>");
                    }
                },
                {
                    data:'name',
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html(oData.name+"<input type='hidden' value='"+oData.name+"' class='name'>");
                    }
                },
                {
                    data:'parent_id',
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        if(oData.parent_id == null || oData.parent_id == undefined) {
                            oData.parent_id = 0;
                        }
                        $(nTd).html(oData.parent_id+"<input type='hidden' value='"+oData.parent_id+"' class='parent'>");
                    }
                },
                {
                    data: 'system_id',
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html(oData.system_id+"<input type='hidden' value='"+oData.system_id+"' class='system'>");
                    }
                },
                {
                    data: 'created'
                },
                {
                    data: 'modified'
                },
                {
                    data: 'action',
                    orderable: false,
                    render: function() {
                        var action_html_edit = '<a href="javascript:void(0)"'+
                                'class="btn btn-o btn-green" onclick="editThisRow(this);"><span class="fa'+
                                'fa-edit"></span>Edit</a>'+
                                '<a href="javascript:void(0)"'+
                                'class="btn btn-o btn-red" onclick="deleteThisRow(this);"><span class="'+
                                'glyphicon glyphicon-remove-circle"></span>Delete</a>';
                        return action_html_edit;
                    }
                }
            ],
            fnRowCallback: function (nRow, aData, iDisplayIndex) {
                debug($(nRow));
                console.log(nRow);
                debug(aData);
                var idd = Pankaj.randStr();
                $(nRow).attr("id", idd);
                if( aData.child !== undefined && aData.child != null ) {
                    var TTR = "";
                    $(aData.child).each(function(i, v) {
                        if(v.parent_id == null || v.parent_id == undefined) {
                            v.parent_id = 0;
                            }
                        
                        var action_html_edit = '<a href="javascript:void(0)"'+
                                'class="btn btn-o btn-green" onclick="editThisRow(this);"><span class="fa'+
                                'fa-edit"></span>Edit</a>'+
                                '<a href="javascript:void(0)"'+
                                'class="btn btn-o btn-red" onclick="deleteThisRow(this);"><span class="'+
                                'glyphicon glyphicon-remove-circle"></span>Delete</a>';

                        var TR = '<tr class="child-'+idd+'">';
                        TR += "<td>&nbsp;&nbsp;&nbsp;&nbsp;"+v.id+"<input type='hidden' value='"+v.id+"' class='idd'></td>";
                        TR += "<td>"+v.name+"<input type='hidden' value='"+v.name+"' class='name'></td>";
                        TR += "<td>"+v.parent_id+"<input type='hidden' value='"+v.parent_id+"' class='parent'></td>";
                        TR += "<td>"+v.system_id+"<input type='hidden' value='"+v.system_id+"' class='system'></td>";
                        TR += "<td>"+v.created+"</td>";
                        TR += "<td>"+v.modified+"</td>";
                        TR += "<td>"+action_html_edit+"</td>";
                        TR += "</tr>";
                        
                        TTR += TR; 
                    });
                    childRows.push({
                        html: TTR,
                        id: idd
                    });
                }
                return nRow;
            },
            fnDrawCallback: function() {
                if(childRows.length > 0) {
                    $(childRows).each(function (i, v) {
                        var tr = $("tr#"+v.id)
                        tr.after(v.html);
                    });
                    
                    childRows = [];
                }
            }
    });
    
    dtsettings = mydatatable.fnSettings();
    $("div.toolbar").html('<button onclick="addNewMaster();" >ADD</button>');
    $("#MasterIndexForm").submit(function(e) {
        e.preventDefault();
        var formurl = $(this).attr('action');
        var data = $(this).serialize();
        $.ajax({
          url: formurl,
          type: "POST",
          dataType: 'json',
          data: data,
          success: function(response){
              if( response.status == "success" ) {
                    alert(response.message);
                    refreshDt();
              } else {
                  alert(response.message);
              }
          },
          cache: false
        });
    });
    
    $("#MasterParentId").change(function() {
        var optionsv = $(this).val();
        
        if( optionsv == 0 ) {
            $("#systemIdInput").show();
            $("#MasterSystemId").val('');
            
            if($("#MasterId").val() != "" && $("#MasterId").val() != 0) {
                var id = $("#MasterId").val();
                var system  = $("input.idd[value='"+id+"']").closest('tr').find("input.system").val();
                if( system != 0 ) {
                    $("#MasterSystemId").val(system);
                }
            }
        } else {
            $("#systemIdInput").hide();
            $("#MasterSystemId").val(0);
        }
    });
});

function deleteThisRow(object) {
    var conf = confirm('Do you really want to delete it?');
    if(conf) {
        var id = $.trim($(object).closest('tr').find('td input').val());
        var url = window.location.search + "/masters/api_delete/"+id;
        $.get(url, function(response) {
            if( response.status == "success" ) {
                updateParents(response.data);
                $('.modal').modal('hide');
                //function to reload table
                refreshDt();                
                //alert
                alert(response.message);
            } else {
                alert(response.message);
            }
        });
    }    
}

function editThisRow(object) {
    var id = $.trim($(object).closest('tr').find('td input.idd').val());
    var name = $.trim($(object).closest('tr').find('td input.name').val());
    var parent = $.trim($(object).closest('tr').find('td input.parent').val());
    var system = $.trim($(object).closest('tr').find('td input.system').val());
    var formId = $("#MasterIndexForm");
    formId.closest('div.panel').find('div.panel-heading').html('Edit Master');
    formId.find('input#MasterId').val(id);
    formId.find('input#MasterName').val(name);
    formId.find('input#MasterSystemId').val(system);
    formId.find('select#MasterParentId').val(parent);
    if( parent == 0 ) {
        $("#systemIdInput").show();
        if( system != 0 ) {
            $("#MasterSystemId").val(system);
        } else {
            $("#MasterSystemId").val('');
        }
    }
    $("#add_edit_master").modal("show");
}

function addNewMaster() {
    var formId = $("#MasterIndexForm");
    formId.closest('div.panel').find('div.panel-heading').html('Add Master');
    formId.find('input#MasterId').val('');
    formId.find('input#MasterName').val('');
    formId.find('select#MasterParentId').val(0);
    $("#add_edit_master").modal("show");
}

function updateParents(data){
    var options = "";
    if(data !== undefined || data !== null) {
        data.forEach(function(v, i) {
            options = options + "<option name='data[Master]['parent_id']' value='"+i+"'>"+v+"</option>";
        });
        $('select#MasterParentId').html(options);   
    }
}

function refreshDt() {
    mydatatable._fnAjaxUpdate();
}