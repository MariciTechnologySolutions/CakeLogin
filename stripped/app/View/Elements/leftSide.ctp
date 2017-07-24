<div id="leftSide" class="">
<nav class="leftNav scrollable">
    <div class="search">
        <span class="searchIcon icon-magnifier"></span>
        <input type="text" placeholder="Search for houses, apartments...">
        <div class="clearfix"></div>
    </div>
    <ul>
        <!--<li><a href="/dashboard"><span class="glyphicon glyphicon-dashboard navIcon"></span><span class="navLabel">Dashboard</span></a></li>-->
        
        
        <li><a href="/search/index"><span class="navIcon icon-magnifier"></span><span class="navLabel">Search</span></a></li>
        
        
        
        
        
        
        <li class="hasSub">
            <a href="#"><span class="navIcon fa fa-arrow-circle-down"></span><span class="navLabel">Finder</span><span class="fa fa-angle-left arrowRight"></span></a>
            <ul>
                <li><a href="/properties/price_drops/armls">Phoenix PriceDrops</a></li>
                <li><a href="/properties/price_drops/mfrmls">Florida PriceDrops</a></li>
                <li><a href="/properties/closest/armls">Phoenix PriceClose</a></li>
                <li><a href="/properties/closest/mfrmls">Florida PriceClose</a></li>
                <li><a href="/colony/yield_generator">Colony by Yield</a></li>
                
            </ul>
        </li>
        
        <?php 
            if(in_array(AuthComponent::user('id'),[1,32])){
        ?>
        
        <li class="hasSub">
            <a href="#"><span class="navIcon fa fa-wrench"></span><span class="navLabel">Dev</span><span class="fa fa-angle-left arrowRight"></span></a>
            <ul>
                <li><a href="/api/ApiDocs">API Documentation</a></li>
                <li><a href="/underwriting/Underwriting/tests">Underwriting Tests</a></li>
                <li><a href="/underwriting/polygons">Polygons</a></li>
                <li><a href="/underwriting/underwriting/viewByYieldForBuyer/15">Colony by Yield</a></li>
                <li><a href="/rets/cron">Cron</a></li>
                <li><a href="/nova/Mutexes">Mutexes</a></li>
                <li><a href="/job_messaging/jobs">Job Messaging</a></li>
                <li><a href="/settings/settings/index">Settings</a></li>
                <li><a href="#wikiModal" data-toggle="modal">Wiki</a></li>
            </ul>
        </li>
        
            <?php } ?>
        
        <li><a href="/colony/inventory"><span class="navIcon icon-map"></span><span class="navLabel">Maps</span></a></li>
        <li><a href="#addressSearchModal" data-toggle="modal"><span class="navIcon fa fa-bullseye"></span><span class="navLabel">ByAddress</span></a></li>
        
        <li><a href="/cash"><span class="navIcon icon-plus"></span><span class="navLabel">Add</span></a></li>
        
<!--        <li class="hasSub">
            <a href="#"><span class="navIcon icon-plus"></span><span class="navLabel">Add</span><span class="fa fa-angle-left arrowRight"></span></a>
            <ul>
                <li><a href="/cash">Add Off Market Property</a></li>
                <li><a data-toggle="modal" href="#addListingModal">Add Mls Property</a></li>
            </ul>
        </li>-->
        
        
        <li class="hasSub hidden">
            <a href="#"><span class="navIcon fa fa-share-alt-square"></span><span class="navLabel">Wholesale</span><span class="fa fa-angle-left arrowRight"></span></a>
            <ul>
                <li><a href="/wholesale/ws_contacts">Contacts</a></li>
                <li><a href="/wholesale/ws_properties">Properties</a></li>
                <li><a href="/wholesale/ws_emails">Emails</a></li>
            </ul>
        </li>
        
        
        
        
        
        
        
        <li class="hasSub">
            <a href="#">
                <span class="navIcon fa fa-line-chart">
                    
                </span><span class="navLabel">Reports</span>
                <span class="fa fa-angle-left arrowRight"></span>
                <!--<span class="badge badge-red">New!</span>-->
            </a>
            <ul>
                <li><a href="/dashboard/db1">Dashboard</a></li>
                <li><a href="/reports/pipeline">Pipeline</a></li>
                <li><a href="/dashboard/calendar/0">Calendar</a></li>
                <li><a href="/properties/stats" >Stats</a></li>
            </ul>
        </li>
        
        
        
        <li class="hasSub hidden">
            <a href="#"><span class="navIcon icon-envelope"></span><span class="navLabel">Email</span><span class="fa fa-angle-left arrowRight"></span><span class="badge bg-yellow">5</span></a>
            <ul class="colors">
                <li><a href="#">Red <span class="fa fa-circle-o c-red icon-right"></span></a></li>
                <li><a href="#">Green <span class="fa fa-circle-o c-green icon-right"></span></a></li>
                <li><a href="#">Blue <span class="fa fa-circle-o c-blue icon-right"></span></a></li>
            </ul>
        </li>
        
        
        <!--<li><a href="/inventory"><span class="navIcon icon-pointer"></span><span class="navLabel">Inventory</span></a></li>-->
        
        
        <li class="hasSub">
            <a href="#"><span class="navIcon fa fa-share-alt-square"></span><span class="navLabel">Config</span><span class="fa fa-angle-left arrowRight"></span></a>
            <ul>
                <li><a href="/investors/index/MlsPhoenix">Investors</a></li>
                <li><a href="/title/index/">Title</a></li>
                <li><a href="/buyers/index/">Buyers</a></li>
            </ul>
        </li>
        
        
        
<!--        <li><a href="/investors/index/MlsPhoenix"><span class="navIcon icon-users"></span><span class="navLabel">Investors</span></a></li>
        <li><a href="/title/index/"><span class="navIcon fa fa-bank"></span><span class="navLabel">Title</span></a></li>
        <li><a href="/buyers/index/"><span class="navIcon fa fa-users"></span><span class="navLabel">Buyers</span></a></li>-->
        
        <li>
            <a href="/sms">
                <span class="navIcon icon-envelope"></span>
                <span class="navLabel">MSG</span>
                <span class="badge badge-red" id="message_notify_num"></span>
            </a>
        </li>
        <?php if(AuthComponent::user('admin')){?>
            
            
            <li class="hasSub">
                <a href="#"><span class="navIcon fa fa-key"></span><span class="navLabel">Manage</span><span class="fa fa-angle-left arrowRight"></span></a>
                <ul>
                    <li><a href="/marketing/campaigns" target="_blank">Campaigns</a></li>
                    <li><a href="/tasks/templates" target="_blank">Task Templates</a></li>
                    <li><a href="/templates" target="_blank">Email Templates</a></li>
                    <li><a href="/masters" target="_blank">Masters</a></li>
                    <li><a href="/documents" target="_blank">Documents</a></li>
                    <li><a href="/jobs" target="_blank">Jobs</a></li>
                    <li><a href="/job-schedular" target="_blank">Job Schedulers</a></li>
                    <li><a href="/job-queue" target="_blank">Job Queues</a></li>
                    <li><a href="/files/doc_types" target="_blank">Doc Types</a></li>
                    <li><a href="/alerts/mls" target="_blank">RETS Status</a></li>
                </ul>
            </li>
            
            
        <?php }?>
        <li class="hasSub hidden">
            <a href="#"><span class="navIcon icon-link"></span><span class="navLabel">Pages</span><span class="fa fa-angle-left arrowRight"></span></a>
            <ul>
                <li><a href="">Sign In</a></li>
                <li><a href="">Sign Up</a></li>
                
            </ul>
        </li>
    </ul>
</nav>
<div class="leftUserWraper dropup hidden">
    <a href="#" class="avatarAction dropdown-toggle" data-toggle="dropdown">
        <img class="avatar" src="/images/avatar-1.png" alt="avatar"><span class="counter">5</span>
        <div class="userBottom pull-left">
            <span class="bottomUserName"><?php echo AuthComponent::user('name');?></span> <span class="fa fa-angle-up pull-right arrowUp"></span>
        </div>
        <div class="clearfix"></div>
    </a>
    <ul class="dropdown-menu" role="menu">
        <li><a href="#"><span class="icon-settings"></span>Settings</a></li>
        <li><a href="/users/profile"><span class="icon-user"></span>Profile</a></li>
        <li><a href="#"><span class="icon-bell"></span>Notifications <span class="badge pull-right bg-red">5</span></a></li>
        <li class="divider"></li>
        <li><a href="/users/logout"><span class="icon-power"></span>Logout</a></li>
    </ul>
</div>
</div>
<div class="closeLeftSide"></div>