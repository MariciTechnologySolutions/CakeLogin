<h3>iOS</h3>
<?php
$iosParts = array();
foreach($params as $paramToken => $paramValue){
    $iosParts[$paramToken] = '%s';
    $iosStringSubs[$paramToken] = '[self.txt' . ucfirst($paramToken) . '.text UTF8String]';
}
?>
<pre>
NSString *restCallString = [NSString stringWithFormat:@"<?=$this->Html->url('/easy_api/' . $controller . '/' . $method, true)?>?<?=str_replace("%25", "%", http_build_query($iosParts))?>",<?=implode(',', $iosStringSubs)?>];
(other code to make call goes here :)  )
</pre>
<br/>