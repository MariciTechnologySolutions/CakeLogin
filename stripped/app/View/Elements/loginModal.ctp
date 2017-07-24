<div class="modal-dialog" style="margin-top: 150px">
    <?php echo $this->Form->create("User", array("class" => "contactForm")); ?>
    <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title">US Acquisitions Login</h4>
        </div>
        <div class="modal-body">

                <div class="row">

                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cfItem">
                        <?php echo  $this->Form->input("username", array("placeholder" => "Username", "class" => "form-control")); ?>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cfItem">
                        <?php echo  $this->Form->input("password", array("placeholder" => "Password", "class" => "form-control")); ?>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cfItem">
                        <div class="checkbox custom-checkbox">
                            <label>
                                <?php echo  $this->Form->checkbox("remember", array("label"=>false, "checked" =>"checked")); ?>
                                
                                <span class="fa fa-check"></span> 
                                Remember Password
                            </label>
                        </div>
                    </div>

                </div>
        </div>
        <div class="modal-footer">
            <input type="submit" class="btn btn-round btn-o btn-blue">
        </div>
    <?php echo $this->Form->end(); ?>
    </div>
</div>