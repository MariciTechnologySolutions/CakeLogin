<?php
/**
 * ProductFixture
 *
 */
class SettingFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
        'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'token' => 'primary'),
        'name' => array('type' => 'string', 'null' => false, 'default' => NULL, 'token' => 'unique', 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
        'value' => array('type' => 'text', 'null' => false, 'default' => NULL, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
        'created' => array('type' => 'datetime', 'null' => false, 'default' => NULL),
        'modified' => array('type' => 'datetime', 'null' => false, 'default' => NULL),
        'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1), 'name' => array('column' => 'name', 'unique' => 1)),
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
            'name' => "Infusionsoft_appname",
            'value' => "ii130.infusionsoft.com",
            'created' => '2000-10-10',
            'modified' => '2000-10-10',
		),

        array(
            'id' => 2,
            'name' => "Infusionsoft_apitoken",
            'value' => "1a5e631cdd8f28521aad2f3236cb2031",
            'created' => '2000-10-10',
            'modified' => '2000-10-10',
        ),

        array(
            'id' => 3,
            'name' => "Infusionsoft_port",
            'value' => "443",
            'created' => '2000-10-10',
            'modified' => '2000-10-10',
        ),
        array(
            'id' => '4',
            'name' => 'timezone',
            'value' => 'America/New_York',
            'created' => '0000-00-00 00:00:00',
            'modified' => '0000-00-00 00:00:00'
        ),
	);
}
