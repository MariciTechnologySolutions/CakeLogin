<?php
/**
 * EasyApiTokenFixture
 *
 */
class EasyApiTokenFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'unsigned' => true, 'token' => 'primary'),
		'name' => array('type' => 'string', 'null' => false, 'default' => null, 'length' => 128, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'token' => array('type' => 'string', 'null' => false, 'default' => null, 'length' => 128, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'enabled' => array('type' => 'integer', 'null' => false, 'default' => '1', 'length' => 1, 'unsigned' => false),
		'read' => array('type' => 'integer', 'null' => false, 'default' => '1', 'length' => 1, 'unsigned' => false),
		'write' => array('type' => 'integer', 'null' => false, 'default' => '1', 'length' => 1, 'unsigned' => false),
		'query' => array('type' => 'integer', 'null' => false, 'default' => '1', 'length' => 1, 'unsigned' => false),
		'uses' => array('type' => 'integer', 'null' => true, 'default' => null, 'length' => 128, 'unsigned' => false),
		'last_use_ip' => array('type' => 'string', 'null' => true, 'default' => null, 'length' => 24, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'last_use_time' => array('type' => 'datetime', 'null' => true, 'default' => null),
		'record_data' => array('type' => 'integer', 'null' => false, 'default' => '0', 'length' => 1, 'unsigned' => false),
		'created' => array('type' => 'datetime', 'null' => true, 'default' => null),
		'modified' => array('type' => 'datetime', 'null' => true, 'default' => null),
		'indexes' => array(
			'PRIMARY' => array('column' => 'id', 'unique' => 1)
		),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);

/**
 * Records
 *
 * @var array
 */
	public $records = array(
		array(
			'id' => 1,
			'name' => 'test',
			'token' => 'test',
			'enabled' => 1,
			'read' => 1,
			'write' => 1,
			'query' => 1,
			'uses' => 1,
			'last_use_ip' => 'Lorem ipsum dolor sit ',
			'last_use_time' => '2016-06-06 20:26:03',
			'record_data' => 1,
			'created' => '2016-06-06 20:26:03',
			'modified' => '2016-06-06 20:26:03'
		),
	);

}
