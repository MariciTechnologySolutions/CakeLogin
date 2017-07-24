<?php

/**
 * Created by JetBrains PhpStorm.
 * User: joey
 * Date: 12/28/13
 * Time: 4:49 PM
 * To change this template use File | Settings | File Templates.
 */
App::uses('ApiAppController', 'Api.Controller');

/**
 * Class BaseApiController
 * @property
 */
class BaseApiController extends ApiAppController {

  public $components = array('Api.Api');
  public $jsonData = array();
  private $errorMessage = '';
  public $data_response = array(
      "success" => false,
      "data" => "",
      "message" => "Service temporarily unavailable."
  );

  protected function parseData() {
    $this->jsonData = $this->parseJsonData();

    $data = array_merge($this->request->query, $this->request->data, $this->data, $this->jsonData);

    $this->data = $data;
  }

  public function beforeFilter() {
    parent::beforeFilter();
    $this->parseData();
    $this->Auth->allow();
    if ($this->request->url != 'api/V1/login' && (!isset($this->data['token']) || $this->data['token'] == '' || !$this->Api->isTokenValid($this->data['token']))) {
      echo json_encode(array('status' => 'fail', 'data' => null, 'message' => 'Invalid token'));
      die();
    }

    $this->layout = 'jsonp';
    $this->autoRender = false;
  }

  public function beforeRender() {
    $response = $this->viewVars['json'];
    if (!is_array($response)) {
      $response = json_decode($response, true);
    }

    if ($response['success'] == false) {
      CakeLog::write('error', 'Api call returned error! JSON: ' . json_encode($response));
    }

//        $this->redirectAfterApiCall();
    $this->view = 'json';
    parent::beforeRender();
  }

//    public function redirectAfterApiCall(){
//        $redirectUrl = null;
//
//        if (array_token_exists('redirectUrl', $this->data)){
//            $redirectUrl = $this->data['redirectUrl'];
//        } elseif (array_token_exists('RedirectUrl', $this->data)){
//            $redirectUrl = $this->data['RedirectUrl'];
//        }
//
//        if ($redirectUrl != null){
//            CakeLog::write('info', 'Api call redirected. API JSON result: ' . (is_array($this->viewVars['json']) ? json_encode($this->viewVars['json']) : $this->viewVars['json']));
//            if (strpos($redirectUrl, 'http') !== 0){
//                $redirectUrl = 'http://' . $redirectUrl;
//            }
//            $this->redirect($redirectUrl);
//        }
//    }


  protected function parseJsonData() {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data == null)
      $data = [];
    return $data;
  }

  public function convert_response_data($dataresponse = array(), $datatype = "json") {
    $tmpdataresponse = $dataresponse;

    $dataresponse = json_encode($dataresponse);

    if ($dataresponse == "") {
      $dataresponse = $this->_json_encode($tmpdataresponse);
    }

    return $dataresponse;
  }

  // alternative json_encode
  function _json_encode($val) {
    if (is_string($val))
      return '"' . addslashes($val) . '"';
    if (is_numeric($val))
      return $val;
    if ($val === null)
      return 'null';
    if ($val === true)
      return 'true';
    if ($val === false)
      return 'false';

    $assoc = false;
    $i = 0;
    foreach ($val as $k => $v) {
      if ($k !== $i++) {
        $assoc = true;
        break;
      }
    }
    $res = array();
    foreach ($val as $k => $v) {
      $v = $this->_json_encode($v);
      if ($assoc) {
        $k = '"' . addslashes($k) . '"';
        $v = $k . ':' . $v;
      }
      $res[] = $v;
    }
    $res = implode(',', $res);
    return ($assoc) ? '{' . $res . '}' : '[' . $res . ']';
  }

  function createkey($user = array()) {
    $keygenerate = "";
    if ($user) {
      $datakey_generate = array();
      $datakey_generate['id'] = $user['User']['id'];
      $datakey_generate['username'] = $user['User']['username'];



      $datakey_generate['remote_address'] = $_SERVER['REMOTE_ADDR'];
      $datakey_generate['timestamp'] = time();

      $key_String = implode($_SERVER['REMOTE_PORT'], $datakey_generate);

      $keygenerate = sha1($key_String);

      $this->loadModel('Api.EasyApiToken');


      $tokenData['token'] = $keygenerate;
      $tokenData['enabled'] = 1;
      $tokenData['uses'] = 1;
      $tokenData['last_use_ip'] = $_SERVER['REMOTE_ADDR'];
      $tokenData['last_use_time'] = date('Y-m-d H:i:s');
      $tokenData['user_id'] = $datakey_generate['id'];
      $tokenData['created_at'] = date('Y-m-d H:i:s');
      $tokenData['updated_at'] = date('Y-m-d H:i:s');

      $this->EasyApiToken->save($tokenData);
    }
    return $keygenerate;
  }

}
