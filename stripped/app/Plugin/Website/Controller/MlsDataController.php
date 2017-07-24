<?php
App::uses('WebsiteAppController', 'Website.Controller');

class MlsDataController extends WebsiteAppController {
    
    public $components = array('Paginator');
   
    public $uses = array("MlsData","Property");
    
    
    public function index( $status="Sale" ){
        
        Configure::write('debug', 2);
        
        
        $Property = ClassRegistry::init('Property');
        
        $statusText = array(
            "Sale"      => 30,
            "Pending"   => 40,
            "Sold"      => 50
        );
        
//        $sql = "select * 
//                from mls_data MlsData
//                join properties Property on Property.mls_data_id = MlsData.id
//                join salestatuses Salestatus on Salestatus.id = Property.salestatus_id
//                where Salestatus.id = $statusText[$status]";
        
        $options = [
            'conditions'=>[
                'Property.salestatus_id'=>$statusText[$status]
            ],
            'contain'=>['MlsData','Salestatus'],
            //'fields'=>['MlsData.address','MlsData.images','Property.sale_amt','MlsData.bedrooms','MlsData.bathrooms','MlsData.year_built','MlsData.appx_sqft']
        ];
        
        $data = $Property->find('all',$options);
        
        $this->set(
                array(
                    "dropdownText"   => $statusText, 
                    "properties"     => $data,
                    "statusSelected" => $status
                )
        );
    }
    
    public function view($id) {
        //uses transaction id
        Configure::write('debug', 2);
        $this->loadModel('Property');
        
        
        $options = array(
            'conditions'=>[
                'Property.id'=>$id
            ],
            'contain'=>['MlsData']
        );
        $property = $this->Property->find('first',$options);
        
        $options = [
            'conditions'=>[
                'User.id'=>$property['Property']['user_id']
            ],
            'contain'=>[],
            'fields'=>['email','name','phone']
        ];
        $this->loadModel('User');
        $agent = $this->User->find('first',$options);
        
        
        $this->set([
            'property'=>$property,
            'agent'=>$agent['User']
        ]);
    }
    
    public function new_property(){
        
        $isLoggedIn = false;
        if(!empty($this->Auth->user('id'))){
            $isLoggedIn = true;
        }
        $this->set('isLoggedIn',$isLoggedIn);
        
    }
    
}
