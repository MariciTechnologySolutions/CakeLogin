<?php

App::uses('HtmlHelper', 'View/Helper');
/**
 * Created by JetBrains PhpStorm.
 * User: Joey
 * Date: 9/12/12
 * Time: 5:32 PM
 * To change this template use File | Settings | File Templates.
 */
class CountyHelper extends HtmlHelper{
    public function __construct( View $View, $settings = array( ) ) {
        parent::__construct( $View, $settings );
    }
    
    public function getCountyList($market){
        if(is_null($market))return [];
        
        $counties = [
            'ARMLS'=>[
                'Maricopa'=>'Maricopa',
                'Pinal'=>'Pinal'
                ],
            'MRFMLS'=>[],
            'NTREIS'=>[],
            'GLVAR'=>[
                'Clark'=>'Clark'
                ],
        ];
        return $counties[$market];
        
        exit;
    }

    
}
