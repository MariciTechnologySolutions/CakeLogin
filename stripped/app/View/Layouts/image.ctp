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
<script language="JavaScript">
    
        
        
        
        
    
</script>
<style>
    .bg{
        width: auto; 
        border: 1px solid black
    }
    .inp{
            height: 30px;
            padding: 5px 10px;
            font-size: 12px;
            line-height: 1.5;
            border-radius: 3px;
        
    }
</style>
    
<body id="body" class="notransition">
    <?php echo $this->fetch('content') ?>
    
    
    
    <div class="clearfix"></div>
    <?php 
        echo $this->Html->script($asset['js']);
        echo $this->fetch('pagejs');
        //echo $this->Html->script('app');

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