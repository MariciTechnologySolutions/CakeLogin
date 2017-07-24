var calendar = (function($) {
    return {
        height: 0,
        buyer_id: 0,
        init: function() {
            this.__proto__ = Pankaj;
            this.initialize();
            
            var path = window.location.pathname;
            path = path.replace(/^\//, '');
            path = path.split('/');
            //console.log(path);
            
            
            
            if(path[3] != undefined){
               setInterval(function(){
                    window.location.reload();
                },path[3] * 1000);
            }
            
            if(path[2] != undefined){
               calendar.buyer_id = path[2];
            }
            
            $('#calendar').fullCalendar({
               height: 850,
               events: function(start, end, timezone, callback) {
                    $.ajax({
                        type: 'post',
                        url: '/dashboard/ajaxGetCalendarItems',
                        dataType: 'json',
                        data: {buyer_id:calendar.buyer_id},
                        success: function(doc) {
                            //console.log(doc);
                            callback(doc.events);
                        }
                    });
                },
                editable: true,
                eventDrop: function(event, delta, revertFunc) {

                    var pid = event.id;
                    var date = event.start.format();
                    
                    $.ajax({
                        type: 'post',
                        url: '/dashboard/ajaxCalendarDragendUpdatePurchaseDate',
                        data: {id:pid,purchase_date:date},
                        success: function(response){
                            console.log(response);
                        }
                    });
                },
                customButtons: {
                    filterButton: {
                        text: 'Filter',
                        click: function() {
                            calendar.filter();
                        }
                    },
                    coeButton: {
                        text: 'COE',
                        click: function() {
                            calendar.type('coe');
                            $('.fc-coeButton-button').addClass('fc-state-active');
                            $('.fc-ddButton-button').removeClass('fc-state-active');
                        }
                    },
                    ddButton: {
                        text: 'DD',
                        click: function() {
                            calendar.type('dd');
                            $('.fc-ddButton-button').addClass('fc-state-active');
                            $('.fc-coeButton-button').removeClass('fc-state-active');
                        }
                    }
                },
                header: {
                    left: 'prev,next coeButton,ddButton filterButton',
                    center: 'title',
                    right: 'today month,agendaWeek,agendaDay,listMonth'
                },
                eventRender: function(event,element,view){
                    $('.fc-coeButton-button').addClass('fc-state-active');
                }
                
                
            });

            
        },
        filter: function(){
            $('#filter').modal('show');
        },
        type: function(type){
            $.ajax({
                type:'post',
                url: '/dashboard/ajaxSetEventType',
                data: {type:type},
                success: function(response){
                    console.log(response);
                }
            });
        }
    };
}($));
$(window).load(function() {calendar.init();});