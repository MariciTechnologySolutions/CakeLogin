<style>
    #wrapper{
        padding: 20px;
    }
    #wrapper h2{
        padding-left: 10px;
    }
</style>

<?php
foreach($controllers as $controller){
    ?>
    <h2><?=$controller;?></h2>
    <div id="<?=$controller?>">
        <?=$controllerHtml[$controller]?>
    </div>

    <?php
}
?>