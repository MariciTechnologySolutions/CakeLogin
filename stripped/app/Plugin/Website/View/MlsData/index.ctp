<?php 

        $statusText = array(
            "Sale"      => "For Sale",
            "Pending"   => "Pending",
            "Sold"      => "Sold"
        );
        
        $this->start('pagejs'); 
            echo $this->Html->script(array_merge(array("Website.properties", $asset['map_script'])));
//                echo $this->Html->script("Website.properties");
        $this->end(); 
        /*$this->start('pagecss'); 
            echo $this->Html->css(array_merge(array($asset['selectpicker'])));
        $this->end();       */
        
        //prd($properties);
?>
<style>
    .prop_highlight{
       border: 5px solid #1d82aa
    }
</style>
<div id="mapView">
    <div class="mapPlaceholder"><span class="fa fa-spin fa-spinner"></span> Loading map...</div>
</div>
<div id="content">
    <div class="filter">
        <div class="clearfix"></div>
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 formItem">
                <div class="formField">
                    <?php echo $this->Form->input(
                                "dpOfFIlter",
                                array(
                                    "options" => array_combine(array_keys( $dropdownText ), $statusText),
                                    "class" => "btn btn-green dropdown-btn dropdown-toggle propTypeSelect",
                                    "label" => false,
                                    "default" => $statusText[$statusSelected]
                                )
                            ); 
                    ?>
                </div>
            </div>
        </div>
    </div>
    <div class="resultsList">
        <div class="row">
<?php 
//prd($properties);
foreach($properties as $key => $Property) {
    
    //prd(json_decode($Property['MlsData']['images']));
    
        $MlsData = $Property['MlsData'];
        $Property = $Property['Property'];
        
        
        $PropertyId = $Property['id'];
        //$address = $Property[0]['address'];
        
        $imageUrl = "/images/house.png";
        
        $imgs = json_decode($MlsData['images']);
        if(!empty($imgs))
            $imageUrl = $imgs[0];
        
        $address  = $MlsData['address'];
        
        $linkAddress = explode(" ", strtolower($address));
        $linkAddress = implode("-", $linkAddress);

?>
            
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 property_small_views" id="<?php echo $PropertyId; ?>" style="max-height: 350px;min-height: 350px;overflow: hidden">
                <input type="hidden" value="<?php echo $MlsData['latitude']; ?>" class="latitude_value">
                <input type="hidden" value="<?php echo $MlsData['longitude']; ?>" class="longitude_value">
                <a href="/property-details/<?= $PropertyId."/".$linkAddress;?>" class="card viewLink" id="card_<?php echo $PropertyId; ?>">
                    <div class="figure">
                        
                        <img src="<?php  echo $imageUrl; ?>" alt="image" style="min-height: 250px; max-height: 250px">
                        
                        <div class="figCaption">
                            <div><?php echo '$'.number_format($Property['sale_amt']); ?></div>
                        </div>
                        <div class="figView"><span class="icon-eye"></span></div>
                        <div class="figType"><?php echo $statusText[$statusSelected]; ?></div>
                    </div>
                    
                    <div class="cardAddress" style="margin-top: 10px;font-size: 14px;color: #1d82aa; font-weight: bold">
                        <div class="addy1"><?php echo $address; ?></div>
                        <div class="addy2"><?php echo $MlsData['city'].' '.$MlsData['zipcode']; ?></div>
                            
                    </div>
                    
                    <div class="price" style="margin-left: 10px;font-size: 12px;color: #333">
                        <?php echo  $Property['salestatus_id'] == 50 ? 'Sold: $'.number_format($Property['sale_amt']) : 'Asking: $'.number_format($Property['sale_amt']); ?>
                    </div>
                        
                    
                    
                    <ul class="cardFeat">
                        <li><span class="fa fa-moon-o"></span> <?php echo $MlsData['bedrooms']; ?></li>
                        <li><span class="icon-drop"></span> <?php echo $MlsData['bathrooms']; ?></li>
                        <li><span class="icon-frame"></span> <?php echo number_format($MlsData['appx_sqft']); ?> SqFt</li>
                        <li><span class="icon-grid"></span> <?php echo number_format($MlsData['appx_lot_sqft']); ?>Lot Size</li>
                    </ul>
                    <div class="clearfix"></div>
                </a>
            </div>      
<?php } ?>
        </div>
        
    </div>
</div><!--Content-->
<div class="clearfix"></div>