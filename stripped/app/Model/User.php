<?php

App::uses('AppModel', 'Model');

/**
 * User Model
 *
 * @property Contact $Contact
 * @property Document $Document
 * @property Property $Property
 */
class User extends AppModel {

  public $validate = array(
      'name' => array(
          'Please enter your name.' => array(
              'rule' => 'notEmpty',
              'message' => 'Please enter your name.'
          )
      ),
//            'username'=>array(
//                'User name must be at least 5 characters.'=>array(
//                    'rule'=>array('between',4,15),
//                    'message'=>'User Name must be at least 5 characters.'
//                ),
//                'User name already taken'=>array(
//                    'rule'=>'isUnique',
//                    'message'=>'User name already taken'
//                )
//            ),
//            'phone'=>array(
//                'not empty'=>array(
//                    'rule'=>'notBlank',
//                    'message'=>'A Phone number is required'
//                )
//            ),
      'email' => array(
          'Valid Email' => array(
              'rule' => array('email'),
              'message' => 'Please enter a valid email address'
          ),
          'Email already taken' => array(
              'rule' => 'isUnique',
              'message' => 'User email already in use'
          )
      ),
//            'password'=>array(
//                'not empty'=>array(
//                    'rule'=>'notBlank',
//                    'message'=>'Please enter your password'
//                )
//            )
  );

  public function beforeSave($options = null) {

    if (isset($this->data['User']['password'])) {
      $this->data['User']['password'] = AuthComponent::password($this->data['User']['password']);
    }
    return true;
  }

  //The Associations below have been created with all possible keys, those that are not needed can be removed

  /**
   * hasMany associations
   *
   * @var array
   */
  public $hasMany = array(
//      'PropertyNote' => array(
//          'className' => 'PropertyNote',
//          'foreignKey' => 'mls_data_id',
//          'dependent' => false
//      )
//		'Auction' => array(
//			'className' => 'Auction',
//			'foreignKey' => 'user_id',
//			'dependent' => false,
//			'conditions' => '',
//			'fields' => '',
//			'order' => '',
//			'limit' => '',
//			'offset' => '',
//			'exclusive' => '',
//			'finderQuery' => '',
//			'counterQuery' => ''
//		),
//		'Contact' => array(
//			'className' => 'Contact',
//			'foreignKey' => 'user_id',
//			'dependent' => false,
//			'conditions' => '',
//			'fields' => '',
//			'order' => '',
//			'limit' => '',
//			'offset' => '',
//			'exclusive' => '',
//			'finderQuery' => '',
//			'counterQuery' => ''
//		),
//		'Job' => array(
//			'className' => 'Job',
//			'foreignKey' => 'user_id',
//			'dependent' => false,
//			'conditions' => '',
//			'fields' => '',
//			'order' => '',
//			'limit' => '',
//			'offset' => '',
//			'exclusive' => '',
//			'finderQuery' => '',
//			'counterQuery' => ''
//		),
//		'Property' => array(
//			'className' => 'Property',
//			'foreignKey' => 'user_id',
//			'dependent' => false,
//			'conditions' => '',
//			'fields' => '',
//			'order' => array('status'=>'asc'),
//			'limit' => '',
//			'offset' => '',
//			'exclusive' => '',
//			'finderQuery' => '',
//			'counterQuery' => ''
//		),
//		'UserLog' => array(
//			'className' => 'UserLog',
//			'foreignKey' => 'user',
//			'dependent' => false,
//			'conditions' => '',
//			'fields' => '',
//			'order' => '',
//			'limit' => '',
//			'offset' => '',
//			'exclusive' => '',
//			'finderQuery' => '',
//			'counterQuery' => ''
//		)
  );
  public $belongsTo = array(
      'Company' => array(
          'className' => 'Company',
          'foreignKey' => 'company_id',
          'conditions' => '',
          'fields' => '',
          'order' => ''
      ),
  );

}
