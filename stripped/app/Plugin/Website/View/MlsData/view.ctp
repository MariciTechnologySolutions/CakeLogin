<?php
$this->start('pagejs'); 
    echo $this->Html->script(array_merge(array("Website.properties_view", $asset['map_script'], $asset['infobox'])));
$this->end(); 
?>
<!-- Content -->
<input type="hidden" id="property_id" value="<? echo $property['MlsData']['id'];?>">
<input type="hidden" id="lat" value="<? echo $property['MlsData']['latitude'];?>">
<input type="hidden" id="lng" value="<? echo $property['MlsData']['longitude'];?>">

<div id="mapView" class="mob-min"><div class="mapPlaceholder"><span class="fa fa-spin fa-spinner"></span> Loading map...</div></div>
<div id="split-bar"></div> 
<div id="content"> 
<div class="inner-content">
    <div class="singleTop">
        <?php
            $images = json_decode($property['MlsData']['images']);
            
            $hideCarousel = '';
            if(empty($images)){
                $hideCarousel = 'hidden';
            }
        ?>
        
        <div id="carouselFull" class="carousel slide <?php echo $hideCarousel;?>" data-ride="carousel">
            <div class="carousel-inner">
                
                <?php 
                    $i=0;
                    foreach($images as $image){
                ?>
                
                <div class="item <?php if($i==0)echo 'active';?>" style="height: 300px;overflow: hidden">
                    <img src="<?php echo $image;?>" style="height: 350px">
                </div>
                
                <?php 
                    $i++;
                    } 
                ?>
                
            </div>
            <a class="left carousel-control" href="#carouselFull" role="button" data-slide="prev"><span class="fa fa-chevron-left"></span></a>
            <a class="right carousel-control" href="#carouselFull" role="button" data-slide="next"><span class="fa fa-chevron-right"></span></a>
        </div>
        
        
        


        <div class="summary">
                        <div class="row">
                            
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="summaryItem" style="Margin-bottom: 10px">

                                    <h1 class="pageTitle"><?php echo $property['MlsData']['property_desc'];?></h1>
                                    <?php $subject_address = $property['MlsData']['address'];?>
                                    <div class="address" style="font-size: 1.2em; color: #068b85"><span class="icon-pointer"></span> <?php echo $subject_address;?></div>
                                    <div class="address" style="padding-left: 16px"><? echo $property['MlsData']['county_code'].' '.$property['MlsData']['apn'];?></div>
                                    <div class="address" style="padding-left: 16px"><span class=""></span> <?php echo $property['MlsData']['dwelling_type'].' @ '.$property['MlsData']['subdivision'];?></div>

                                    <ul class=" hidden rating">
                                        <li><a href="#"><span class="fa fa-star"></span></a></li>
                                        <li><a href="#"><span class="fa fa-star"></span></a></li>
                                        <li><a href="#"><span class="fa fa-star"></span></a></li>
                                        <li><a href="#"><span class="fa fa-star"></span></a></li>
                                        <li><a href="#"><span class="fa fa-star-o"></span></a></li>
                                        <li>(146)</li>
                                    </ul>
                                    <div class="hidden favLink"><a href="#"><span class="icon-heart"></span></a>54</div>
                                    <ul class="hidden stats">
                                        <li><span class="icon-eye"></span> 200</li>
                                        <li class="hidden"><span class="icon-bubble"></span> 13</li>
                                    </ul>
                                    <div class="clearfix"></div>
                                    <ul class="features">
                                        <li><span class="fa fa-moon-o"></span><div><? echo $property['MlsData']['bedrooms'];?><br>Bed</div></li>
                                        <li><span class="icon-drop"></span><div><? echo $property['MlsData']['bathrooms'];?><br>Bath</div></li>
                                        <li><span class="icon-grid"></span><div><? echo $property['MlsData']['appx_sqft'];?><br>Sq Ft</div></li>
                                        <li><span class="icon-frame"></span><div><? echo $property['MlsData']['appx_lot_sqft'];?><br>Lot SqFt</div></li>
                                        <li><span class="icon-clock"></span><div><? echo $property['MlsData']['year_built'];?><br>Yr Built</div></li>
                                    </ul>

                                    <div class="clearfix"></div>
                                </div>
                            </div>
                          </div>
                        <div class="row" style="margin-bottom: 10px">
                            <?php

                                switch($property['MlsData']['status']){
                                    case 'For Sale':
                                        $btn = 'btn-green';
                                        break;
                                    case 'Pending':
                                        $btn = 'btn-yellow';
                                        break;
                                    case 'Sold':
                                        $btn = 'btn-blue';
                                        break;
                                    case 'Not Listed':
                                        $btn = 'btn-magenta';
                                        break;
                                    case 'First Look':
                                        $btn = 'btn-info';
                                        break;
                                }

                            ?>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 special" style="padding: 10px; border: 1px solid gray">
                                <div class="agentAvatar summaryItem" style="margin-bottom: 0px">
                                    <div class="clearfix"></div>
                                    <?php
                                            $disc = 0;
                                            $sub= array();
                                            if(isset($property['Zillow']))
                                            foreach($property['Zillow'] as $z){
                                                if($z['like'] == 1)
                                                $sub[] = $z['price_sqft'];
                                            }
                                            if(!empty($sub)){
                                                $count = count($sub);
                                                $total = array_sum($sub);
                                                $avg = $total / $count;
                                                $est_value = $avg * $property['MlsData']['sqft'];
                                                $disc = number_format(1 - ($property['MlsData']['asking_price'] / $est_value),2)*100; 
                                            }
                                            
                                    ?>


                                    <h1 class="pageTitle" style="margin-top: 10px">Asking Price: $<?php echo !empty($property['Property']['sale_amt']) ? number_format($property['Property']['sale_amt']) : 0;?></h1>

                                    <?if($disc > 0){?>
                                    <div>Discount: <div class="btn btn-icon btn-round btn-cstm"><?= $disc;?>% </div></div>
                                    <?}?>
                                    <h1 id="estimated_value" class="pageTitle" style="font-size: .9em; margin-bottom: 0px; margin-top: 10px"  data-toggle="tooltip" data-placement="bottom" title="Calculated value is based on the average $/SqFt of the comps selected below multiplied times the subject properties sqft."></h1>

                                </div>

                            </div>



                        </div>
                        <div class="row hidden">
                                <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-car">            </span> Garage (0)====</div>
                                <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-car">            </span> Carport (0)=====</div>
                                <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem "><span class="icon-drop">           </span> Private Pool (<? echo $property['MlsData']['pool'] ? 'Yes' : 'No';?>)</div>
                                <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem "><span class="icon-drop">           </span> Community Pool (0)=====</div>
                                <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-trophy">         </span> Horses (0)=======</div>
                                <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem "><span class="fa fa-money">         </span> HOA (0)=======</div>
                        </div>

                        <div class="row" style="">
                          <hr style="margin-bottom:5px">  
                        <h3 style="">Comments</h3>
                        <p><?php echo @$property['Property']['marketing_comment'];?></p>
                        <hr style="margin-bottom:5px">
                        <h3>Access</h3>
                        <p>Call for access</p>
                        </div>



                        <div class="row" style="background-color: #ffde00 ; padding: 7px; margin: 0px -20px 0px -20px; border-bottom: 10px solid #1d82aa">
                            <ul style="list-style: none">
                                <li><span class="fa fa-user"></span> <?php echo $agent['name'];?> <a href="tel:<?php echo preg_replace('/[^0-9]/','',$agent['phone']);?>"><?php echo $agent['phone'];?></a> </li>
                                <li><span class="fa fa-pencil"></span> <a href="mailto:<?php echo $agent['email'];?>"><?php echo $agent['email'];?></a></li>
                            </ul>
                        </div>

                    </div>
                </div><!--div singletop-->

                <div class="clearfix"></div>







                        




        </div>
        </div>
    <div class="clearfix"></div>
    