<?php
/**
 * Routes configuration
 *
 * In this file, you set up routes to your controllers and their actions.
 * Routes are very important mechanism that allows you to freely connect
 * different urls to chosen controllers and their actions (functions).
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Config
 * @since         CakePHP(tm) v 0.2.9
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
/**
 * Here, we are connecting '/' (base path) to controller called 'Pages',
 * its action called 'display', and we pass a param to select the view file
 * to use (in this case, /app/View/Pages/home.ctp)...
 */
	Router::redirect('/', '/users/login');
	Router::connect('/dashboard', array('plugin'=>'','controller' => 'properties', 'action' => 'dashboard'));
	Router::connect('/dashboard/auto', array('plugin'=>'','controller' => 'properties', 'action' => 'dashboard'));
	Router::connect('/marketing/preview/*', array('plugin'=>'','controller' => 'marketing', 'action' => 'preview'));
	Router::connect('/marketing/eblast_all', array('plugin'=>'','controller' => 'marketing', 'action' => 'eblast_all'));
	Router::connect('/marketing/eblast', array('plugin'=>'','controller' => 'marketing', 'action' => 'eblast'));
	Router::connect('/marketing/ajax_eblast_job_create', array('plugin'=>'','controller' => 'marketing', 'action' => 'ajax_eblast_job_create'));
	Router::connect('/marketing/send_email', array('plugin'=>'','controller' => 'marketing', 'action' => 'send_email'));
	Router::connect('/marketing/cron_run_email_job', array('plugin'=>'','controller' => 'marketing', 'action' => 'cron_run_email_job'));
	Router::connect('/mls/addListingIdToQueue', array('plugin'=>'','controller' => 'mls', 'action' => 'addListingIdToQueue'));
	Router::connect('/colony', array('plugin'=>'','controller' => 'tests', 'action' => 'index'));
        //used to post new property from asis.cash
	Router::connect('/post_property', array('plugin'=>'','controller' => 'properties', 'action' => 'apiPublicAsisCashNewProperty'));
        
        
       
        
	//Router::connect('/api', array('controller' => 'api', 'action' => 'index'));
/**
 * ...and connect the rest of 'Pages' controller's urls.
 */
	Router::connect('/pages/*', array('controller' => 'pages', 'action' => 'display'));
        
        //Router::mapResources('api');
        //Router::parseExtensions('json');
        //Router::resourceMap(array(
        //    array('action'=>'index','method'=>'GET','id'=>false)
        //));

/**
 * Load all plugin routes. See the CakePlugin documentation on
 * how to customize the loading of plugin routes.
 */
	CakePlugin::routes();
        
       

/**
 * Load the CakePHP default routes. Only remove this if you do not want to use
 * the built-in default routes.
 */
	require CAKE . 'Config' . DS . 'routes.php';
