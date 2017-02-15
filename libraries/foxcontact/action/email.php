<?php defined('_JEXEC') or die(file_get_contents('index.html'));
/**
 * @package   Fox Contact for Joomla
 * @copyright Copyright (c) 2010 - 2015 Demis Palma. All rights reserved.
 * @license   Distributed under the terms of the GNU General Public License GNU/GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 * @see       Documentation: http://www.fox.ra.it/forum/2-documentation.html
 */
jimport('foxcontact.action.base');
jimport('foxcontact.html.encoder');
jimport('foxcontact.design.item_attachments');
jimport('foxcontact.joomla.log');
jimport('foxcontact.mail.mail');

abstract class FoxActionEmail extends FoxActionBase
{
	protected $type = 'Abstract notification email';
	
	public function process($target)
	{
		if ($this->isEnable())
		{
			$mail = FoxMailMail::getInstance();
			$this->prepare($mail);
			return $this->send($mail);
		}
		
		return true;
	}
	
	
	protected function isEnable()
	{
		return true;
	}
	
	
	protected abstract function prepare($mail);
	
	protected function addAttachments($mail)
	{
		$item = $this->form->getDesign()->getFoxDesignItemByType('attachments') or $item = new FoxDesignItemAttachments(array());
		$root = JPATH_SITE . '/components/com_foxcontact/uploads/';
		$sum = 0;
		foreach ($item->getValue() as $file)
		{
			$sum += filesize("{$root}{$file['filename']}");
		}
		
		if ($sum < constant($this->params->get('email_size_limit', 'MB2')))
		{
			foreach ($item->getValue() as $file)
			{
				$mail->addAttachment("{$root}{$file['filename']}", $file['realname']);
			}
		
		}
	
	}
	
	
	private function send($mail)
	{
		$result = $mail->send();
		if ($result !== true)
		{
			$info = (string) $result;
			FoxLog::add("{$this->type} Unable to send email. ({$info})", JLog::ERROR, 'action');
			$info = FoxHtmlEncoder::encode($info);
			$this->form->getBoard()->add(JText::_('COM_FOXCONTACT_ERR_SENDING_MAIL') . ". {$info}", FoxFormBoard::error);
			return false;
		}
		
		FoxLog::add("{$this->type} sent.", JLog::INFO, 'action');
		return true;
	}

}