<h3>C#</h3>
<pre>
using (WebClient client = new WebClient())
{

   byte[] response = client.UploadValues("<?=$this->Html->url('/easy_api/' . $controller . '/' . $method, true)?>", new NameValueCollection()
   {
        <?=str_replace(",", "},\n        {", json_encode($params))?>
   });
}
</pre>
<br/>