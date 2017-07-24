<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <title>Us-Acquisitions</title>
        <?php 
                echo $this->Html->css($asset['css']); 
                echo $this->fetch('pagecss');
        ?>
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body class="notransition">
        <div id="loaderNotifier">
            Please wait..
        </div>
        <div id="wrapper" class="">
            <!------------------------------------>  
            <? 
            $msg = $this->Session->flash();
            if(!empty($msg)){
            echo $msg; ?>
            <script>
                setTimeout(function(){
                    $('#flashMessage').fadeOut('slow');
                },2500);    
            </script>
            <? } ?>
            <?php echo $this->fetch('content') ?>
            <?//pr($this->request->params);?>
            
                
            <?if(1==2){?>
            <div id="mapView" style="background-color: lightblue">
                <!--<div class="mapPlaceholder"><span class="fa fa-spin fa-spinner"></span> Loading map...</div>-->
            </div>
            <div id="split-bar"></div>
            <div id="content"> 
                <div class="inner-content">
                    <?//= $this->fetch('content') ?>
                </div>
            </div> 
            <?}?>
            <? if(1==2){?> 
            <div id="content" class="max"> 
                <div class="inner-content">
                </div> 
            </div> 
            <? } ?>
            <!------------------------------------>    
            <div class="clearfix"></div>
        </div>
        <?php 
            //echo $this->Html->script($asset['map_script']);    
            echo $this->Html->script($asset['js']);
            echo $this->fetch('pagejs');
            echo $this->Html->script('app');
            //for javascript specific to a controller. create controller.js where 'controller' is the actual controller name. Autoloads for that controller
            $controller = $this->request->params['controller'];
            $action     = $this->request->params['action'];

            if(empty($action))$action = 'index';

            $file = WWW_ROOT . 'js/controller_js/'.$controller . '_' . $action . '.js';
            if(file_exists($file)){
                $js = '/js/controller_js/'. $controller . '_' . $action . '.js';
                echo '<script src="'.$js.'"></script>';
            }
        ?>
</body>