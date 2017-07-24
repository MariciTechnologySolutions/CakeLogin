<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="icon" type="image/png" href="/favico.png" />
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <title>RealSense</title>
        <?php 
                echo $this->Html->css($asset['css']); 
                echo $this->fetch('pagecss');
        ?>
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body id="body" class="notransition" style="">
        
        
        <?php 
            
            if(AuthComponent::user()){         
                echo $this->element('header'); 
                echo $this->element('leftSide'); 
            }else{ 
                echo $this->element('Website.header');
                echo $this->element('Website.leftSide');

            }
        ?>
        <div id="wrapper" class="">

            <?php 
                $msg = $this->Session->flash();
                if(!empty($msg)){
                echo $msg; 
            ?>
            <script>
                setTimeout(function(){
                    $('#flashMessage').fadeOut('slow');
                },2500);    
            </script>
            <?php } ?>
            <?php echo $this->fetch('content') ?>
            <?php //pr($this->request->params);?>
            
                
            <?php if(1==2){?>
            <div id="mapView" style="background-color: lightblue">
                <!--<div class="mapPlaceholder"><span class="fa fa-spin fa-spinner"></span> Loading map...</div>-->
            </div>
            <div id="split-bar"></div>
            <div id="content"> 
                <div class="inner-content">
                    <?php//= $this->fetch('content') ?>
                </div>
            </div> 
            <?php }?>
            <?php if(1==2){?> 
            <div id="content" class="max"> 
                <div class="inner-content">
                </div> 
            </div> 
            <?php } ?>
            <!------------------------------------>    
            <div class="clearfix"></div>
        </div>
        <?php echo $this->element('userInviteModal'); ?>
        <?php echo $this->element('addListing'); ?>
        <?php echo $this->element('addressSearchModal'); ?>
        <?php echo $this->element('wikiModal'); ?>
        <?php echo $this->element('propertyDetail'); ?>
         
        <?php 
            //echo $this->Html->script($asset['map_script']);
            
            echo $this->Html->script($asset['js']);
            echo $this->Html->script('/tinymce/tinymce.min');
            echo $this->fetch('pagejs');
            echo $this->Html->script('geocomplete');
            //if(strpos('local',$_SERVER['HTTP_HOST']) !== false){
                //echo $this->Html->script('geocode');
            //}
            
            echo $this->Html->script('app');
            
            //for javascript specific to a controller. create controller.js where 'controller' is the actual controller name. Autoloads for that controller
            $plugin     = $this->request->params['plugin'];
            $controller = $this->request->params['controller'];
            $action     = $this->request->params['action'];

            if(empty($action))$action = 'index';


            if($plugin == null){
                $fileName = $controller . '_' . $action . '.js';
            } else {
                $fileName = $plugin . '_' . $controller . '_' . $action . '.js';
            }

        $file = WWW_ROOT . 'js/controller_js/'. $fileName;

        if(file_exists($file)){
            $js = '/js/controller_js/'. $fileName;
            echo '<script src="'.$js.'"></script>';
        }

        ?>
        <?php if(Configure::read('debug') == 2) echo '<div class="hidden" id="exception"></div>';?>
        <audio id="sound1" src="/uploads/all-eyes-on-me.mp3" preload="auto"></audio>
</body>