<?php

App::uses('CakeEmail', 'Network/Email');
App::uses('Folder', 'Utility');
App::uses('File', 'Utility');
App::uses('Xml', 'Utility');
App::uses('Controller', 'Controller');

class AppController extends Controller {

  //components
  public $components = array(
      'RequestHandler',
      'Cookie',
      'Session',
      'Auth' => array(
          'loginRedirect' => array(
              'controller' => '/api/ApiDocs',
              'action' => 'index'
          ),
          'logoutRedirect' => array(
              'controller' => 'users',
              'action' => 'login'
          ),
          'authError' => "Access Denied",
          'authorize' => array(
              'Controller'
          )
      ),
  );
  //define variable for datatable default params
  public $dtOption = array();
  //helpers
  public $helpers = array(
      'Html',
      'Form',
      'Session',
      'Time'
  );

  //check authorization on controller action basis
  public function isAuthorized($user) {
    return true;
  }

  //beforeFilter
  public function beforeFilter() {
    //parent call
    parent::beforeFilter();
    $this->Auth->allow('logit', 'ajaxGetCurrentRequest');
    $user = array();
    // if(!empty($this->Auth->user())) {
    if ($this->Session->check('Auth.User')) {
      //    $user = $this->Auth->user();
      $user = $this->Session->check('Auth.User');
      $this->set('user', $user);
      $this->makeOnline();
    }

    if (in_array($this->Auth->user('id'), [1, 16, 32]) || IN_DEVELOPMENT) {
      Configure::write('debug', 2);
    }
  }

  public function et() {
    $s = TIME_START;
    $e = microtime(true);
    $r = $e - $s;
    echo '<div style="padding: 10px; background-color: #efefef">';
    echo 'Elapsed Time: ' . $r;
    echo '</div>';
  }

  /**
   * limit data entry person to these urls
   */
  public function dataEntryUrls() {
    return array(
        '/lasvegas/index',
        '/lasvegas/remarks',
        '/users/logout',
        '/sms'
    );
  }

  /**
   * This is global function which return json object for passed array data
   * @param array $data
   * @return json It will return json object
   */
  protected function json(array $data) {
    // no view to render
    $this->autoRender = false;
    $this->response->type('json');

    $json = json_encode($data);
    $this->response->body($json);
  }

  /**
   * setDtOptions
   * This function set your datatable options in define array
   *
   * $modelType define that does model on which query going to run is default
   * OR custom loaded one
   *
   * @param type $model
   */
  protected function setDtOptions($model = null) {
    if ($model == null) {
      $model = $this->modelClass;
      $modelType = true;
    } else {
      $this->loadModel($model);
      $modelType = false;
    }
    //pr($this->request->query);die;
    /**
     * Setting to load data from db for datatable query url
     */
    //pr($this->request->query);
    $offset = $this->request->query['start']; //offset set by datatable
    $limit = $this->request->query['length']; //limit per page set by datatable dropdown
    $draw = $this->request->query['draw']; //draw request must be increaemented evey time
    $draw++;
    $search = $this->request->query['search']['value']; //search keyword send to search in db
    $order_column_no = $this->request->query['order'][0]['column']; //name of column which define in js
    $order_column_type = $this->request->query['order'][0]['dir']; //sort order desc-asc
    $order_column_name = $this->request->query['columns'][$order_column_no]['data']; //column name which need to sort
    //check server side name as assingned or not
    if (!empty($this->request->query['columns'][$order_column_no]['name'])) {//name is there
      $order_column_name = $this->request->query['columns'][$order_column_no]['name']; //column name which need to sort
    }

    /**
     * End setting fetch
     */
    /**
     * Define own custom vars which help for result
     */
    $modelName = $model;
    /**
     * End custom var defination
     */
    /**
     * SET default condition
     */
    $conditions = array(
        'offset' => $offset,
        'limit' => $limit,
        'order' => $order_column_name . ' ' . $order_column_type
    );
    /**
     * END
     */
    $this->dtOption = array(
        'model' => $modelName,
        'offset' => $offset,
        'limit' => $limit,
        'search' => $search,
        'sort' => $order_column_type,
        'scol' => $order_column_name,
        'condition' => $conditions,
        'result' => array(
            'draw' => $draw
        )
    );

    /**
     * Check for export thing
     */
    if (!empty($this->request->query['export']) && $this->request->query['export'] == "CSV") {
      //$this->dtOption['condition']['limit'] = 10;
      unset($this->dtOption['condition']['limit']);
    }
  }

  /**
   * dtResponse
   * This function will fetch data from model and return as json object
   */
  protected function dtResponse($fnCallback = null, $recursive = null, $behaviour = false) {
    $this->{$this->dtOption['model']}->recursive = $recursive ? $recursive : -1;
    if ($behaviour === true) {
      $this->{$this->dtOption['model']}->Behaviors->load('Containable');
    }
    //prd($this->dtOption['condition']);


    $this->dtOption['result']['data'] = $this->{$this->dtOption['model']}->find('all', $this->dtOption['condition']);

    if ($fnCallback == null) {
      //no function which return set data
      $this->dtOption['result']['data'] = Set::extract('/' . $this->dtOption['model'] . '/.', $this->dtOption['result']['data']);
    } else {
      //function which filter and return data
      $this->dtOption['result']['data'] = $this->{$fnCallback}();
    }
    $options = array();
    if (!empty($this->dtOption['condition']['conditions'])) {
      $options = array('conditions' => $this->dtOption['condition']['conditions']);
    }

    if (!empty($this->dtOption['condition']['limit'])) {
      unset($this->dtOption['condition']['limit']);
    }

    $this->dtOption['result']['recordsTotal'] = $this->{$this->dtOption['model']}->find('count', $this->dtOption['condition']);


    $this->dtOption['result']['recordsFiltered'] = $this->dtOption['result']['recordsTotal'];
    //prd($this->dtOption['result']);
    //$this->log($this->dtOption);
    $this->json($this->dtOption['result']);
  }

  /**
   * function which merge join table data in result and return one array
   */
  private function _joinMergeMaster() {
    return array_replace_recursive(Set::extract('/' . $this->dtOption['model'] . '/.', $this->dtOption['result']['data']), Set::extract('/Mast/.', $this->dtOption['result']['data']));
  }

  protected function extract_model_name($model_name, $data) {
    return Set::extract('/' . $model_name . '/.', $data);
  }

  protected function makedualList($model_name, $data, $column_name) {
    $list = array();
    foreach ($data as $key => $value) {
      $kv = $value[$model_name][$column_name];
      $list[] = $kv;
    }
    return $list;
  }

  /**
   * load_master method
   * Load data of master
   *
   * @param string $system_id
   */
  public function load_master($system_id, $one = null, $fields = null) {
    $oF = array('Master.id', 'Master.name');
    $fields = $fields ? $fields : $oF;
//        if( !ClassRegistry::isKeySet('Master') ) {
    $this->loadModel('Master');
    //      }
    $this->Master->recursive = -1;

    $parent_id = $this->Master->find(
            'first', array(
        'fields' => array('Master.id'),
        'conditions' => array(
            'Master.system_id' => $system_id
        )
            )
    );
    $parent_id = $parent_id['Master']['id'];

    if ($one == null) {
      $data = $this->Master->find('list', array('fields' => $fields, 'conditions' => array('Master.parent_id' => $parent_id)));
    } else if ($one != null) {
      $data = $this->Master->find('first', array('conditions' => array('Master.parent_id' => $parent_id, 'Master.id' => $one)));
    }

    return (array) $data;
  }

  /**
   * prLog
   * This function print you last query log
   */
  protected function prlog() {
    //$log = $this->->getDataSource()->getLog(false, false);
    //debug($log);
    $db = & ConnectionManager::getDataSource('default');
    $db->showLog();
    die;
  }

  public function getLastQuery() {
    $dbo = & ConnectionManager::getDataSource('default');
    $logs = $dbo->getLog();
    $lastLog = end($logs['log']);
    prd($lastLog['query']);
  }

  public function addMyLog($data) {
    $this->loadModel('EmailManager.SystemLog');
    if ($this->SystemLog->save($data)) {
      return TRUE;
    } else {
      return FALSE;
    }
  }

  /**
   * beforeFilter
   * This function set some value which are required by default for view
   */
  public function beforeRender() {
    $common_css = array(
        'font-awesome',
        'simple-line-icons',
        'jquery-ui',
        'bs_datepick',
        'bootstrap',
        'app-blue',
        'extend',
        'dataTables.bootstrap',
        'dataTables.responsive',
        'jquery.growl'
    );

    $common_js = array(
        'jquery-2.1.1.min',
        'jquery-ui.min',
        'jquery-ui-touch-punch',
        'jquery.placeholder',
        'bootstrap',
        'jquery.touchSwipe.min',
        'jquery.slimscroll.min',
        'super',
        //'jquery.tagsinput.min',
        'bs_datepick',
        'jquery-cookie',
        'modals',
        'jquery.growl',
            //'geocode',
    );

    $datatable_script = array(
        'jquery.dataTables.min.js',
        'dataTables.bootstrap.js',
    );

    $map_script = array(
        'http://maps.googleapis.com/maps/api/js?key=AIzaSyDcrQoeB1c3kIzuUuIsOkxreGGkgxN7mz0&v=3.28&amp;libraries=geometry&amp;libraries=places&amp;libraries=drawing',
        'infobox'
    );

    $this->set('asset', array(
        'css' => $common_css,
        'js' => $common_js,
        'datatable_script' => $datatable_script,
        'map_script' => $map_script,
        'map' => 'http://maps.googleapis.com/maps/api/js?key=AIzaSyDcrQoeB1c3kIzuUuIsOkxreGGkgxN7mz0&v=3.exp&amp;libraries=geometry&amp;libraries=places&amp;libraries=drawing',
        'infobox' => 'infobox',
        'selectpicker' => 'bootstrap-select.min',
        'typeahead' => 'bootstrap-typeahead.min',
        'btypeahead' => 'typeahead',
        'attrchange' => 'attrchange',
        'dt_cdn' => 'https://cdn.datatables.net/1.10.9/js/jquery.dataTables.min.js',
        'redips-drag-min' => 'redips-drag-min',
        'redips-extend' => 'redips-extend',
        'docManager' => 'docManager',
        'dropzone' => 'dropzone',
        'sortable' => 'sortable',
        'jquery.mjs.nestedSortable' => 'jquery.mjs.nestedSortable',
        'app' => 'app',
        'website' => 'website',
        'geocomplete' => 'geocomplete',
    ));
  }

  protected function makeOnline() {
    $this->loadModel("User");
    $userID = $this->Auth->user("id");
    $this->User->save(array("User" => array("id" => $userID, "last_active" => date("Y-m-d H:i:s"), "online" => 1)));
  }

  public function getTransactionFolder($transaction_id, $create = false) {

    if (!isset($transaction_id))
      throw new Exception('Transaction id is missing from request for folder name');

    $this->autoRender = false;
    $dir = new Folder(WWW_ROOT . 'Transactions');
    $basePath = $dir->path;

    $this->loadModel('Property');
    $options = [
        'conditions' => [
            'Property.id' => $transaction_id
        ],
        'contain' => ['MlsData'],
        'fields' => [
            'Property.id',
            'MlsData.address',
            'MlsData.unit',
            'MlsData.city',
            'MlsData.state',
            'MlsData.zipcode'
        ]
    ];
    $property = $this->Property->find('first', $options);
    if (empty($property))
      throw new Exception('Sorry. There is no transaction with that ID.');

    $namePart['address'] = !empty($property['MlsData']['address']) ? ucwords(strtolower(trim($property['MlsData']['address']))) : '';
    $namePart['unit'] = !empty($property['MlsData']['unit']) ? ucwords(strtolower(trim($property['MlsData']['unit']))) : '';
    $namePart['city'] = !empty($property['MlsData']['city']) ? ucwords(strtolower(trim($property['MlsData']['city']))) : '';
    $namePart['state'] = !empty($property['MlsData']['state']) ? ucwords(trim($property['MlsData']['state'])) : '';
    $namePart['zip'] = preg_replace('[^0-9]', '', trim($property['MlsData']['zipcode']));

    $out = [];
    foreach ($namePart as $k) {
      if (!empty($k)) {
        $out[] = $k;
      }
    }
    $out = implode(' ', $out);
    $out = str_replace(' ', '_', $out);
    if (empty($out))
      throw new Exception('Sorry. Unable to process that transaction id. Could not resolve an address. See Steve');
    $folderName = $out . '____' . $transaction_id;
    $fullPath = $basePath . DS . $folderName;
    list($folders, $files) = $dir->read();
    $folder = preg_grep("/^.*____" . $transaction_id . "$/", $folders);

    $exists = false;

    if (!empty($folder)) {
      if (count($folder) > 1)
        throw new Exception('Folder mgmt required. There is more than one folder with this transaction id: ' . $transaction_id);
      $existingFolder = end($folder);

      return [
          'folder' => $existingFolder,
          'exists' => true
      ];
    }
    if ($create == true) {
      mkdir($fullPath, 0777);
      mkdir($fullPath . DS . 'photos', 0777);
      return [
          'folder' => $folderName,
          'exists' => true
      ];
    }
    return [
        'folder' => $folderName,
        'exists' => false
    ];
  }

  /**
   * getPropertyFolderName
   * Function to return name of files folder
   *
   * @param type $mls_id
   * @return string
   */
  protected function getPropertyFolderName($mls_id, $create = false) {
    $dir = new Folder(WWW_ROOT . 'files');

    if ($create == true) {
      $this->loadModel("MlsData");
      $this->MlsData->recursive = -1;
      $address = $this->MlsData->find(
              "first", array(
          "fields" => array(
              "MlsData.address"
          ),
          "conditions" => array(
              "MlsData.id" => $mls_id
          )
              )
      );

      if (!empty($address)) {
        $address = explode(" ", $address['MlsData']['address']);
        $address = implode("_", $address);
        return $address . "____" . $mls_id;
      }
    } else {
      list($folders, $files) = $dir->read();
      $folder = preg_grep("/^.*____" . $mls_id . "$/", $folders);
      if (!empty($folder)) {
        return end($folder);
      }
    }

    return "";
  }

  public function logit($mls_data_id = null, $action = null, $detail = null) {
    $mls_data_id = 60;
    $this->loadModel('MlsData');
    $sql = "select mlssource_table from mls_data where id = $mls_data_id limit 1";
    $sourceRaw = $this->MlsData->query($sql);
    $source = $sourceRaw[0]['mls_data']['mlssource_table'];
    $this->loadModel('Logit');
    $data['user_id'] = AuthComponent::user('id');
    $data['created'] = date('Y-m-d G:i:s');
    $data['market'] = $source;

    if (is_null($action) || is_null($detail)) {
      $data['mls_data_id'] = @$this->request->data['mls_data_id'];
      $data['action'] = $this->request->data['action'];
      $data['detail'] = $this->request->data['detail'];
    } else {
      $data['mls_data_id'] = $mls_data_id;
      $data['action'] = $action;
      $data['detail'] = $detail;
    }


    $this->Logit->create();
    $this->Logit->save($data);

    $this->autoRender = false;
    //pr($data);
  }

  public function apiAddressSearch() {



    $this->autoRender = false;

    if ($this->request->is('post')) {

      $search = $this->request->data['search'];

      $sql = "select id, concat(street_number,' ',street_compass,' ',street_name,' ',street_suffix,', ',city,' ',zipcode) as address
                    from .mls_data
                    having address like '%$search%'
                    limit 20";
      $this->loadModel('MlsData');
      $results = $this->MlsData->query($sql);
      echo '<div class="list-group">';
      foreach ($results as $result) {
        echo '<div class="list-group-item"><a href="/properties/view/' . $result['mls_data']['id'] . '"> ' . $result[0]['address'] . '</a></div>';
      }
      echo '</div>';
    }
    exit;
  }

}

/* * ************************************************************************** */

function prd($data) {
  pr($data);
  die();
}

function formatPhone($number) {
  $number = preg_replace("/[^0-9]/", "", $number);
  if (strlen($number) == 10) {
    $area = substr($number, 0, 3);
    $part1 = substr($number, 3, 3);
    $part2 = substr($number, 6);
    return "$area-$part1-$part2";
  } else {
    return false;
  }
}

function encode($data) {
  return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function decode($data) {
  return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

function hDate($date) {

  if (empty($date))
    return '';

  if (!is_numeric($date)) {
    $date = strtotime($date);
  }
  $date = date('Y/m/d', $date);
  return $date;
}

function money($int) {
  $int = preg_replace('/[^0-9.]/', '', $int);
  if (empty($int) || $int == 0)
    return '$0';
  return '$' . number_format($int);
}

function parseQueryStringAndDropInvalidCharacters($str) {
  # result array
  $arr = array();

  # split on outer delimiter
  $pairs = explode('&', $str);

  # loop through each pair
  foreach ($pairs as $i) {
    # split into name and value
    list($name, $value) = explode('=', $i, 2);
    $value = iconv("UTF-8", "ISO-8859-1//IGNORE", $value);
    $value = urldecode($value);
    # if name already exists
    if (isset($arr[$name])) {
      # stick multiple values into an array
      if (is_array($arr[$name])) {
        $arr[$name][] = $value;
      } else {
        $arr[$name] = array($arr[$name], $value);
      }
    }
    # otherwise, simply stick it in a scalar
    else {
      $arr[$name] = $value;
    }
  }

  # return result array
  return $arr;
}
