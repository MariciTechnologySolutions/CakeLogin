<?php 
    $this->start('pagejs'); 
        echo $this->Html->script($asset['app']);
    $this->end(); 
?>
<div id="content" class="max">
    <div class="whiteBg">
        <h2>Help</h2>
        <div class="row gridSystem">
            <div class="col-xs-12 col-sm-12 col-md-8">
                <p style="font-size: 1.4em">
                    How may I be of service to you? <br>
                    I'll get back to you as soon as possible
                    <form method="post" action="/website/company/contact">
                        <input type="hidden" name="subject" value="USA Help Form Submission">
                        <textarea type="text" name="message" placeholder="Name, Phone, Email, Best Time" cols="80" rows="4"></textarea><br>
                        <input type="submit" name="submit" value="Submit" class="btn btn-sm btn-blue">
                    </form>
                </p>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4">
                
            </div>
        </div>
    </div>
</div>