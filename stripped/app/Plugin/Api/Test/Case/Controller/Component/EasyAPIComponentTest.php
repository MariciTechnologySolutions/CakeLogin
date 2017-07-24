<?php
App::uses('ComponentCollection', 'Controller');
App::uses('Component', 'Controller');
App::uses('ApiComponent', 'Api.Controller/Component');

/**
 * ApiComponent Test Case
 *
 */
class ApiComponentTest extends CakeTestCase {

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$Collection = new ComponentCollection();
		$this->Api = new ApiComponent($Collection);
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Api);

		parent::tearDown();
	}

/**
 * testAddOrUpdateContact method
 *
 * @return void
 */
	public function testAddOrUpdateContact() {
	}

/**
 * testTriggerCampaignGoal method
 *
 * @return void
 */
	public function testTriggerCampaignGoal() {
	}

/**
 * testApplyTag method
 *
 * @return void
 */
	public function testApplyTag() {
	}
}
