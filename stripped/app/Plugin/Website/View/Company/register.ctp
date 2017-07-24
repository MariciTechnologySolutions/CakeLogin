<?php 
    $this->start('pagejs'); 
        echo $this->Html->script(array_merge(array("Website.register","https://maps.googleapis.com/maps/api/js")));
    $this->end(); 
?>
<div id="content" class="max whiteBg">
    <div class="">
        <h4>Register</h4>
        <div class="row gridSystem">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div class="panel panel-default">
                    
                   
                    <div class="panel-body leftPanel">
                        <?php 
                                echo $this->Form->create(
                                        'Investor', 
                                        array(
                                            'id'=>'addNewInvestor',
                                            'url'   => array(
                                                'plugin'=>'Marketing',
                                                'controller'=>'Marketing',
                                                'action'    => 'registerNewInvestor'
                                            )
                                        )); 
                        ?>
                            
                            <div class="input-group">
                                
                                <div class="input-group-btn">
                                    <a class="btn btn-md btn-green dropdown-toggle" data-toggle="dropdown">Market Select<span class="caret"></span></a>
                                    <ul class="dropdown-menu" role="menu" style="min-width: 250px">
                                        <?php foreach($markets as $market){ ?>
                                            <li><a href="#" class="marketSelect query"><?php echo str_replace('Mls','',$market); ?></a></li>
                                        <?php } ?>
                                    </ul>
                                </div>
                                    <input 
                                        id="regions" 
                                        type="text" 
                                        class="form-control input-md offerForm" 
                                        value="<?php echo $mkt;?>" 
                                        name="regions"
                                    >
                            </div>
                            <div id="output"></div>
                        
                            <div class="form-group" style="margin-top: 15px">
                                <label>Name</label>
                                <?php 
                                        echo $this->Form->hidden(
                                                'id',
                                                array(
                                                    'id' => 'id',
                                                    'name'=>'id'
                                                )
                                            );	
                                ?>
                                <?php 
                                        echo $this->Form->input(
                                                'name', 
                                                array(
                                                    'label' => false, 
                                                    'div' => false,
                                                    'class' => 'form-control',
                                                    'id' => 'name',
                                                    'name'=>'name',
                                                    'value'=>$name
                                                )
                                            );	
                                ?>
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <?php 
                                        echo $this->Form->input(
                                                'phone', 
                                                array(
                                                    'label' => false, 
                                                    'div' => false,
                                                    'class' => 'form-control',
                                                    'id' => 'phone',
                                                    'name'=>'phone',
                                                    'value'=>$phone
                                                    
                                                )
                                            );	
                                ?>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <?php 
                                        echo $this->Form->input(
                                                'email', 
                                                array(
                                                    'label' => false, 
                                                    'div' => false,
                                                    'class' => 'form-control',
                                                    'id' => 'email',
                                                    'name'=>'email',
                                                    'value'=>$email
                                                    
                                                )
                                            );	
                                ?>
                            </div>
                            
                            
                        <input id="campaign_id" type="hidden" name="campaign_id" value="<?php echo $campaign_id; ?>">
                        <input id="message_id" type="hidden" name="message_id" value="<?php echo $message_id; ?>">
                        
                        <?php echo $this->Form->submit(__('Submit'), array('class' => 'btn btn-blue btn-sm')); ?>
                        <?php echo $this->Form->end(); ?>
                    </div>
               
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div class="panel panel-default">
                    <div class="panel-body rightPanel">
                        We're excited you're here and we look forward to doing business with you. <br><br>
                        
                        <span style="font-size: 2em; font-weight: bold">Why Register?</span><br><br>
                        <span style="font-size: 3em; font-weight: bold">Be First To Find Out About New Deals!</span><br><br>
                        
                        
                        <span style="font-size: 1.2em; font-weight: bold">Privacy</span><br>
                        We only use this information to notify you of new deals. <br>
                        We don't spam. <br>
                        We don't share your information.<br>
                        <a href="/privacy">Click here to view our Privacy policy.</a>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</div>