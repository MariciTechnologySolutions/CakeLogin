<style type="text/css">
    .submit{
        display: inline;
    }
    input[type="submit"]{
        margin: 0 0 10px 10px
    }
    form{
        margin: 0 0 0px;
    }
    td{
        white-space: nowrap;
        text-overflow: ellipsis; 
        overflow: hidden;
    }
    @media (max-width: 979px) {
        .hide-mobile{
            display: none;
        }
       
    }
    .dataTables_length{
       width: 50%;
       float: left;
    }
    .dataTables_filter{
        width: 50%;
        float: left;
       margin-top: -5px;
    }
    .dataTables_filter input[type="search"]{
        -webkit-appearance: none;
        -webkit-user-select: text;
        background-color: rgb(255, 255, 255);
        background-image: none;
        border-bottom-color: rgb(204, 204, 204);
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-collapse: separate;
        border-image-outset: 0px;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        border-image-width: 1;
        border-left-color: rgb(204, 204, 204);
        border-left-style: solid;
        border-left-width: 1px;
        border-right-color: rgb(204, 204, 204);
        border-right-style: solid;
        border-right-width: 1px;
        border-top-color: rgb(204, 204, 204);
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        border-top-style: solid;
        border-top-width: 1px;
        box-shadow: rgba(0, 0, 0, 0.0745098) 0px 1px 1px 0px inset;
        box-sizing: border-box;
        color: rgb(85, 85, 85);
        cursor: auto;
        display: block;
        float: left;
        height: 25px;
        letter-spacing: normal;
        line-height: 18px;
        margin-bottom: 0px;
        margin-left: 0px;
        margin-right: 0px;
        margin-top: 0px;
        padding-bottom: 5px;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        position: relative;
        text-align: start;
        text-indent: 0px;
        text-rendering: auto;
        text-shadow: none;
        text-transform: none;
        transition-delay: 0s;
        transition-duration: 0s;
        transition-property: none;
        transition-timing-function: ease;
        width: 224px;
        word-spacing: 0px;
        
    }
</style>
<?php
//pr($users);
?>
<div id="content" class="max" style="background-color: white"> 
    <div class="inner-content">
        
        
        
        
        
        
        <div class="panel panel-default">
                        <div class="panel-heading">Users</div>
                        <div id="dtstuff" class="row tableContainer">
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 hidden">
                                <a href="#" class="btn btn-sm btn-blue mb5"><span class="icon-drawer"></span> Archive</a>
                                <a href="#" class="btn btn-sm btn-yellow mb5"><span class="icon-ban"></span> Report Spam</a>
                                <a href="#" class="btn btn-sm btn-red mb5"><span class="icon-trash"></span> Delete</a>
                                <div class="btn-group mb5">
                                    <a data-toggle="dropdown" class="btn btn-sm btn-gray dropdown-toggle">
                                        <span class="dropdown-label">Bulk Actions</span> <span class="caret"></span>
                                    </a>
                                    <ul class="dropdown-menu" role="menu">
                                        <li><a href="#">Mark as read</a></li>
                                        <li><a href="#">Mark as unread</a></li>
                                        <li><a href="#">Mark as important</a></li>
                                        <li><a href="#">Mark as not important</a></li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 hidden">
                                <div class="input-group input-group-sm mb5">
                                    <input type="text" class="form-control" placeholder="Search...">
                                    <span class="input-group-btn"><a class="btn btn-sm btn-green"><span class="icon-magnifier"></span></a></span>
                                </div>
                            </div>
                            
                            
                            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 hidden">
                                <div class="btn-group pull-right mb5">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-sm btn-o btn-gray dropdown-toggle" data-toggle="dropdown">
                                        1-50 of 121
                                        <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu" role="menu">
                                            <li class="disabled"><a href="#">Newest</a></li>
                                            <li><a href="#">Oldest</a></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-gray"><span class="fa fa-angle-left"></span></button>
                                    <button type="button" class="btn btn-sm btn-gray"><span class="fa fa-angle-right"></span></button>
                                </div>
                            </div>
                        </div>
                        <div class="table-overflow">
                            
                             <table cellpadding="0" cellspacing="0" border="0" class="table table-hover table-bordered bootstrap-datatable table-condensed" id="datatable">
                                    <thead> 
                                        <tr>
                                            <th class="thead hidden" id="thdate">Date<span class="thdate"></span></th>
                                            <th class="thead" id="thname">Name<span class="thname"></span></th>
                                            <th class="thead" id="thphone">Phone<span class="thphone"></span></th>
                                            <th class="thead hide-mobile" id="themail">Email<span class="themail"></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php if(!empty($users)){?>
                                        <?php foreach ($users as $user){ ?>
                                        <tr>
                                             <td class="hidden"><?php echo date('Y-m-d',$user['User']['created']);?></td>
                                            <td><a href="/users/profile/<?php echo encode($user['User']['email'])?>"><?php echo $user['User']['name'];?></a></td>

                                            <td><?php echo $user['User']['phone'];?></td>

                                            <td class="hide-mobile">
                                            <? if(!empty($user['User']['email'])){?>
                                                <a href="mailto:<?php echo $user['User']['email'];?>"><?php echo $user['User']['email'];?></a>
                                            <?}?>
                                            </td>
                                        </tr>
                                        <?php }} ?>
                                    </tbody>
                                </table>
                            
                        </div>
                    </div>
        
        
        
    </div> 
</div> 