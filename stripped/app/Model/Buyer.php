<?php
App::uses('AppModel', 'Model');

class Buyer extends AppModel {
    public function getActiveBuyerIds(){
        return $this->find('list', ['fields' => ['id'], 'contain' => [], 'conditions' => ['active' => 1]]);
    }
}
