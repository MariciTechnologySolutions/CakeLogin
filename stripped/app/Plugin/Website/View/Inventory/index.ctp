<?php 
    $this->start('pagejs'); 
        echo $this->Html->script($asset['app']);
    $this->end(); 
?>
<div id="content" class="max"> 
    <div class="inner-content">
        <div class="tables">
            <div class="row" style="padding-left: 20px">
               <h1>Available Properties</h1>
                For access and information: <br>Steve @ 480-235-1400
            </div>
            <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                    <div class="table-overflow">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Address</th>
                                    <th>Asking Price</th>
                                </tr>
                            </thead>
                            <style>
                                .hrow{
                                    background-color: #1d82aa;
                                    color: white;
                                    font-weight: bold;
                                    text-align: left;
                                }
                            </style>
                            <tbody class="table">
                                <?php $highlight = '';?>
                                <?php foreach($properties as $k => $v){ ?>
                                    <tr class="">
                                        <?php
                                            $images = json_decode($v['MlsData']['images']);
                                            
                                        ?>
                                        <td class=""><img src="<?= $images[0];?>" height="100px" width="auto"></td>
                                        <td class=""><?= $v['MlsData']['address'];?></td>
                                        <td class=""><?= money($v['Property']['sale_amt']);?></td>
                                    </tr>
                                    <?php $highlight = '';?>
                                <?php } ?>

                        </tbody>
                        </table>
                    </div> 
                </div> 
            </div> 
            <div class="row" style="margin: 20px">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
               The Us-Acquisitions.com domain is owned and controlled by Steve Peterson, a licensed real estate agent in Arizona. <br>
               All homes listed herein are owned or under contract by Steve's clients. <br>
               Steve's clients are in the business of buying and selling properties to investors. <br> <br> 
               
               Prices listed are net to seller. Buyer pays all closing costs.<br> 
               Prices are based a close cycle of less than 2 weeks.<br>
               All properties are being offered As-Is, How-Is, Where-Is, with no warranties of any kind. <br> 
               Buyer is responsible for his/her own due diligence.<br> 
               We advise all parties to seek professional assistance for determining the viability of any investment property. <br>
               We do not provided opinions of value or estimates of repairs.<br>
               Value and repairs estimates are the buyer's responsibility and they should be diligent in making these valuations.<br> <br>
               Steve's clients may or may not own the properties listed here. <br>
               Sometimes Steve's client have the property under contract and Steve is marketing his/her client's interest in that property.<br>
               Some properties may be occupied. Do not disturb occupants.<br>
               Contact Steve for access.

            </div>
            </div>
        </div> 
    </div> 
</div> 
<?
    //pr($properties);
?>