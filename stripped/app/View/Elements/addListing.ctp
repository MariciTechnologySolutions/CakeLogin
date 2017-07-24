<div class="modal fade" id="addListingModal" role="dialog" aria-labelledby="thanks" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Copy Phoenix Mls Data to the Queue </h4>
            </div>
            <div class="modal-body" style="margin: 10px 0">
               <div class="form-group row">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">Listing Id(s)</label>
                    <div class="col-lg-9 col-md-9 col-sm-9">
                        <div class="input-group">
                            <form>
                            <input id="listingId" type="text" class="form-control input-sm" name="listing_id" placeholder="one or more listing_ids. Comma separated" autofocus value="">
                            </form>
                            <span class="input-group-btn">
                                <a id="submitListingId" href="#" class="btn btn-green btn-sm">Go!</a>
                            </span>
                        </div>
                    </div>
                </div>
                
                
                <div class="hidden form-group row" style="border-top: 1px solid #ededed;padding-top: 15px">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">Address Search</label>
                    <div id="locationField" class="col-sm-9">
                        <input id="geocomplete" placeholder="Auto Address Lookup" onFocus="" type="text" class="form-control">


                        <div id="z_response" class="">response</div>
                        <input type="text" id="street_number" class="hidden" placeholder="street_number">
                        <input type="text" id="route" class="hidden" placeholder="route">
                        <input type="text" id="locality" class="hidden" placeholder="locality">
                        <input type="text" id="administrative_area_level_1" class="hidden" placeholder="administrative_area_level_1 state">
                        <!--<input type="text" id="administrative_area_level_2" class="" placeholder="administrative_area_level_2 county" name="county">-->
                        <input type="text" id="postal_code" class="hidden" placeholder="postal_code">
                    
                    </div>
                </div>
                
                
                <div class="hidden form-group row">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">Selected</label>
                    <div id="locationField" class="col-sm-9">
                        <input id="address" type="text" class="form-control" name="address" placeholder="" value="">
                    </div>
                </div>
                <div class="hidden form-group row">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">City, St, Zip</label>
                    <div id="locationField" class="col-sm-9">
                        <div class="row">
                            
                            <div class="col-sm-6">
                                <input id="city"  class="form-control" type="text" name="city" value="">
                            </div>
                            <div class="col-sm-3">
                                <input id="state" class="form-control" type="text" name="state" value="">
                            </div>
                            <div class="col-sm-3"> 
                                <input id="zip"   class="form-control" type="text" name="zip" value="">
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="hidden row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="form-group">
                        <input type="submit" id="add_property" class="btn btn-green btn-xs pull-right" value="Add Property">
                    </div>
                    </div>
                </div> 
            </div>
            <div class="modal-footer">
                <a href="#" data-dismiss="modal" class="btn btn-round btn-o btn-gray">Cancel</a>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="addListingResponseModal" role="dialog" aria-labelledby="thanks" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Results</h4>
            </div>
            <div id="addListingResponseText" class="modal-body" style="margin: 10px 0">
              
            </div>
            <div class="modal-footer">
                <a href="#" data-dismiss="modal" class="btn btn-round btn-o btn-gray">Ok</a>
            </div>
        </div>
    </div>
</div>