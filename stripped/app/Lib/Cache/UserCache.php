<?php

class UserCache extends SmartCache
{
    public function __construct()
    {
        parent::__construct("users", 3600);
    }

    public function getDataFromSource()
    {
        $User = ClassRegistry::init('User');
        return $User->find('list',['conditions'=>['User.role'=>'Buyer'],'contain'=>[],'fields'=>['name']]);
    }
}