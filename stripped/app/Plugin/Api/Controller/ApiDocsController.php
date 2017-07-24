<?php

App::uses('ApiAppController', 'Api.Controller');

/**
 * Class ApiDocsController
 * @property ApiComponent $Api
 */
class ApiDocsController extends ApiAppController{
    public $components = array('Api.Api');

    public function beforeFilter(){
        parent::beforeFilter();
    }

    public function index(){
        $controllers = $this->Api->controllers;
        $controllerHtml = [];
        foreach($controllers as &$controller){
            $controller = str_replace("Controller", "", $controller);
            $controllerHtml[$controller] = $this->requestAction(array('plugin' => 'api', 'controller' => 'ApiDocs', 'action' => 'docsForController', $controller));
        }

        $this->set(compact('controllers', 'controllerHtml'));
    }



    public function easyApiIntroduction(){

    }

    public function docsAsJson(){
        $this->autoRender = false;
        header('Content-Type: text/json');
        $docs = $this->Api->buildDocs();
        echo json_encode($docs);
    }


    public function docsForController($controller){
        $this->autoLayout = false;
        $docs = $this->Api->buildDocs();
        $docs = $docs[$controller];
        $this->set(compact('docs', 'controller'));
        $this->render();
    }
}