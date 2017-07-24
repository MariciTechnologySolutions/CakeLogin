<h3>Ruby</h3>
<pre>
uri = URI('<?=$this->Html->url('/easy_api/' . $controller . '/' . $method, true)?>?<?=http_build_query($params)?>')
Net::HTTP.get(uri) # => String
</pre>
<br/>