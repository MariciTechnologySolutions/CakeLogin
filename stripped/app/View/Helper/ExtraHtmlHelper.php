<?php

App::uses('HtmlHelper', 'View/Helper');
/**
 * Created by JetBrains PhpStorm.
 * User: Joey
 * Date: 9/12/12
 * Time: 5:32 PM
 * To change this template use File | Settings | File Templates.
 */
class ExtraHtmlHelper extends HtmlHelper{
    public function __construct( View $View, $settings = array( ) ) {
        parent::__construct( $View, $settings );
    }

    public function abbreviate($text, $length=20){
        if(strlen($text) > $length){
            return '<span class="abbreviated-text" title="' . htmlspecialchars($text) . '">' . htmlspecialchars(substr($text, 0, $length - 3)) . '...</span>';
        } else {
            return htmlspecialchars($text);
        }
    }

    public function humanReadableTimePeriod($date1, $date2){
        $readable = '';

        $seconds = strtotime($date1) - strtotime($date2);
        $absoluteSeconds = abs($seconds);

        if($absoluteSeconds <= 60){
            $readable = "just now";
        } elseif($absoluteSeconds <= 60 * 60){
            $readable = number_format($absoluteSeconds / 60, 0) . " mins";
        } elseif($absoluteSeconds <= 60 * 60 * 24){
            $readable = number_format($absoluteSeconds / (60 * 60), 0) . " hours";
        } else {
            $readable = number_format($absoluteSeconds / (60 * 60 * 24), 0) . " days";
        }


        if($seconds < 0){
            return $readable . ' ago';
        } else {
            return $readable;
        }
    }

    public function infusionsoftAppLink($title, $url, $options = array()){
        $options = array_merge(
            array('target' => '_blank'),
            $options
        );
        $this->Setting = ClassRegistry::init('Settings.Setting');
        $appName = $this->Setting->getValue('Infusionsoft_appname');
        $link = $this->link($title, 'https://' . $appName . $url, $options);
        return $link;
    }
}
