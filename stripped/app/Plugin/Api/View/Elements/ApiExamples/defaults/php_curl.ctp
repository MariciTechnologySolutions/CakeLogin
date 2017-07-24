<h3>PHP Curl</h3>
<pre>
$ch = curl_init('<?=$this->Html->url('/easy_api/' . $controller . '/' . $method, true)?>');
$params = <?=var_export($params)?>;
curl_setopt($ch, CURLOPT_POSTFIELDS,  http_build_query($params);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_POST, 1);
curl_exec($ch);
curl_close($ch);
</pre>
<br/>