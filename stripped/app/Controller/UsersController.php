<?php

App::uses('AppController', 'Controller');

class UsersController extends AppController {

  public function beforeFilter() {
    parent::beforeFilter();
    $this->Auth->allow();
  }

  public function index() {
    Configure::write('debug', 2);

    $users = $this->User->find(
            'all'
//                array(
//                    'conditions' => array(
//                        'User.company_id' => $this->Auth->user(
//                                'company_id'
//                        )
//                    )
//                )
    ); //with the same company_id only

    $this->set('users', $users);
  }

  public function login() {
    //$this->check_cookie_user();

    if ($this->Auth->loggedIn()) {
      $this->redirect($this->Auth->loginRedirect);
      return;
    }
    $this->layout = "login";


    if ($this->request->is('post')) {
      print_r($this->request->data);

      if ($this->Auth->login()) {
        $this->Auth->autoRedirect = false;

        print_r($this->Auth->user('id'));
        die;
        //save login activity status
        $this->makeOnline();

        // did they select the remember me checkbox?
        if ($this->request->data['User']['remember'] == 1) {
          // remove "remember me checkbox"
          unset($this->request->data['User']['remember']);

          // hash the user's password
          $this->request->data['User']['password'] = $this->Auth->password($this->request->data['User']['password']);

          // write the cookie
          $this->Cookie->write('remember_me_cookie', $this->request->data['User'], true, '2 weeks');
        }

        $this->Session->setFlash('Logged in as: "' . $this->Auth->user('username') . '"');
        if ($this->Session->read("Auth.redirect")) {
          $this->redirect($this->Auth->loginRedirect);
        } else {
          $this->redirect($this->Session->read("Auth.redirect"));
        }
      } else {
        //record failed login
        $data['ip_address'] = $_SERVER['REMOTE_ADDR'];
        $data['user_agent'] = md5($_SERVER['HTTP_USER_AGENT']);
        $data['attempted'] = time();
        //$this->FailedLogin->create();
        //$this->FailedLogin->save($data);
        $this->Session->setFlash(__('Username and Password ares not recognized'));
      }
    }//end if post
  }

  public function logout() {
    $this->Cookie->delete('remember_me_cookie');
    $this->redirect($this->Auth->logout());
  }

  public function view($id = null) {
    $this->User->id = $id;
    if (!$this->User->exists()) {
      throw new NotFoundException(__('Invalid user'));
    }
    $this->set('user', $this->User->findById($id));
  }

  public function add() {
    if ($this->request->is('post')) {
      $this->User->create();
      if ($this->User->save($this->request->data)) {
        $this->Flash->success(__('The user has been saved'));
        return $this->redirect(array('action' => 'index'));
      }
      $this->Flash->error(
              __('The user could not be saved. Please, try again.')
      );
    }
  }

  public function edit($id = null) {
    $this->User->id = $id;
    if (!$this->User->exists()) {
      throw new NotFoundException(__('Invalid user'));
    }
    if ($this->request->is('post') || $this->request->is('put')) {
      if ($this->User->save($this->request->data)) {
        $this->Flash->success(__('The user has been saved'));
        return $this->redirect(array('action' => 'index'));
      }
      $this->Flash->error(
              __('The user could not be saved. Please, try again.')
      );
    } else {
      $this->request->data = $this->User->findById($id);
      unset($this->request->data['User']['password']);
    }
  }

  public function delete($id = null) {
    // Prior to 2.5 use
    // $this->request->onlyAllow('post');

    $this->request->allowMethod('post');

    $this->User->id = $id;
    if (!$this->User->exists()) {
      throw new NotFoundException(__('Invalid user'));
    }
    if ($this->User->delete()) {
      $this->Flash->success(__('User deleted'));
      return $this->redirect(array('action' => 'index'));
    }
    $this->Flash->error(__('User was not deleted'));
    return $this->redirect(array('action' => 'index'));
  }

}

//!class
?>
