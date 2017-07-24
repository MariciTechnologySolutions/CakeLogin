<?php
/**
 * Created by JetBrains PhpStorm.
 * User: joey
 * Date: 1/8/14
 * Time: 9:25 AM
 * To change this template use File | Settings | File Templates.
 */
App::uses('ApiAppController', 'Api.Controller');

class ApiExamplesController extends ApiAppController {
    public $components = array('Api.Api');

    public function example($controller, $method){
        $docs = $this->Api->buildDocs();

        $docs = $docs[$controller][$method];

        $methodType = 'GET';
        $encType = 'application/x-www-form-urlencoded';

        if(isset($docs['isPost']) && $docs['isPost'][0] == 'true'){
            $methodType = 'POST';
        }

        if(isset($docs['encType'])){
            $encType = $docs['encType'][0];
        }

        $availableLanguages = array('wget', 'php_curl', 'ruby', 'nodejs', 'c_sharp', 'ios');
        $languages = array();

        foreach($availableLanguages as $language){
            $customElementName = 'ApiExamples/' . $controller . '/' . $method . '/' . $language;
            $customElementPath = dirname(dirname(__FILE__)) . '/View/Elements/' . $customElementName . '.ctp';

            if(file_exists($customElementPath)){
                $languages[$language] = $customElementName;
            } else {
                $languages[$language] = 'ApiExamples/defaults/' . $language;
            }
        }

        $this->set(compact('docs', 'controller', 'method', 'tokens', 'methodType', 'encType', 'languages'));
    }
}