<?php
require_once('SmartCache.php');

class CityCache extends SmartCache{
    public $markets = '';

    public function __construct($markets){

        if(!is_array($markets) && $markets != null){
            $markets = [$markets];
        } elseif(!is_array($markets)){
            $markets = [];
        }

        $this->markets = $markets;
        parent::__construct("cities-" . implode("-", $markets), 3600);
    }

    public function getDataFromSource(){
        $MktMlsDataSearch = ClassRegistry::init('MktMlsDataSearch');

        if(count($this->markets) == 0){
            $sql = "select distinct city from mkt_mls_data_search";
        } else{
            $sql = "select distinct city from mkt_mls_data_search where market in ('" . implode("', '", $this->markets) . "')";
        }

        $cities = $MktMlsDataSearch->query($sql);
        $list = [];
        foreach($cities as $city){
            if(strtolower($city['mkt_mls_data_search']['city']) == $city['mkt_mls_data_search']['city'])
                $list[] = ucwords($city['mkt_mls_data_search']['city']);
            else
                $list[] = $city['mkt_mls_data_search']['city'];
        }
        $list = array_filter($list);
        asort($list);
        return $list;
    }
}