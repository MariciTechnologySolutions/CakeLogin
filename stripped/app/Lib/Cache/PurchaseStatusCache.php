<?php

class PurchaseStatusCache extends SmartCache
{
    public function __construct()
    {
        parent::__construct("purchase_statuses", 3600);
    }

    public function getDataFromSource()
    {
        $PurchaseStatus = ClassRegistry::init('PurchaseStatus');
        return $PurchaseStatus->find('list');
    }
}