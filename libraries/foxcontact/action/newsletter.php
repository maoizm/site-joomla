<?php defined('_JEXEC') or die(file_get_contents('index.html'));
/**
 * @package   Fox Contact for Joomla
 * @copyright Copyright (c) 2010 - 2015 Demis Palma. All rights reserved.
 * @license   Distributed under the terms of the GNU General Public License GNU/GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 * @see       Documentation: http://www.fox.ra.it/forum/2-documentation.html
 */
jimport('foxcontact.action.base');
jimport('foxcontact.form.newsletter');

class FoxActionNewsletter extends FoxActionBase
{
	
	public function process($target)
	{
		$name = $this->form->getName();
		$email = $this->form->getEmail();
		$this->notifyPlugins($name, $email);
		$item = $this->form->getDesign()->getFoxDesignItemByType('newsletter');
		if (!is_null($item))
		{
			FoxFormNewsletter::subscribe($item->getNewsletterType(), $item->getSelectedIds(), $name, $email);
		}
		
		return true;
	}
	
	
	private function notifyPlugins($name, $email)
	{
		$contact = new stdClass();
		$data = array('contact_name' => $name, 'contact_email' => JMailHelper::cleanAddress($email), 'contact_subject' => '?', 'contact_message' => '?');
		JPluginHelper::importPlugin('contact');
		JEventDispatcher::getInstance()->trigger('onSubmitContact', array(&$contact, &$data));
	}

}