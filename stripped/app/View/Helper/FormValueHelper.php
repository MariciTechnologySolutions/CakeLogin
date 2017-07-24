<?php
App::uses('Helper', 'View');
/**
 * Created by PhpStorm.
 * User: joey
 * Date: 2/10/2017
 * Time: 7:55 AM
 */
class FormValueHelper extends Helper
{
    public function inputValue($array, $key){
        if(isset($array[$key])){
            return ' value="' . htmlspecialchars($array[$key]) . '" ';
        } else {
            return "";
        }
    }

    public function textareaValue($array, $key){
        if(isset($array[$key])){
            return htmlspecialchars($array[$key]);
        } else {
            return "";
        }
    }

    public function checkboxChecked($array, $key, $value){
        if(isset($array[$key])){
            if(is_array($array[$key])){
                if(in_array($value, $array[$key])){
                    return ' checked="checked" ';
                }
                return "";
            } else {
                if($array[$key] == $value){
                    return ' checked="checked" ';
                }
                return "";
            }
        } else {
            return "";
        }
    }

    public function selectOptionSelected($array, $key, $value){
        if(isset($array[$key])){
            if(is_array($array[$key])){
                if(in_array($value, $array[$key])){
                    return ' selected ';
                }
                return "";
            } else {
                if($array[$key] == $value){
                    return ' selected ';
                }
                return "";
            }
        } else {
            return "";
        }
    }

}