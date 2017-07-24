<div style="">Methods:
    <?php
    foreach($docs as $method => $doc){
        ?>
            <a href="#<?=$method?>"><?=$method?></a>&nbsp;&nbsp;
        <?php
    }
?>

    <?php
        foreach($docs as $method => $doc){
           ?>
            <a name="<?=$method?>"></a>
            <h2 style="margin-top: 40px"><?=$method?> </h2>
            <br/>
            <div style="margin-left: 10px">
                <p>
                <?=$this->Html->url('/api/' . $controller . '/' . $method, true)?>
                </p>
                <p>
                    Example and Sample Code: <a href="<?=$this->Html->url('/api/ApiExamples/example/' . $controller . '/' . $method, true)?>">Click Here</a>
                </p>

                <p><?=htmlspecialchars(isset($doc['shortDesc']) ? $doc['shortDesc'] : 'No Short Description')?></p>

                <?php
                if(isset($doc['longDesc']) && $doc['longDesc'] != ''){
                    ?>
                    <p><?=htmlspecialchars($doc['longDesc'])?></p>
                <?php
                }


                ?>

                <h3>Parameters</h3>
                <table border="1">
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Type
                        </th>
                        <th>
                            Info
                        </th>
                    </tr>
                    <?php
                    foreach($doc['requestParam'] as $name => $info){
                        ?>
                        <tr>
                            <td>
                                <?=$name?>
                            </td>
                            <td>
                                <?=$info['type']?>
                            </td>
                            <td>
                                <?=$info['description']?>
                            </td>
                        </tr>
                        <?php
                    }
                    ?>
                </table>

                <h3 style="margin-top: 10px;">Returns</h3>
                <div>
                    <?=htmlspecialchars(isset($doc['return']) ? $doc['return']['type'] . ' ' . $doc['return']['description'] : 'No Return Info')?>
                </div>
                <br/>
            </div>
            <?php
        }
    ?>
</div>