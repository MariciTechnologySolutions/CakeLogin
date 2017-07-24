<?php 
    $this->start('pagejs'); 
        echo $this->Html->script($asset['app']);
    $this->end(); 
?>
<div id="content" class="max">
    <div class="whiteBg">
        <h4>Blog</h4>
        <div class="row gridSystem">
            <div class="col-xs-12 col-sm-12 col-md-8">
                <div class="panel panel-default">
                    <div class="panel-body">col-xs-12 col-md-8</div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
                <div class="panel panel-default">
                    <div class="panel-body">col-xs-6 col-md-4</div>
                </div>
            </div>
        </div>
    </div>
</div>