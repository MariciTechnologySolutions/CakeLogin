<h3>node.js</h3>
<pre>
http.get("<?=$this->Html->url('/easy_api/' . $controller . '/' . $method, true)?>?<?=http_build_query($params)?>", function(res) {
  console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
</pre>
<br/>