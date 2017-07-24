<?php
    $current_phase = 0;
//    if(!empty($this->request['pass'][1]))
//    $current_phase = $this->request['pass'][1];
//    
    
    if(!empty($property['Property']['phase_2_binsr_accepted'])){
        $current_phase = 3;
    }elseif(!empty($property['Property']['phase_1_accepted'])){
        $current_phase = 2;
    }elseif(!empty($property['Property']['phase_0_submitted'])){
        $current_phase = 1;
    }
    
?>
<style>
    div.tabsContainer{
       
    }
    
</style>

<div class="tabsContainer">
    
    
    <ul class="nav nav-tabs nav-justified" role="tablist">
        <li class="<?php echo $current_phase == 0 ? 'active' : '';?>"> <a href="#phase0"    role="tab" data-toggle="tab"><span class="icon-home"></span> Phase 0</a></li>
        <li class="<?php echo $current_phase == 1 ? 'active' : '';?>"> <a href="#phase1"    role="tab" data-toggle="tab"><span class="icon-user"></span> Phase 1</a></li>
        <li class="<?php echo $current_phase == 2 ? 'active' : '';?>"> <a href="#phase2"    role="tab" data-toggle="tab"><span class="icon-bubbles"></span> Phase 2</a></li>
        <li class="<?php echo $current_phase == 3 ? 'active' : '';?>"> <a href="#phase3"    role="tab" data-toggle="tab"><span class="icon-bubbles"></span> Phase 3</a></li>
    </ul>
    
    
    <div class="tab-content">
        <div class="tab-pane fade<?php echo $current_phase == 0 ? ' active in' : '';?>" id="phase0">
            
            <form id="" class="form-horizontal" role="form">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-group mb5">
                            <label for="est_value" class="col-sm-4 control-label">ARV</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm calculator" id="est_value" value="<?php echo money($property['Property']['est_value']); ?>">
                                <div id="est_value_raw" class="hidden"><?php echo number_format($property['Property']['est_value']); ?></div>
                            </div>
                        </div>

                        <div class="form-group mb5">
                            <label for="est_repairs" class="col-sm-4 control-label">Rprs</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm calculator" id="est_repairs" value="<?php echo money($property['Property']['est_repairs']); ?>">
                            </div>
                        </div>

                        <div class="form-group mb5">
                            <label for="est_rent" class="col-sm-4 control-label">EstRent</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm calculator" id="est_rent" 
                                       value="<?php echo !empty($property['Property']['est_rent']) ? money($property['Property']['est_rent']) : ''; ?>">
                            </div>
                        </div>

                        <div class="form-group mb5">
                            <label id="offer_tip" for="purchase_amt" class="col-sm-4 control-label show_tip" data-toggle="offer_tip" data-placement="right" title="">Offer</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm calculator" id="purchase_amt" 
                                       value="<?php echo money($property['Property']['purchase_amt']); ?>">
                                <div id="purchase_amt_raw" class="hidden"><?php echo @$property['Property']['purchase_amt']; ?></div>
                            </div>
                        </div>

                        <div class="form-group mb5">
                            <label for="sale_amt" class="col-sm-4 control-label">Counter</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm calculator" id="counter" value="<?php echo money($property['Property']['counter']); ?>">
                            </div>
                        </div>

                        <div class="form-group mb5">
                            <label for="sale_amt" class="col-sm-4 control-label">Sale $$</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm calculator" id="sale_amt" value="<?php echo money($property['Property']['sale_amt']); ?>">
                            </div>
                        </div>

                        <div class="hidden form-group mb5">
                            <label for="as_is" class="col-sm-4 control-label">AsIs</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm" id="as_is" 
                                       value="<?php echo money($property['Property']['est_value'] - $property['Property']['est_repairs']); ?>" disabled>
                            </div>
                        </div>

                    </div>
                
                    <div class="col-sm-6">

                        <div class="form-group mb5">
                            <label for="purchase_date" class="col-sm-4 control-label">ContractDate</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm" id="contract_date" value="<?php echo $property['Property']['contract_date']; ?>">
                            </div>
                        </div>
                        <div class="form-group mb5">
                            <label for="purchase_date" class="col-sm-4 control-label">COE</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm" id="purchase_date" value="<?php echo $property['Property']['purchase_date']; ?>">
                            </div>
                        </div>
                        <div class="form-group mb5">
                            <label for="contract_date" class="col-sm-4 control-label">InspExp</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm" id="due_diligence_expires" value="<?php echo $property['Property']['due_diligence_expires']; ?>">
                            </div>
                        </div>
                        
                        <div class="form-group mb5">
                            <label for="phase_0_submitted" class="col-sm-4 control-label">Sent To TC</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm csh_workflow_date" id="phase_0_submitted" value="<?php echo $property['Property']['phase_0_submitted']; ?>">
                            </div>
                        </div>
                        <div class="form-group mb5">
                            <label for="access" class="col-sm-4 control-label">Access</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm csh_workflow_text" id="access" value="<?php echo $property['Property']['access']; ?>">
                            </div>
                        </div>

                    </div>
                </div>
                    
            </form>
        </div>
        
        <div class="tab-pane fade<?php echo $current_phase == 1 ? ' active in' : '';?>" id="phase1">
            <form id="" class="form-horizontal" role="form">
                <div class="row">
                    <div class="col-sm-6">
                    
                    
                    <div class="form-group mb5">
                        <label for="phase_1_escrow" class="col-sm-4 control-label">Escrow Opened</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control input-sm csh_workflow_date" id="phase_1_escrow" value="<?php echo $property['Property']['phase_1_escrow']; ?>">
                        </div>
                    </div>
                    <div class="form-group mb5">
                        <label for="phase_1_submitted" class="col-sm-4 control-label">Submitted CSH</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control input-sm csh_workflow_date" id="phase_1_submitted" value="<?php echo $property['Property']['phase_1_submitted']; ?>">
                        </div>
                    </div>
                    <div class="form-group mb5">
                        <label for="phase_1_inspection" class="col-sm-4 control-label">Insp Scheduled Date </label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control input-sm csh_workflow_date" id="phase_1_inspection" value="<?php echo $property['Property']['phase_1_inspection']; ?>">
                        </div>
                    </div>
                    
                        
                    
                    
                    
                    
                    
                    </div>
                    
                    
                    
                    <div class="col-sm-6">
                        
                        <div class="form-group mb5">
                            <label for="phase_1_accepted" class="col-sm-4 control-label">Sent to Matt</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm csh_workflow_date" id="phase_1_accepted" value="<?php echo $property['Property']['phase_1_accepted']; ?>">
                            </div>
                        </div>  
                        <div class="form-group mb5">
                            <label for="phase_1_rejected" class="col-sm-4 control-label">CSH Rejected</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm csh_workflow_date" id="phase_1_rejected" value="<?php echo $property['Property']['phase_1_rejected']; ?>">
                            </div>
                        </div> 
                        <div class="form-group mb5">
                        <label for="phase_1_conditions" class="col-sm-4 control-label">Conditions</label>
                        <div class="col-sm-8">
                            <textarea class="form-control csh_workflow_text" id="phase_1_conditions" rows="2"><?php echo $property['Property']['phase_1_conditions'];?></textarea>
                        </div>
                    </div>
                        
                    </div>
                </div>
                </form>
        </div>
        
        <div class="tab-pane fade<?php echo $current_phase == 2 ? ' active in' : '';?>" id="phase2">
            <form id="" class="form-horizontal" role="form">
            <div class="row">
                <div class="col-sm-6">
                        
                        <div class="form-group mb5">
                            <label for="phase_2_submitted" class="col-sm-4 control-label">Phase 2 Submitted</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm csh_workflow_date" id="phase_2_submitted" value="<?php echo $property['Property']['phase_2_submitted']; ?>">
                            </div>
                        </div>  
                        <div class="form-group mb5">
                            <label for="phase_2_binsr_accepted" class="col-sm-4 control-label">BINSR Accepted</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm csh_workflow_date" id="phase_2_binsr_accepted" value="<?php echo $property['Property']['phase_2_binsr_accepted']; ?>">
                            </div>
                        </div>  
                        <div class="form-group mb5">
                            <label for="phase_2_binsr_rejected" class="col-sm-4 control-label">BINSR Rejected</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control input-sm csh_workflow_date" id="phase_2_binsr_rejected" value="<?php echo $property['Property']['phase_2_binsr_rejected']; ?>">
                            </div>
                        </div>  
                        
                </div>
                <div class="col-sm-6">
                    
                    <div class="form-group mb5">
                        <label for="csh_repairs" class="col-sm-4 control-label">CSH Repair Bid</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control input-sm calculator" id="csh_repairs" value="<?php echo money($property['Property']['csh_repairs']); ?>">
                        </div>
                    </div>
                    
                    <div class="form-group mb5">
                        <label for="phase_2_conditions" class="col-sm-4 control-label">Conditions</label>
                        <div class="col-sm-8">
                            <textarea class="form-control csh_workflow_text" id="phase_2_conditions" rows="4"><?php echo $property['Property']['phase_2_conditions']; ?></textarea>
                        </div>
                    </div>
                    
                </div>
            </div> 
            </form>
        </div>
        
        <div class="tab-pane fade<?php echo $current_phase == 3 ? ' active in' : '';?>" id="phase3">
            <form id="" class="form-horizontal" role="form">
            <div class="row">
                <div class="col-sm-6">
                        
                        <div class="form-group mb5">
                            <label for="fw_requested" class="col-sm-5 control-label">FW Ordered</label>
                            <div class="col-sm-7">
                                <input type="text" class="form-control input-sm csh_workflow_date" id="fw_requested" value="<?php echo $property['Property']['fw_requested']; ?>">
                            </div>
                        </div>  
                        <div class="form-group mb5">
                            <label for="fw_submitted" class="col-sm-5 control-label">FW Submitted</label>
                            <div class="col-sm-7">
                                <input type="text" class="form-control input-sm csh_workflow_date" id="fw_submitted" value="<?php echo $property['Property']['fw_submitted']; ?>">
                            </div>
                        </div>  
                        <div class="form-group mb5">
                            <label for="clear_to_close" class="col-sm-5 control-label">Clear To Close</label>
                            <div class="col-sm-7">
                                <input type="text" class="form-control input-sm csh_workflow_date" id="clear_to_close" value="<?php echo $property['Property']['clear_to_close']; ?>">
                            </div>
                        </div>  
                        
                </div>
                <div class="col-sm-6">
                    
                    <div class="form-group mb5">
                        <label for="phase_3_conditions" class="col-sm-4 control-label">FW Conditions</label>
                        <div class="col-sm-8">
                            <textarea class="form-control csh_workflow_text" id="phase_3_conditions" rows="3"><?php echo $property['Property']['phase_3_conditions']; ?></textarea>
                        </div>
                    </div>
                    <div class="form-group mb5">
                        <label for="sale_date" class="col-sm-4 control-label">Closed</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control input-sm closeout" id="sale_date" value="<?php echo $property['Property']['sale_date']; ?>">
                        </div>
                    </div>  
                    
                </div>
            </div> 
            </form>
        </div>
    </div>
    
    
</div>