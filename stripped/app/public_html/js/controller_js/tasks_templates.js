var datatableController = {
    contUrl: window.location.origin + "/tasks",
    addUrl: "/api_add",
    indexUrl: "/api_list",
    delUrl: "/api_delete",
    statusUrl: "/api_getStatus",
    pstatus: null,
    sstatus: null,
    dtTable: null,
    dtSettings: null,
    init: function() {
        this.__proto__ = Pankaj;
        this.bindAll();        
        this.listener();
        this.loadStatus();
    },
    listener: function() {
        $(document).on('click', '#addNewTask', this.addNewTask);
        $("#TaskType").change(this.getStatus);
        $("#TaskIndexForm").submit(this.saveTask);
        $(document).on('click', '.deletthirow', this.deleteRow);
        $(document).on('click', '.editthirow', this.editRow);
    },
    datatable: function() {
        var self = this;
        debug(self.pstatus);
        this.dtTable = $('#inboxTable').dataTable({
            dom            : '<"toolbar">',
            destroy        : true,
            processing     : true,
            serverSide     : true,
            ajax           : {
                url: self.contUrl + self.indexUrl
            },
            columns        : [
                {
                    data: 'id',
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html(oData.id+"<input type='hidden' value='"+oData.id+"' class='id'>");
                    }
                },
                {
                    data:'name',
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html(oData.name+"<input type='hidden' value='"+oData.name+"' class='name'>");
                    }
                },
                {
                    data:'type',
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        var type = "Purchase Status";
                        if( oData.type ==  1 ) {
                            type = "Sale Status";
                        }
                        $(nTd).html(type+"<input type='hidden' value='"+oData.type+"' class='type'>");
                    }
                },
                {
                    data: 'status_id',
                    fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                        var status = "";
                        if( oData.type ==  1 ) {
                            status = self.sstatus[oData.status_id];
                        } else {
                            status = self.pstatus[oData.status_id];
                        }
                        $(nTd).html(status+"<input type='hidden' value='"+oData.status_id+"' class='status'>");
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
                                'class="btn btn-o btn-green editthirow"><span class="fa'+
                                'fa-edit"></span>Edit</a>'+
                                '<a href="javascript:void(0)"'+
                                'class="btn btn-o btn-red deletthirow"><span class="'+
                                'glyphicon glyphicon-remove-circle"></span>Delete</a>';
                        return action_html_edit;
                    }
                }
            ]
        });
        self.addCustomControl();
        self.dtSettings = self.dtTable.fnSettings();
    },
    addCustomControl: function() {
        var template = '<div style="padding-left: 10px;padding-top: 10px;">\
            <button id="addNewTask">Add</button>\
        </div>';
        $('div.toolbar').html(template);
    },
    addNewTask: function() {
        debug('open model');
        $("#add_edit_task").modal("show");
    },
    getStatus: function() {
        var self = datatableController;
        var type = $(this).val();
        if( type == 0 && self.pstatus === null ) {
            //pstatus ajax
            self.httpAPI(self.contUrl+self.statusUrl+"/"+type, "GET", {}, "json", function(data) {
                self.addDropdownOption(data, "#TaskStatusId");
            });
        } else if( type == 0 && self.pstatus != null ) {
            //pstatus local
            self.addDropdownOption(self.pstatus, "#TaskStatusId");
        } else if( type == 1 && self.sstatus === null ) {
            //status ajax
            self.httpAPI(self.contUrl+self.statusUrl+"/"+type, "GET", {}, "json", function(data) {
                self.addDropdownOption(data, "#TaskStatusId");
            });
        } else {
            //sstatus local
            self.addDropdownOption(self.sstatus, "#TaskStatusId");
        }
    },
    loadStatus: function() {
        var self = this;
        if( this.pstatus === null ) {
            //pstatus ajax
            self.httpAPI(self.contUrl+self.statusUrl+"/0", "GET", {}, "json", function(data) {
                self.pstatus = data;
                self.addDropdownOption(data, "#TaskStatusId");
                if( self.sstatus === null ) {
                    //status ajax
                    self.httpAPI(self.contUrl+self.statusUrl+"/1", "GET", {}, "json", function(data) {
                        self.sstatus = data;
                        self.datatable();
                    });
                }
            });
        } else {
            if( self.sstatus === null ) {
                //status ajax
                self.httpAPI(self.contUrl+self.statusUrl+"/1", "GET", {}, "json", function(data) {
                    self.sstatus = data;
                    self.datatable();
                });
            }
        }
    },
    saveTask: function(e) {
        e.preventDefault();
        var self = datatableController;
        var formurl = self.contUrl+self.addUrl;
        var data = $(this).serialize();
        var form = $(this);
        $.ajax({
          url: formurl,
          type: "POST",
          dataType: 'json',
          data: data,
          success: function(response){
              if( response.status == "success" ) {
                    form.find('#TaskName').val('');
                    form.find('#TaskId').val('');
                    $("#add_edit_task").modal("hide");
                    self.refreshDt();
                    alert(response.message);
              } else {
                  alert(response.message);
              }
          },
          cache: false
        });
    },
    deleteRow: function() {
        var conf = confirm('Do you really want to delete it?');
        if(conf) {
            var self = datatableController;
            var id = $.trim($(this).closest('tr').find('td input.id').val());
            var url = self.contUrl + self.delUrl + "/" + id;
            $.get(url, function(response) {
                if( response.status == "success" ) {
                    self.refreshDt();                
                    //alert
                    alert(response.message);
                } else {
                    alert(response.message);
                }
            });
        }      
    },
    editRow: function() {
        var object = $(this);
        var tr     = object.closest('tr');
        var id     = tr.find('input.id').val();
        var name   = tr.find('input.name').val();
        var type   = tr.find('input.type').val();
        var status = tr.find('input.status').val();
        var form   = $("#TaskIndexForm");
        var self   = datatableController;
        
        form.find("#TaskId").val(id);
        form.find('#TaskName').val(name);
        form.find('#TaskType').val(type);
        if( type == 0 ) {
            self.addDropdownOption(self.pstatus, "#TaskStatusId", function() {
                form.find('#TaskStatusId').val(status);
            });
        } else if( type == 1 ) {
            self.addDropdownOption(self.sstatus, "#TaskStatusId", function() {
                form.find('#TaskStatusId').val(status);
            });
        }
        $("#add_edit_task").modal("show");
    },
    refreshDt: function () {
        this.dtTable._fnAjaxUpdate();
    }
};
$(window).load(function() {
   datatableController.init(); 
});