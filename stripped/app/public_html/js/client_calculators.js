ClientCalculator = function(){
    cc = {
        buyerId: 0,

        setClientId: function(buyerId){
            cc.buyerId = buyerId;
        },

        Calculate: function ($mlsDataId){
            //ajax /ClientsCalculator/CalculateYield/cc.buyerId/mls_data_id
        }
    };

    return cc;
}();