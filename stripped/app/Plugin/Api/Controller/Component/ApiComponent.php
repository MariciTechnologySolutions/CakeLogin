<?php

App::uses('Component', 'Controller');

/**
 * Class ApiComponent
 * @property ApiAppController $Controller
 */
class ApiComponent extends Component {

  public $Controller;
  public $components = array('Auth', 'Session');
  public $controllers = array(
      'V1Controller',
  );

  public function initialize(Controller $controller) {
    $this->Controller = $controller;
  }

  public function isTokenValid($token) {
    $this->EasyApiToken = ClassRegistry::init('EasyApiToken');


    if ($token == false) {
      return false;
    }

    $EasyAPIToken = $this->EasyApiToken->findByToken($token);



    if (!empty($EasyAPIToken) && $EasyAPIToken['EasyApiToken']['enabled'] == 1) {
      $updateData = array(
          'id' => $EasyAPIToken['EasyApiToken']['id'],
          'uses' => $EasyAPIToken['EasyApiToken']['uses'] + 1,
          'last_use_ip' => $_SERVER['REMOTE_ADDR'],
          'last_use_time' => date('Y-m-d H:i:s'),
      );
      $this->EasyApiToken->save($updateData);
      return true;
    } else {
      return false;
    }
  }

  public function buildDocs() {
    App::uses('APIDefinitionGenerator', 'Api.Lib');
    $defGenerator = new APIDefinitionGenerator();


    $docs = array();

    foreach ($this->controllers as $controller) {
      $docs[str_replace("Controller", "", $controller)] = $defGenerator->extractDocsFromClass($controller, 'Api.Controller');
    }

    return $docs;
  }

}
