<?php
/**
 * Created by JetBrains PhpStorm.
 * User: joey
 * Date: 12/30/13
 * Time: 6:42 PM
 * To change this template use File | Settings | File Templates.
 */

class SamiDocBlockNodeDeComplicator {
    public static function deComplicateNodeData(SamiDocBlockNode $node, $reflectionMethod){
        $simplifiedNodeData = $node->getOtherTags();

//        foreach($reflectionMethod->getParameters() as $parameter){
//            /**
//             * @var ReflectionParameter $parameter
//             */
//            $simplifiedNodeData['param'][$parameter->getName()]['default'] = $parameter->getDefaultValue();
//        }

        foreach($node->getTags() as $type => $tag){
            switch($type){
                case 'requestParam':
                case 'param':
                    foreach($tag as $param){
                        $simplifiedNodeData[$type][$param[1]]['type'] = $param[0][0][0];
                        $simplifiedNodeData[$type][$param[1]]['description'] = $param[2];
                    }
                    break;
                case 'return':
                    foreach($tag as $return){
                        $simplifiedNodeData['return']['type'] = $return[0][0][0];
                        $simplifiedNodeData['return']['description'] = $return[1];
                    }
                    break;
                case 'var':
                    break;
                case 'exception':
                    break;
            }
        }

        $simplifiedNodeData['shortDesc'] = $node->getShortDesc();
        $simplifiedNodeData['longDesc'] = $node->getLongDesc();
        
        return $simplifiedNodeData;
    }
}