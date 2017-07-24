<?php

class BuyerCache extends SmartCache
{
    public function __construct()
    {
        parent::__construct("buyers", 3600);
    }

    public function getDataFromSource()
    {
        $Buyer = ClassRegistry::init('Buyer');
        return $Buyer->find('list',['conditions'=>['Buyer.favorite'=>1],'contain'=>[],'fields'=>['company']]);
    }
}