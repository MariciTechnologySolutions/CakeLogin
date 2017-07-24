<?php
App::uses('WebsiteAppController', 'Website.Controller');

class InventoryController extends WebsiteAppController {
    
    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('feed');
    }
    
    public function index(){
       
        $this->loadModel('Property');
        $options = array(
            'conditions'=>array(
                'Property.salestatus_id'=>30
            )
        );
        $properties = $this->Property->find('all',$options);
        $this->set('properties',$properties);
        
    }
    
    public function feed(){

        $this->loadModel('Property');
        $options = array(
            'conditions'=>array(
                'Property.salestatus_id'=>30
            ),
            'fields'=>array(
                'Property.sale_amt',
                'Property.marketing_comment',
                'MlsData.mlssource_table',
                'MlsData.street_number',
                'MlsData.street_compass',
                'MlsData.street_name',
                'MlsData.street_suffix',
                'MlsData.city',
                'MlsData.zipcode',
                'MlsData.appx_sqft',
                'MlsData.year_built',
                'MlsData.appx_lot_sqft',
                'MlsData.apn',
                'MlsData.bathrooms',
                'MlsData.bedrooms',
                'MlsData.county_code',
                'MlsData.dwelling_type',
                'MlsData.subdivision',
                'MlsData.latitude',
                'MlsData.longitude',
                'MlsData.images',
                'Salestatus.name'
                ),
            'contain'=>array('MlsData','Salestatus')
        );
        $properties = $this->Property->find('all',$options);
        $this->autoRender = false;
        return json_encode($properties);
        //exit;
    }
}
