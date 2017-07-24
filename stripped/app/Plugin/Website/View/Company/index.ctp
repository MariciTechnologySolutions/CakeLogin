        <div id="hero-container">
            <ul class="cb-slideshow">
                <li><span></span></li>
                <li><span></span></li>
                <li><span></span></li>
                <li><span></span></li>
                <li><span></span></li>
                <li><span></span></li>
            </ul>
            <div class="home-header">
                <div class="home-logo osLight"><span class="fa fa-home"></span> RealSense</div>
                <a href="#" class="home-navHandler visible-xs"><span class="fa fa-bars"></span></a>
                <div class="home-nav">
                    <ul>
                            
                    </ul>
                </div>
            </div>
            <div class="home-caption">
                <div class="home-title"></div>
                <div class="home-subtitle"></div>
            </div>
            <div class="search-panel">
                
            </div>
        </div>
        <div class="highlight">
            <div class="h-title osLight" style="font-size: 1.8em;font-style: italic; font-family: times; font-weight: bold">Intelligent Real Estate</div>
            <div class="h-text osLight"></div>
        </div>

        <!-- Content -->

        <div class="home-wrapper">
            <div class="home-content">
                
                <div class="row pb40">
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 s-menu-item">
                        <a href="/register">
                            <span class="icon-pointer s-icon"></span>
                            <div class="s-content">
                                <h2 class="s-main osLight">A transparent and scalable <br>multi-market solution</h2>
                                <h3 class="s-sub osLight">Phoenix, Las Vegas<br>Sacramento, Los Angeles</h3>
                            </div>
                        </a>
                    </div>
                   <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 s-menu-item">
                       <a href="/register">
                            <span class="icon-users s-icon"></span>
                            <div class="s-content">
                                <h2 class="s-main osLight">Fix-n-flip investors and<br>Portfolio buyers</h2>
                                <h3 class="s-sub osLight">Unique sourcing based on <br>client specified criteria</h3>
                            </div>
                        </a>
                    </div>
                    
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 s-menu-item">
                        <a href="/register">
                            <span class="icon-cloud-upload s-icon"></span>
                            <div class="s-content">
                                <h2 class="s-main osLight">Proprietary technology for <br>finding the best deals</h2>
                                <h3 class="s-sub osLight">Providing our clients with a <br>competitive advantage</h3>
                            </div>
                        </a>
                    </div>
                </div>
                <h2 class="osLight">Recent Transactions</h2>
                <div class="row pb40">
                    
                    <?
                        foreach($properties as $k=>$p){
                            if(!in_array($k,$random))continue;
                    ?>
                    
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                        <a href="/inventory" class="propWidget-2">
                            <div class="fig">
                                
                                <?
                                    
                                ?>
                                <img src="<?= json_decode($p['MlsData']['images'])[0];?>" alt="Your Wholesale Property Source" width="300px" height="180px">
                                <img class="blur" src="<?= json_decode($p['MlsData']['images'])[0];?>" alt="Modern Residence in New York">
                                <div class="opac"></div>
                                <div class="priceCap osLight"><span>$<?= number_format($p['Property']['sale_amt'],0)?></span></div>
                                <div class="figType">SOLD</div>
                                <h3 class="osLight">Fixer in <?= $p['MlsData']['city'];?></h3>
                                <div class="address"></div>
                                
                            </div>
                        </a>
                    </div>
                    
                    
                    <?}?>
                    
                </div>
                
            </div>
        </div>

        <!-- Footer -->

        <div class="home-footer">
            <div class="home-wrapper">
                <div class="row">
                    
                    
                    
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="osLight footer-header">Discover</div>
                        <ul class="footer-nav pb20">
                            <li><a href="/inventory">Property List</a></li>
                           
                            <li class="hidden"><a href="/agents">Agents</a></li>
                            <li class=""><a href="/help">Help</a></li>
                            <li class=""><a href="/register">Register</a></li>
                            <li class="hidden"><a href="#">Widgets</a></li>
                            <li class="hidden"><a href="#">Components</a></li>
                            <li class="hidden"><a href="#">Tables</a></li>
                            <li class="hidden"><a href="#">Lists</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="osLight footer-header">Company</div>
                        <ul class="footer-nav pb20">
                            <li class=""><a href="/about">About</a></li>
                            <li class=""><a href="/privacy">Privacy Policy</a></li>
                            <li class=""><a href="/users/login">Employee Login</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="osLight footer-header">Contact</div>
                        <ul class="footer-nav pb20">
                            <li class="footer-phone"><span class="fa fa-phone"></span> 480 235 1400</li>
                            <li class="footer-address osLight">
                                <p>1733 N Greenfield Rd</p>
                                <p>Suite 101</p>
                                <p>Mesa, AZ 85205</p>
                            </li>
                        </ul>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="osLight footer-header">Join New Deal Mailing List</div>
                        <a href="/register" class="btn btn-lg btn-green">Click Here To Register</a>
                        <form class="hidden" role="form" action="/website/company/contact" method="post">
                            <div class="form-group">
                                
                                <input type="hidden" name="subject" value="USA Home Page Maillist Request">
                                <input type="email" name="message" class="form-control" placeholder="Email Address">
                            </div>
                            <div class="form-group">
                                <input type="submit" class="btn btn-green btn-block" value="Subscribe">
                                
                            </div>
                        </form>
                    </div>
                </div>
                <div class="copyright">RealSense, LLC &copy; <?php echo date('Y');?></div>
            </div>
        </div>

        <div class="modal fade" id="signin" role="dialog" aria-labelledby="signinLabel" aria-hidden="true">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="signinLabel">Sign In</h4>
                    </div>
                    <div class="modal-body">
                        <form role="form">
                            <div class="form-group">
                                <div class="btn-group-justified">
                                    <a href="explore.html" class="btn btn-lg btn-facebook"><span class="fa fa-facebook pull-left"></span>Sign In with Facebook</a>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="btn-group-justified">
                                    <a href="explore.html" class="btn btn-lg btn-google"><span class="fa fa-google-plus pull-left"></span>Sign In with Google</a>
                                </div>
                            </div>
                            <div class="signOr">OR</div>
                            <div class="form-group">
                                <input type="text" placeholder="Email Address" class="form-control">
                            </div>
                            <div class="form-group">
                                <input type="password" placeholder="Password" class="form-control">
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-xs-6">
                                        <div class="checkbox custom-checkbox"><label><input type="checkbox"><span class="fa fa-check"></span> Remember me</label></div>
                                    </div>
                                    <div class="col-xs-6 align-right">
                                        <p class="help-block"><a href="#" class="text-green">Forgot password?</a></p>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="btn-group-justified">
                                    <a href="explore.html" class="btn btn-lg btn-green">Sign In</a>
                                </div>
                            </div>
                            <p class="help-block">Don't have an account? <a href="#" class="modal-su text-green">Sign Up</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="signup" role="dialog" aria-labelledby="signupLabel" aria-hidden="true">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="signupLabel">Sign Up</h4>
                    </div>
                    <div class="modal-body">
                        <form role="form">
                            <div class="form-group">
                                <div class="btn-group-justified">
                                    <a href="explore.html" class="btn btn-lg btn-facebook"><span class="fa fa-facebook pull-left"></span>Sign Up with Facebook</a>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="btn-group-justified">
                                    <a href="explore.html" class="btn btn-lg btn-google"><span class="fa fa-google-plus pull-left"></span>Sign Up with Google</a>
                                </div>
                            </div>
                            <div class="signOr">OR</div>
                            <div class="form-group">
                                <input type="text" placeholder="First Name" class="form-control">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Last Name" class="form-control">
                            </div>
                            <div class="form-group">
                                <input type="text" placeholder="Email Address" class="form-control">
                            </div>
                            <div class="form-group">
                                <input type="password" placeholder="Password" class="form-control">
                            </div>
                            <div class="form-group">
                                <input type="password" placeholder="Confirm Password" class="form-control">
                            </div>
                            <div class="form-group">
                                <div class="btn-group-justified">
                                    <a href="explore.html" class="btn btn-lg btn-green">Sign Up</a>
                                </div>
                            </div>
                            <p class="help-block">Already a Reales member? <a href="#" class="modal-si text-green">Sign In</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>