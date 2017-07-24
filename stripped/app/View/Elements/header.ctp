<div id="header" class="" style="background-color: #1d82aa">
    <div class="logo">
        <a href="/search/index">
            <span class="fa fa-home marker"></span>
            <span class="logoText">RealSense</span>
        </a>
    </div>
    <a href="#" class="navHandler" style="color: white"><span class="fa fa-bars"></span></a>
    
    <div class="search visible-lg visible-md" style="display:inline">
    
        <span class="searchIcon icon-magnifier" style="margin-right: 10px"></span>

        <input id="quicksearch" name="quicksearch" type="text" class="form-control" value="<?php echo isset($_GET['quicksearch']) ? htmlspecialchars($_GET['quicksearch']) : "";?>" style="margin-top: 12px;width: 300px;background-color: inherit;color:white" placeholder="Search Address, Mls ID, PID ...">
                
    </div>
    
    <?php if(AuthComponent::User()){?>
    <div class="headerUserWraper">
        
        <a href="#" class="userHandler dropdown-toggle" data-toggle="dropdown"><span class="icon-user" style="color: white"></span><span class="counter"></span></a>
        
        <a href="#" class="headerUser dropdown-toggle" data-toggle="dropdown">
            <img class="avatar headerAvatar pull-left hidden" src="/images/avatar-1.png" alt="avatar">
            <div class="userTop pull-left">
                <span class="headerUserName" style="color: white"><?php echo ucwords(AuthComponent::User('name'));?></span> <span class="fa fa-angle-down" style="color: white"></span>
            </div>
            <div class="clearfix"></div>
        </a>
        
        
        
        <div class="dropdown-menu pull-right userMenu" role="menu">
            <ul>
                <?php if(AuthComponent::User('admin')){?>
                <li><a href="/users/index"><span class="icon-users"></span>Users</a></li>
                <li><a data-toggle="modal" href="#userInvite"><span class="icon-settings"></span>Invite User</a></li>
                <?php }?>
                <li><a href="/users/profile"><span class="icon-user"></span>Profile</a></li>
                <li class="hidden"><a href="#"><span class="icon-bell"></span>Notifications <span class="badge pull-right bg-red">5</span></a></li>
                <li class="divider"></li>
                <li><a href="/users/logout"><span class="icon-power"></span>Logout</a></li>
            </ul>
        </div>
        
        
        
    </div>
    <?php }?>
    
    <div class="headerNotifyWraper hidden">
        <a href="#" class="headerNotify dropdown-toggle" data-toggle="dropdown">
            <span class="notifyIcon icon-bell"></span>
            <span class="counter">5</span>
        </a>
        <div class="dropdown-menu pull-right notifyMenu" role="menu">
            <div class="notifyHeader">
                <span>Notifications</span>
                <a href="#" class="notifySettings icon-settings"></a>
                <div class="clearfix"></div>
            </div>
            <ul class="notifyList">
                <li>
                    <a href="#">
                        <img class="avatar pull-left" src="/images/avatar-1.png" alt="avatar">
                        <div class="pulse border-grey"></div>
                        <div class="notify pull-left">
                            <div class="notifyName">Sed ut perspiciatis unde</div>
                            <div class="notifyTime">5 minutes ago</div>
                        </div>
                        <div class="clearfix"></div>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <div class="notifyRound notifyRound-red fa fa-envelope-o"></div>
                        <div class="pulse border-red"></div>
                        <div class="notify pull-left">
                            <div class="notifyName">Lorem Ipsum is simply dummy text</div>
                            <div class="notifyTime">20 minutes ago</div>
                        </div>
                        <div class="clearfix"></div>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <div class="notifyRound notifyRound-yellow fa fa-heart-o"></div>
                        <div class="pulse border-yellow"></div>
                        <div class="notify pull-left">
                            <div class="notifyName">It is a long established fact</div>
                            <div class="notifyTime">2 hours ago</div>
                        </div>
                        <div class="clearfix"></div>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <div class="notifyRound notifyRound-magenta fa fa-paper-plane-o"></div>
                        <div class="pulse border-magenta"></div>
                        <div class="notify pull-left">
                            <div class="notifyName">There are many variations</div>
                            <div class="notifyTime">1 day ago</div>
                        </div>
                        <div class="clearfix"></div>
                    </a>
                </li>
            </ul>
            <a href="#" class="notifyAll">See All</a>
        </div>
    </div>
    <div class="maptag visible-xs visible-sm visible-md visible-lg"></div>
    <div class="clearfix"></div>
</div>