<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="icon" type="image/png" href="favico.png" />
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <title>RealSense</title>
        <?php 
                echo $this->Html->css($asset['css']); 
                echo $this->Html->css('fullscreen-slider'); 
                echo $this->fetch('pagecss');
        ?>
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body class="notransition">
        
        <?php
            if(@$this->request->params['pass'][0] != 'homepage'){
                
                if(AuthComponent::user()){         
                    include(APP . 'View' . DS . 'Elements' . DS . 'header.ctp');
                    include(APP . 'View' . DS . 'Elements' . DS . 'leftSide.ctp');
                }else{ 
                    echo $this->element('Website.header');
                    echo $this->element('Website.leftSide');
                }
                echo '<div id="wrapper" class="">';
            }
        ?>
        
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
        <div id="" class="">
            <?= $this->fetch('content') ?>
            <div class="clearfix"></div>
        </div>
        
        <?php 
            echo $this->Html->script($asset['js']);//common js files
            echo $this->fetch('pagejs');//fetches items at the top of each page.
            
            if(@$this->request->params['pass'][0] != 'homepage'){
                echo '</div>';
            }
        ?>
</body>