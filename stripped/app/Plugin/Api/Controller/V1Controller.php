<?php

/**
 * Created by PhpStorm.
 * User: Joey
 * Date: 7/17/2017
 * Time: 1:53 PM
 */
App::uses('BaseApiController', 'Api.Controller');

class V1Controller extends BaseApiController {

  /**
   * This method returns an api token if correct credentials are provided.
   *
   * @requestParam string $username
   * The users username
   *
   * @requestParam string $password
   * The users password
   *
   * @return jsend {"success":true,"data":{"token": (token), "roles": [])}
   */
  public function login() {

    $success = false;
    $msg = "Service temporarily unavailable.";


    $data_login = array();

    if (isset($this->data['username']) && !empty($this->data['username']) && isset($this->data['password']) && !empty($this->data['password'])) {

      $this->loadModel('User');



      $user = $this->User->findByUsername($this->data['username']);
      if (!empty($user) && ($user['User']['password'] == $this->Auth->password($this->data['password']))) {
        $userId = $user['User']['id'];

        $success = true;
        $token = $this->createkey($user);
        $roles = array();
        $msg = "";

        if ($user['User']['role'] != '') {
          $roles[] = $user['User']['role'];
        }

        $data_login['token'] = $token;
        $data_login['roles'] = $roles;
      } else {
        $msg = "Invalid credential";
      }
    } else {
      $msg = "Request parameter is missing";
    }

    $this->data_response['data'] = $data_login;
    $this->data_response['message'] = $msg;
    $this->data_response['success'] = $success;

    //pr($this->data_response);


    $this->viewVars['json'] = $this->convert_response_data($this->data_response);

    //Set Data from Controller to view
    $this->set('viewVars', $this->viewVars);
    // For Render the view in webservice.
    $this->render('json');
  }

  /**
   * This method returns an api token if correct credentials are provided.
   *
   * @requestParam string $token
   * The token to test / renew / get info for.
   *
   * @return jsend {"success":true,"data":{"username": "...", "token": "...", "roles": [])}
   */
  public function getTokenInfo() {

    $success = false;
    $msg = "Service temporarily unavailable.";


    $data_login = array();

    $this->loadModel('Api.EasyApiToken');
    $this->loadModel('User');
    $tokenData = $this->EasyApiToken->findByToken($this->data['token']);



    if (!empty($tokenData)) {
      $success = true;
      $roles = array();
      $msg = "";

      $user = $this->User->findById($tokenData['EasyApiToken']['user_id']);

      if ($user['User']['role'] != '') {
        $roles[] = $user['User']['role'];
      }



      $data_login['token'] = $this->data['token'];
      $data_login['username'] = $user['User']['username'];
      $data_login['roles'] = $roles;
    }

    $this->data_response['data'] = $data_login;
    $this->data_response['message'] = $msg;
    $this->data_response['success'] = $success;

    //pr($this->data_response);


    $this->viewVars['json'] = $this->convert_response_data($this->data_response);

    //Set Data from Controller to view
    $this->set('viewVars', $this->viewVars);
    // For Render the view in webservice.
    $this->render('json');
  }

  public function uploadPhotos() {

  }

}
