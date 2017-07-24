<?php
/**
 * Created by JetBrains PhpStorm.
 * User: joey
 * Date: 12/30/13
 * Time: 6:26 PM
 * To change this template use File | Settings | File Templates.
 */
App::uses('SamiDocBlockParser', 'Api.Lib');
App::uses('SamiDocBlockNodeDeComplicator', 'Api.Lib');

class SamiDocBlockParserTest extends CakeTestCase {
    public function testParser(){
        $reflectionMethod = new ReflectionMethod('testDocBlock', 'test');
        $comment = $reflectionMethod->getDocComment();

        $docBlockParser = new SamiDocBlockParser();
        $parsedComment = $docBlockParser->parse($comment);
        $simpleComment = SamiDocBlockNodeDeComplicator::deComplicateNodeData($parsedComment, $reflectionMethod);
        $this->assertEqual(array(
            'data' => array(
                '{result: boolean, data: {}}',
                "Something Else, Multi Line\n Short Desc\n\n Long desc...\n more\n more",
            ),
            'param' => array(
                'b' => array(
                    'default' => 'something',
                    'type' => 'string',
                    'description' => "This parameter is a test for online comments...\n lots more about it!!!"
                ),
                'c' => array(
                    'default' => 'something else',
                    'type' => 'boolean',
                    'description' => ''
                ),
                'a' => array(
                    'default' => 'random string',
                    'type' => 'boolean',
                    'description' => ''
                ),
             ),
            'return' => array (
                'type' => 'array',
                'description' => "some stuff\n Miscalaneous stuff goes here...\n\n More Here..."
            )
        ), $simpleComment);
    }
}

class testDocBlock{
    /**
     * @param string $b This parameter is a test for online comments...
     * lots more about it!!!
     * @param boolean $a
     * @param boolean $c
     * @return array some stuff
     * Miscalaneous stuff goes here...
     *
     * More Here...
     *
     * @data {result: boolean, data: {}}
     * @data Something Else, Multi Line
     * Short Desc
     *
     * Long desc...
     * more
     * more
     */
    public function test($b = 'something', $c = 'something else', $a = 'random string'){
        return array();
    }
}