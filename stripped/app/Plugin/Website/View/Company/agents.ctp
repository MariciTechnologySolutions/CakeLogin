<?php 
    $this->start('pagejs'); 
        echo $this->Html->script($asset['app']);
    $this->end(); 
?>
<div id="content" class="max">
    <div class="whiteBg">
        <h2>Agents</h2>
        <div class="row gridSystem">
            <div class="col-xs-12 col-sm-12 col-md-4">
                <p style="font-size: 1.4em">
                    If you are a licensed real estate agent who works with investors, 
                    we would love to speak with you about our affiliate sales program.<br><br>
                    This program provides wholesale inventory in an 'agent friendly' way and 
                    allows you to bring value to your clients. 
                </p>
                
                <p style="font-size: 1.4em">
                Please provide the best way to reach you.<br>
                <form method="post" action="/website/company/contact">
                    <input type="hidden" name="subject" value="USA Agent Form Submission">
                    <textarea type="text" name="message" placeholder="Name, Phone, Email, Best Time" cols="80" rows="4"></textarea><br>
                    <input type="submit" name="submit" value="Submit" class="btn btn-sm btn-blue">
                </form>
                </p>
                
            </div>
        </div>
    </div>
</div>