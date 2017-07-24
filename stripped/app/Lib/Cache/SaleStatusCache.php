<?php

class SaleStatusCache extends SmartCache
{
    public function __construct()
    {
        parent::__construct("sale_statuses", 3600);
    }

    public function getDataFromSource()
    {
        $Salestatus = ClassRegistry::init('Salestatus');
        return $Salestatus->find('list');
    }
}