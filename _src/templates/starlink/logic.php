<?php defined( '_JEXEC' ) or die;

// variables
$app = JFactory::getApplication();
$doc = JFactory::getDocument();
$menu = $app->getMenu();
$active = $app->getMenu()->getActive();
$alias = $active->alias;
$params = $app->getParams();
$pageclass = $params->get('pageclass_sfx');
$tpath = $this->baseurl.'/templates/'.$this->template;
$itemId = JRequest::getInt('Itemid');
$uri= JFactory::getURI();
$queryString=$uri->getQuery();

// generator tag
$this->setGenerator(null);

// base path for all assets (css, js, images, fonts)
$assetsPathFile = JPATH_ROOT.$this->params->get('assetsBasePath', 'media/mod_starlink');
$assetsPath = $this->baseurl .$this->params->get('assetsBasePath', 'media/mod_starlink');



$doc->addStyleSheet($tpath . '/css/styles.css');


// Override template font using Google Font or local Roboto font by default
if ($this->params->get('googleFont')) {
  if (! ($this->params->get('googleFontNameHeadings') === "Roboto") ) {
    $doc->addStyleSheet('//fonts.googleapis.com/css?family=' . $this->params->get('googleFontNameHeadings'));
    $doc->addStyleDeclaration("
    h1, h2, h3, h4, h5, h6, .site-title {
      font-family: '" . str_replace('+', ' ', $this->params->get('googleFontNameHeadings')) . "', sans-serif;
    }");
  }
  if ( ! ($this->params->get('googleFontNameBody') === $this->params->get('googleFontNameHeadings')) &&
       ! ($this->params->get('googleFontNameBody') === "Roboto") ) {
    $doc->addStyleSheet('//fonts.googleapis.com/css?family=' . $this->params->get('googleFontNameBody'));
    $doc->addStyleDeclaration("
    html, body, p, ul, ol, li, .article__text {
      font-family: '" . str_replace('+', ' ', $this->params->get('googleFontNameBody')) . "', sans-serif;
    }");
  }
}

// template js
$this->_scripts = array();
unset($this->_script['text/javascript']);
$templateurl = $this->baseurl.'/templates/'.$this->template;
$doc->addScript($tpath . '/js/jui/jquery.min.js');
//$doc->addScript('https://code.jquery.com/jquery-migrate-3.0.0.js');
$doc->addScript($tpath . '/js/jui/jquery-ui.js');






$doc->addScript($tpath . '/js/scripts.js');

