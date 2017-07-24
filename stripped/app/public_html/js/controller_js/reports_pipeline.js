var pipeline = (function($) {
    return {
        url: window.location.origin+"/reports/",
        //properties: null,
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            
            
            
            $("#startDate, #endDate").on('focus',function(e){
                $("#header").css('z-index',500);
                e.preventDefault();
            });
            
            $("#startDate").datepicker({
                format: "yyyy-mm-dd",
                todayBtn: true,
                autoclose: true,
                todayHighlight: true,
                clearBtn: true,
                endDate: $('#endDate').val()
            }).on('changeDate',function(e){
                var start = $('#startDate').val();
                var end   = $('#endDate').val();
                window.location.href = '/reports/pipeline/' + start + '/' + end;
            });
            
            $("#endDate").datepicker({
                format: "yyyy-mm-dd",
                todayBtn: true,
                autoclose: true,
                todayHighlight: true,
                clearBtn: true,
                startDate: $('#startDate').val()
            }).on('changeDate',function(e){
                var start = $('#startDate').val();
                var end   = $('#endDate').val();
                window.location.href = '/reports/pipeline/' + start + '/' + end;
            });

            
        }
    };
}($));
$(window).load(function() {pipeline.init();});