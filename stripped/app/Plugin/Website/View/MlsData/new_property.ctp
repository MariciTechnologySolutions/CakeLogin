<?php

    $this->start('pagejs'); 
        echo $this->Html->script(array_merge(array($asset['btypeahead']), array($asset['map_script']), $asset['datatable_script'], array($asset['selectpicker'], $asset['typeahead'], $asset['attrchange'], $asset['infobox'])));
        
        echo $this->Html->script('new_property');
    $this->end(); 
    
    $this->start('pagecss'); 
        echo $this->Html->css(array_merge(array($asset['selectpicker'])));
    $this->end();   

?>
<div id="content" class="max"> 
<div class="inner-content">
<div class="panel panel-default"> 
<div class="row tableContainer">
<div class="panel-body" style="">
    
    <?php if($isLoggedIn){ ?>
    <div class="panel-heading"><span style="font-weight: bold;font-size: 2em; color: #017ebc">Add Off Market Property </span></div>
    <?php }else{ ?>
    <div class="panel-heading"><span style="font-weight: bold;font-size: 3em; color: #017ebc">Get a Cash Offer in 24 Hours! <span style="font-size: 14px">(or less)</span></span></div>
    <?php } ?> 
    <div class="row">
        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            
            
            <div class="form-group row" style="border-top: 1px solid #ededed;padding-top: 15px">
                <label class="col-lg-3 col-md-3 col-sm-3 control-label">Address Search</label>
                <div id="locationField" class="col-sm-9">
                    <input id="addressLookup" placeholder="Address Lookup" onFocus="" type="text" class="form-control">
                    <div class="hidden">
                        <input type="text" id="street_number">
                        <input type="text" id="route">
                        <input type="text" id="locality">
                        <input type="text" id="administrative_area_level_1">
                        <input type="text" id="administrative_area_level_2">
                        <input type="text" id="postal_code">
                    </div>    
                </div>
                <div class="col-sm-3">
                    <div id="spinner" class="hidden"><span style="font-size: 3em" class="fa fa-gear fa-spin"></span></div> 
                </div>
            </div>
               
            <form id="offMarket" class="">
                <div class="form-group row ">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">Number Compass Name Suffix</label>
                    <div class="col-sm-9">
                        <div class="row mb5">
                            <div class="col-sm-3">
                                <input id="str_number"  class="form-control validate" type="text" name="street_number" value="" placeholder="Number">
                            </div>
                            <div class="col-sm-3">
                                <input id="street_compass" class="form-control validate" type="text" name="street_compass" value="" placeholder="Compass">
                            </div>
                            <div class="col-sm-3">
                                <input id="street_name" class="form-control validate" type="text" name="street_name" value="" placeholder="Name">
                            </div>
                            <div class="col-sm-3">
                                <input id="street_suffix" class="form-control validate" type="text" name="street_suffix" value="" placeholder="Suffix">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group row ">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">City State Zip Subdivision</label>
                    <div class="col-sm-9">
                        <div class="row mb5">
                            <div class="col-sm-3">
                                <input id="city"  class="form-control validate" type="text" name="city" value="" placeholder="City">
                            </div>
                            <div class="col-sm-3">
                                <input id="state" class="form-control validate" type="text" name="state" value="AZ" placeholder="State" disabled>
                            </div>
                            <div class="col-sm-3">
                                <input id="zipcode" class="form-control validate" type="text" name="zipcode" value="" placeholder="Zip">
                            </div>
                            <div class="col-sm-3">
                                <input id="subdivision" class="form-control validate" type="text" name="subdivision" value="" placeholder="Subdivision">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group row ">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">Bed Bath Parking Pool</label>
                    <div class="col-sm-9">
                        <div class="row mb5">
                            <div class="col-sm-3">
                                <input id="bedrooms"  class="form-control validate" type="text" name="bedrooms" value="" placeholder="Bed">
                            </div>
                            <div class="col-sm-3">
                                <input id="bathrooms" class="form-control validate" type="text" name="bathrooms" value="" placeholder="Bath">
                            </div>
                            <div class="col-sm-3">
                                <input id="parking" class="form-control validate" type="text" name="parking" value="" placeholder="Parking">
                            </div>
                            <div class="col-sm-3">
                                <input id="pool" class="form-control validate" type="text" name="pool" value="" placeholder="Pool">
                            </div>
                        </div>
                    </div>
                </div>
                   
                <div class="form-group row " style="margin-bottom: 5px">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">SqFt LotSqFt Year Apn</label>
                    <div class="col-sm-9">
                        <div class="row mb5">
                            <div class="col-sm-3">
                                <input id="appx_sqft"  class="form-control validate" type="text" name="appx_sqft" value="" placeholder="SqFt">
                            </div>
                            <div class="col-sm-3">
                                <input id="appx_lot_sqft"  class="form-control validate" type="text" name="appx_lot_sqft" value="" placeholder="Lot SqFt">
                            </div>
                            <div class="col-sm-3">
                                <input id="year_built"  class="form-control validate" type="text" name="year_built" value="" placeholder="Year">
                            </div>
                            <div class="col-sm-3">
                                <input id="apn" class="form-control validate" type="text" name="apn" value="" placeholder="Apn">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group row" style="margin-bottom: 7px">
                     <div class="col-lg-6 col-md-6 col-sm-6"></div>
                     <div class="col-sm-6 "><span id="apnMsg" class="bg-info"></span></div>

                </div> 
                <div class="form-group row " style="margin-bottom: 5px">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">HOA Frequency Transfer County</label>
                    <div class="col-sm-9">
                        <div class="row mb5">
                            <div class="col-sm-3">
                                <input id="hoa_fee"  class="form-control validate" type="text" name="hoa_fee" value="" placeholder="HOA Fee">
                            </div>
                            
                            
                            
                           
                            
                            <div class="col-sm-3">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <a class="btn btn-md btn-green dropdown-toggle" data-toggle="dropdown">
                                            Select <span class="caret"></span>
                                        </a>
                                        <ul class="dropdown-menu" role="menu" style="min-width: 250px">

                                            <li>
                                                <a class="hoa_freq" href="">No HOA</a>
                                            </li>
                                            <li>
                                                <a class="hoa_freq" href="">Monthly</a>
                                            </li>
                                            <li>
                                                <a class="hoa_freq" href="">Quarterly</a>
                                            </li>
                                            <li>
                                                <a class="hoa_freq" href="">Semi-Annually</a>
                                            </li>
                                            <li>
                                                <a class="hoa_freq" href="">Annual</a>
                                            </li>
                                        </ul>
                                    </div>
                                        <input 
                                            id="hoa_paid" 
                                            type="text" 
                                            class="form-control input-md offerForm validate" 
                                            name="hoa_paid" 
                                            value="" 
                                            placeholder="HOA Paid"
                                        >
                                </div>
                            </div>
                            
                            
                            
                            <div class="col-sm-3">
                                <input id="hoa_transfer_fee"  class="form-control validate" type="text" name="hoa_transfer_fee" value="" placeholder="HOA Transfer Fee">
                            </div>
                            
                            <div class="col-sm-3">
                                <div class="input-group">
                                    <div class="input-group-btn">
                                        <a class="btn btn-md btn-green dropdown-toggle" data-toggle="dropdown">
                                            Select <span class="caret"></span>
                                        </a>
                                        <ul class="dropdown-menu" role="menu" style="min-width: 250px">

                                            <li>
                                                <a class="county_select" href="">Maricopa</a>
                                            </li>
                                            <li>
                                                <a class="county_select" href="">Pinal</a>
                                            </li>
                                            
                                        </ul>
                                    </div>
                                        <input 
                                            id="county_code" 
                                            type="text" 
                                            class="form-control input-md offerForm validate" 
                                            name="county_code" 
                                            value="" 
                                            placeholder="County"
                                        >
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
                <div class="form-group row">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">Comments</label>
                    <div class="col-sm-9">
                        <div class="row mb5">
                            <div class="col-sm-12">
                                <input id="public_remarks"  class="form-control validate" type="text" name="public_remarks" value="" placeholder="Comments">
                            </div>
                            
                            
                            
                        </div>
                    </div>
                </div>
                
                
                
                <div class="form-group row">
                    <label class="col-lg-3 col-md-3 col-sm-3 control-label">Price Seller Phone Email</label>
                    <div class="col-sm-9">
                        <div class="row mb5">
                            <div class="col-sm-3">
                                <input id="list_price"  class="form-control validate" type="text" name="list_price" value="" placeholder="Asking Price" required>
                            </div>
                            <div class="col-sm-3">
                                <input id="listing_member_name" class="form-control ck validate" type="text" name="listing_member_name" value="" placeholder="Seller" required>
                            </div>
                            <div class="col-sm-3">
                                <input id="listing_member_phone" class="form-control ck validate" type="text" name="listing_member_phone" value="" placeholder="Phone" required>
                            </div>
                            <div class="col-sm-3">
                                <input id="listing_member_email" class="form-control ck validate"  type="email" name="listing_member_email" value="" placeholder="Email" required>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                  <input type="hidden" id="latitude" name="latitude" > 
                  <input type="hidden" id="longitude" name="longitude" > 
                  
                  <input type="hidden" id="taxes" name="taxes" > 
                  <input type="hidden" id="zestimate" name="zestimate" > 
                  <input type="hidden" id="zrent" name="zrent" > 
                  <input type="hidden" class="validate" id="dwelling_type" name="dwelling_type" > 
                  <input type="hidden" class="validate" id="score_school_avg" name="score_school_avg" > 


                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="form-group">
                            <input type="submit" id="add_off_market_property" class="btn btn-green btn-lg pull-right" value="Submit Property">
                            <span id="add_off_market_property_spinner" class="fa fa-spinner fa-spin pull-right hidden" style="font-size: 3em"></span>
                            <!--<input type="submit" id="reminder" class="btn btn-info btn-md pull-right" value="Submit button will appear when all fields are complete">-->
                        </div>
                    </div>
                </div> 
            </form>
        </div>
        
        
        
        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 hidden">
            
            
            <div class="form-group row" style="border-top: 1px solid #ededed;padding-top: 15px">
                
                <div id="" class="col-sm-12">
                    
                    
                    <div id="school" class="alert alert-info alert-dismissible fade in hidden" role="alert">
                        <div class="icon"><span class="fa fa-ban"></span></div>
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <strong>Schools!</strong> www.GreatSchools.org Average School Rating Minium 5.  
                    </div>
                    
                    <div id="sfr" class="alert alert-info alert-dismissible fade in hidden" role="alert">
                        <div class="icon"><span class="fa fa-ban"></span></div>
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <strong>Dwelling Type!</strong> Single Family Detached.
                    </div>
                    <div id="age" class="alert alert-info alert-dismissible fade in" role="alert">
                        <div class="icon"><span class="fa fa-ban"></span></div>
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <strong>Age!</strong> 1980 Or Newer.
                    </div>
                    <div id="beds" class="alert alert-info alert-dismissible fade in" role="alert">
                        <div class="icon"><span class="fa fa-ban"></span></div>
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <strong>Bedrooms!</strong> 3 Bedroom Minimum.
                    </div>
                    <div id="baths" class="alert alert-info alert-dismissible fade in" role="alert">
                        <div class="icon"><span class="fa fa-ban"></span></div>
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <strong>Bathrooms!</strong> 1.75 Bath Minimum.
                    </div>
                    <div id="small" class="alert alert-info alert-dismissible fade in" role="alert">
                        <div class="icon"><span class="fa fa-ban"></span></div>
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <strong>SqFt!</strong> 1200 - 2800 SqFt Range.
                    </div>
                    <div id="cities" class="alert alert-info alert-dismissible fade in" role="alert">
                        <div class="icon"><span class="fa fa-ban"></span></div>
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <strong>City!</strong> Acceptable Cities: Phoenix, Chandler, Mesa, Gilbert, Tempe, Surprise, Litchfield Park, Peoria, Ahwatukee, El Mirage, Laveen, North Glendale, Queen Creek, San Tan Valley
                    </div>
                    <div id="county" class="alert alert-info alert-dismissible fade in hidden" role="alert">
                        <div class="icon"><span class="fa fa-ban"></span></div>
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <strong>County!</strong> Maricopa and Pinal County Only.
                    </div>
                    
                    
                    
                    <div id="success" class="alert alert-success alert-dismissible fade in hidden" role="alert">
                        <div class="icon"><span class="fa fa-check-circle"></span></div>
                        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <strong>Ok So Far!</strong> We're happy to further evaluate this property.
                    </div>
                    
                    
                </div>
            </div>
            
        </div>
        
    </div>
    <div class="row" style="margin-top: 20px">
        <div class="col-md-2 col-lg-2"></div>
        <div class="col-md-6 col-lg-6">
            <p style="font-weight: bold">
                For properties to be considered, <a href="http://greatschools.org" target="_blank">GreatSchoools.org</a> must show an average school rating of 5. <br>
            </p>
        </div>
    </div>
</div>
    
</div>
    
</div>
</div>
</div>