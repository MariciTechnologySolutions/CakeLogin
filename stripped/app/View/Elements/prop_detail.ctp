<div class="modal fade" id="user_login" role="dialog" aria-labelledby="register" aria-hidden="true" style="">
    <div class="modal-dialog" style="margin-top: 150px">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Login</h4>
            </div>
            <div class="modal-body">
                <form id="login_form" class="contactForm" data-target="#login_form" method="post">
                    <div class="row">
                        
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cfItem">
                            <input id="username" type="text" placeholder="Username" class="form-control" value="">
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cfItem">
                            <input id="password" type="password" placeholder="Password" class="form-control" value="">
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cfItem">
                            <div class="checkbox custom-checkbox"><label><input id="remember" type="checkbox" checked><span class="fa fa-check"></span> Remember Password</label></div>
                        </div>
                        
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <input type="submit" id="submit_login" data-dismiss="modal" class="btn btn-round btn-o btn-blue">
                <a href="#" data-dismiss="modal" class="btn btn-round btn-o btn-gray">Cancel</a>
            </div>
        </div>
    </div>
</div>