var offers = (function($){
    return{
        cntUrl: window.location.origin+"/offers/",
        init: function(callback) {
            offers.__proto__ = Pankaj;
            offers.initialize();
            offers.property_id = $('#property_id').val();
            $('#offerUpdate').click(function () {
                offers.offerFormSubmit();
            });
            $('.offerForm').blur(function () {
                offers.blurTest();
                
            });
            $('.buyerName').click(function(e){
                var buyer = $(this).text();
                var buyer_id = $(this).attr('data-rel-id');
                
                
                $('#buyer').val(buyer);
                
                
                var ex = $('#clauses').val();
                console.log(ex);
                
                if(buyer_id == 15){
                    var clause = $('#cahClause').text();
                }else{
                    var clause = $('#standardClause').text();
                }
                
                $('#clauses').val(clause.trim());
                
                
                offers.blurTest(buyer_id);
                
                offers.pof();
                e.preventDefault();
            });
            $('.agentName').click(function(e){
                var agent = $(this).text();
                var user_id = $(this).attr('data-rel-id');
                offers.addAgent(agent,user_id);
                e.preventDefault();
            });
            $('.titleSelect').click(function(e){
                var title = $(this).text();
                var title_id = $(this).attr('data-rel-id');
                offers.addTitle(title,title_id);
                e.preventDefault();
            });
            
            $('#offerDate').datepicker({
                format: "yyyy-mm-dd",
                todayBtn: true,
                daysOfWeekDisabled: "0,6",
                autoclose: true,
                todayHighlight: true
            });
            
            offers.pof();
            offers.getLegal();
            },
        getLegal: function(){
            var county = $('#county').val();
            var seller = $('#seller').val();
            var legal  = $('#legal').val();
            var apn    = $('#apn').val();
            
            if(legal.length == 0 || seller.length == 0){
                $.ajax({
                    type: 'post',
                    url: '/offers/apiGetLegal',
                    dataType: 'json',
                    data: {id:offers.property_id,apn:apn,county:county,seller:seller,legal:legal},
                    success: function(response){
                        if(legal.length == 0){
                            $('#legal').val(response.legal);
                        }
                        if(seller.length == 0){
                            $('#seller').val(response.buyer);
                        }
                    }
                });
            }
            
            
        },
        pof: function(){
           
            var buyer = $('#buyer').val();
            
            
            if(buyer.indexOf('CSH') == 0){
                $('.pof_csh').removeClass('hidden');
                $('.pof').addClass('hidden');
            }else{
                $('.pof_csh').addClass('hidden');
                $('.pof').removeClass('hidden');
            }
            
            
        },
        addTitle: function (title,title_id){
            var title = title;
            var title_id = title_id;
            var id = $('#property_id').val();
            $.ajax({
                url: '/offers/add_title',
                type: 'post',
                data: {id:id,title_id:title_id},
                success: function(response){
                    console.log(response);
                    if(response){
                        $('#title').val(title);
                        offers.__proto__.logit(id,'Set Offer Title Company',title)
                    }
                }
            });
        },    
        addAgent: function(agent,user_id){
            var agent = agent;
            var user_id = user_id;
            var id = $('#property_id').val();
            $.ajax({
                url: '/offers/add_agent',
                type: 'post',
                data: {id:id,agent:agent,user_id:user_id},
                success: function(response){
                    $('#agent').val(response);
                }
            });
        },
        blurTest: function(buyer_id){
            var buyer_id = buyer_id;
            var data = $('.offerForm').serialize();
            //console.log(data);
            var property_id = $('#property_id').val();
            $.ajax({
                url: '/offers/offer_form',
                type: 'post',
                data: {data:data,property_id:property_id,buyer_id:buyer_id},
                success: function(response){
                    console.log(response);
                    
                }
            });
        },
    };
}($));
$(window).load(function() {
   offers.init(); 
});