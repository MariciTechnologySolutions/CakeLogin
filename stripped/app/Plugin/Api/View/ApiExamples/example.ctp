<style>
    #wrapper{
        padding: 20px;
    }
    #wrapper h2{
        padding-left: 10px;
    }
</style>

<style>
    pre {
        font-family: courier, monospace;
        font-size: 12px;
        white-space: pre-wrap;       /* css-3 */
         white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
         white-space: -pre-wrap;      /* Opera 4-6 */
         white-space: -o-pre-wrap;    /* Opera 7 */
         word-wrap: break-word;       /* Internet Explorer 5.5+ */
    }
</style>
<h2>Test <?=$controller?>.<?=$method?></h2>
<form method="<?=$methodType?>" action="<?=$this->Html->url('/api/' . $controller . '/' . $method, true)?>" enctype="<?=$encType?>">
    <?php
        foreach($docs['requestParam'] as $param => $info){
                switch($info['type']){
                    case 'string':
                    case 'array':
                    case 'int':
                    case 'double':
                        ?>
                            <label for="<?=$param?>"><?=$param?></label><input type="text" name="<?=$param?>" placeholder="<?=$param?>"/><br/>
                        <p style="font-size: 10px;">Info: <?=htmlspecialchars($info['description'])?></p><br/>
                        <?php
                        break;
                    case 'file':
                        $specialExample = true;
                        ?>
                        <label for="<?=$param?>"><?=$param?></label><input type="file" name="<?=$param?>" placeholder="<?=$param?>"/><br/>
                        <p style="font-size: 10px;">Info: <?=htmlspecialchars($info['description'])?></p><br/>
                        <?php
                        break;
                }
        }
    ?>
    <?php
       if(isset($docs['table'])){
           ?>Any field from the following tables:<?php
           foreach($docs['table'] as $table){
               ?> <a href="http://help.infusionsoft.com/developers/tables/<?=strtolower($table)?>" target="_blank"><?=$table?></a>&nbsp;&nbsp;<?php
           }
           ?><br/><br/><?php
       }
    ?>
    <input type="submit">
</form>
<br/>
<br/>
<h1>Sample Code</h1>
<br/>
<?php
    foreach($docs['requestParam'] as $param => $info){
        $params[$param] = 'VALUE';
    }

foreach($languages as $language => $languageExampleFile){
    echo $this->element($languageExampleFile, compact('params', 'controller', 'method', 'docs'));
}
?>



<br/>
<br/>
<br/>
