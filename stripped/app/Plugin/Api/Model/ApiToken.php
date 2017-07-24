<?php

App::uses('EasyAPIAppModel', 'Api.Model');

class EasyApiToken extends EasyAPIAppModel {

  public $name = 'EasyApiToken';
  public $useTable = 'easy_api_tokens';
  public $belongsTo = array(
      'User' => array(
          'className' => 'User',
          'foreignKey' => 'user_id',
          'conditions' => '',
          'fields' => '',
          'order' => ''
      ),
  );

}
