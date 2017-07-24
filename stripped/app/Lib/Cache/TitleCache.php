<?php

class TitleCache extends SmartCache
{
    public function __construct()
    {
        parent::__construct("titles", 3600);
    }

    public function getDataFromSource()
    {
        $Title = ClassRegistry::init('Title');
        return $Title->find('list',['conditions'=>['Title.favorite'=>1],'contain'=>[],'fields'=>['id','name','company']]);
    }
}