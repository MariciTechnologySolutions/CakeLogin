<?php

App::uses('AppController', 'Controller');

class WebsiteAppController extends AppController {
    
    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow();
        //$this->autoRender = false;
        //$this->layoutPath = APP . 'View' . DS . 'Layouts';
        $this->layout = "default";
        
        
    }    
    
    /**
     * beforeFilter
     * This function set some value which are required by default for view
     */
    public function beforeRender() {
        $common_css = array(
            'font-awesome',
            'simple-line-icons',
            'jquery-ui',
            'bs_datepick',
            'bootstrap',
            'app-blue',
            'extend',
            'dataTables.bootstrap',
            'dataTables.responsive'
        );
        
        $common_js = array(
            'jquery-2.1.1.min',
            'jquery-ui.min',
            'jquery-ui-touch-punch',
            'jquery.placeholder',
            'bootstrap',
            'jquery.touchSwipe.min',
            'jquery.slimscroll.min',
            'jquery.tagsinput.min',
            'bs_datepick',
            'jquery-cookie',
            'app',
            'modals'
        );
        
        $datatable_script = array(
            'jquery.dataTables.min.js',
            'dataTables.bootstrap.js',
        );
        
        $this->set('asset', array(
            'css'               => $common_css,
            'js'                => $common_js,
            'datatable_script'  => $datatable_script,
            'infobox'           => 'infobox',
            'selectpicker'      => 'bootstrap-select.min',
            'typeahead'         => 'bootstrap-typeahead.min',
            'btypeahead'        => 'typeahead',
            'attrchange'        => 'attrchange',
            'dt_cdn'            =>'https://cdn.datatables.net/1.10.9/js/jquery.dataTables.min.js',
            'redips-drag-min'   =>'redips-drag-min',
            'redips-extend'     =>'redips-extend',
            'docManager'        =>'docManager',
            'dropzone'          =>'dropzone',
            'sortable'          =>'sortable',
            'jquery.mjs.nestedSortable' =>'jquery.mjs.nestedSortable',
            'app'               => 'app',
            'website'           => 'website'
        ));
    }
}
