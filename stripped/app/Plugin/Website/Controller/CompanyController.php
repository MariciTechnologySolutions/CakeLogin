<?php
App::uses('WebsiteAppController', 'Website.Controller');

class CompanyController extends WebsiteAppController {
    
    public function index(){
        //home page /website/company/index
        
        $this->loadModel('Property');
        $properties = $this->Property->find('all',array(
            'conditions'=>array('Property.salestatus_id'=>array('40','50')),
            'contain'=>array('MlsData'),
            'order'=>array('Property.id'=>'asc')
        ));
        $this->set('properties',$properties);
       
        $count= count($properties);
        $cnt_arr = array();
        for($i=0;$i<$count;$i++){
            $cnt_arr[] = $i;
        }

        $random = array_rand($cnt_arr, 3);
        
        $this->set('random',$random);
    }
    
    /**
     * several basic contact forms on the public site. 
     * post subject and message
     */
    public function contact(){
        
        if($this->request->is('post') && !empty($this->request->data['message'])){
            $this->Session->setFlash('Not Available');
            $this->redirect('/'); 
            exit;
            $this->autoRender = false;
            App::uses('CakeEmail', 'Network/Email');
            $subject = $this->request->data['subject'];
            $message = $this->request->data['message'];//email address
            $email = new CakeEmail('mailgun');
            $email->from('steve@us-acquisitions.com');
            $email->to('steve@us-acquisitions.com');
            $email->subject($subject);
            $email->send($message);

            $this->Session->setFlash('Message Sent');
            $this->redirect('/'); 
        }else{
            $this->redirect('/');
        }
        exit;
    }
    
    public function about(){}
    
    public function blog(){}
    
    public function register(){
        
        
        $message_id = '';
        if(!empty($this->request->params['pass'][0])){
            $this->Session->setFlash('Not Available');
            $this->redirect('/');
            exit;
            //MarketingEmail.id
            $message_id = decode($this->request->params['pass'][0]);
            $this->loadModel('MarketingEmail');
            $this->loadModel('MarketingProspect');
            $email = $this->MarketingEmail->find('first',array('conditions'=>array('MarketingEmail.id'=>$message_id)));
            if(empty($email)){
                $this->Session->setFlash('Link not recognized');
                $this->redirect('/inventory');
            }
            $prospect_id = $email['MarketingEmail']['prospect_id'];
            $prospect = $this->MarketingProspect->find('first',array('conditions'=>array('MarketingProspect.id'=>$prospect_id)));
            
            /*
             * add user click through data. but not subscribed.
             */
            $data = [];
            $data['id'] = $message_id;
            $data['user_clicked'] = date('Y-m-d G:i:s');
            $data['user_action'] = 'register';
            $this->MarketingEmail->save($data);
        }
        
        $campaign_id = !empty($prospect['MarketingProspect']['campaign']) ? $prospect['MarketingProspect']['campaign'] : '';
        $market = !empty($prospect['MarketingProspect']['market']) ? str_replace('Mls','',$prospect['MarketingProspect']['market']) : '';
        $name = !empty($prospect['MarketingProspect']['name']) ? $prospect['MarketingProspect']['name'] : '';
        $phone = !empty($prospect['MarketingProspect']['phone']) ? formatPhone($prospect['MarketingProspect']['phone']) : '';
        $email = !empty($prospect['MarketingProspect']['email']) ? $prospect['MarketingProspect']['email'] : '';
        
        $this->loadModel('Master');
        $markets = $this->Master->find('list',array('conditions'=>array('Master.parent_id'=>22)));
        
        $this->set(array(
            'campaign_id'=>$campaign_id,
            'message_id'=>$message_id,
            'mkt'=>$market,
            'name'=>$name,
            'phone'=>$phone,
            'email'=>$email,
            'markets'=>$markets
        ));
        
    }
    
    public function agents(){}
    
    public function help(){}
    
    public function privacy(){}
    
}