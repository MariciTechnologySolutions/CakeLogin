<h3>Wget</h3>
<pre>
wget <?=$this->Html->url('/easy_api/' . $controller . '/' . $method, true)?>?<?=http_build_query($params)?>
</pre>
<br/>