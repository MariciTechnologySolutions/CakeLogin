<?php
/**
 * Created by JetBrains PhpStorm.
 * User: joey
 * Date: 12/28/13
 * Time: 11:47 PM
 * To change this template use File | Settings | File Templates.
 */
App::uses('SamiDocBlockNode', 'Api.Lib');
App::uses('SamiDocBlockNodeDeComplicator', 'Api.Lib');
App::uses('SamiDocBlockParser', 'Api.Lib');
class APIDefinitionGenerator {
    public static function extractDocsFromClass($className, $cakeLocation, $skipMethods = array()){
        $docs = array();
        App::uses($className, $cakeLocation);

        $reflectionClass = new ReflectionClass($className);

        foreach ($reflectionClass->getMethods() as $reflectionMethod){
            if(!in_array($reflectionMethod->getName(), $skipMethods) && $reflectionMethod->getDeclaringClass()->getName() == $className && $reflectionMethod->isPublic()){
                $comment = $reflectionMethod->getDocComment();
                $parser = new SamiDocBlockParser();
                $node = $parser->parse($comment);
                $docs[$reflectionMethod->getName()] = SamiDocBlockNodeDeComplicator::deComplicateNodeData($node, $reflectionMethod);

            }
        }

        return $docs;
    }
}