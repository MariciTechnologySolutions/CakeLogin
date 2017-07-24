
<div id="content" class="max" style="background-color: white"> 
    <div class="inner-content">
    <div id="register" class="mob-max" style="overflow-x: hidden;overflow-y: auto; background-color: #f3f3f3; width: 350px; border: 1px solid #e8e8e8; margin: 30px auto;-webkit-border-radius: 5px;
-moz-border-radius: 5px;
border-radius: 5px;">
        <div class="rightContainer">
            <h1>Profile</h1>
            <form action="/users/profile" method="post">
                
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="hidden" name="id" value="<?php echo $user['User']['id'];?>">
                            <input type="text" class="form-control" name="name" value="<?php echo $user['User']['name'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="text" class="form-control" name="phone" value="<?php echo $user['User']['phone'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="text" class="form-control" name="email" value="<?php echo $user['User']['email'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Fax</label>
                            <input type="text" class="form-control" name="fax" value="<?php echo $user['User']['fax'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>User Name</label>
                            <input type="text" class="form-control" name="username" value="<?php echo $user['User']['username'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Passsword</label>
                            <input type="password" class="form-control" name="password" value="<?php echo $user['User']['pw'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Agent MLS ID</label>
                            <input type="text" class="form-control" name="agent_id" value="<?php echo $user['User']['agent_id'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Agent License Number</label>
                            <input type="text" class="form-control" name="license_number" value="<?php echo $user['User']['license_number'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Dropbox Path/to/Properties</label>
                            <input type="text" class="form-control" name="path" value="<?php echo $user['User']['path'];?>">
                        </div>
                    </div>
                </div>
                <hr>
                <h1>Brokerage Info</h1>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Brokerage</label>
                            <input type="text" class="form-control" name="company" value="<?php echo $user['User']['company'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Address</label>
                            <input type="text" class="form-control" name="firm_address" value="<?php echo $user['User']['firm_address'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>City</label>
                            <input type="text" class="form-control" name="firm_city" value="<?php echo $user['User']['firm_city'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>State</label>
                            <input type="text" class="form-control" name="firm_state" value="<?php echo $user['User']['firm_state'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Zip</label>
                            <input type="text" class="form-control" name="firm_zip" value="<?php echo $user['User']['firm_zip'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Brkr License Number</label>
                            <input type="text" class="form-control" name="firm_license" value="<?php echo $user['User']['firm_license'];?>">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label>Brkr MLS ID</label>
                            <input type="text" class="form-control" name="firm_mls_code" value="<?php echo $user['User']['firm_mls_code'];?>">
                        </div>
                    </div>
                </div>
                
                
                
                
                
                
                <div class="form-group">
                    <input type="submit" id="edit_property" class="btn btn-green btn-lg">
                </div>
            </form>
        </div>
    </div>
    <div class="clearfix"></div>
    
</div>
</div>
      
