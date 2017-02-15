<?php defined('_JEXEC') or die(file_get_contents('index.html'));
/**
 * @package   Fox Contact for Joomla
 * @copyright Copyright (c) 2010 - 2015 Demis Palma. All rights reserved.
 * @license   Distributed under the terms of the GNU General Public License GNU/GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 * @see       Documentation: http://www.fox.ra.it/forum/2-documentation.html
 */
jimport('foxcontact.constants');
jimport('foxcontact.html.resource');
jimport('foxcontact.html.encoder');
jimport('foxcontact.html.elem');

class FoxDesignItemAttachments extends FoxDesignItem
{
	private static $symbols = null;
	
	public function __construct($value, $owner = null, $deep = 0, $root = null)
	{
		parent::__construct($value, $owner, $deep, $root);
	}
	
	
	protected function hasSingleValue()
	{
		return false;
	}
	
	
	public function update(array $post_data)
	{
	}
	
	
	protected function check($value, array &$messages)
	{
		if (count($value) < $this->get('file.min', 0))
		{
			$messages[] = $this->getMessage(JText::sprintf('COM_FOXCONTACT_ERR_MIN_UPLOAD_FILES_NOT_REACHED', $this->get('file.min', 0)));
		}
		
		if (count($value) > $this->get('file.max', 10))
		{
			$messages[] = $this->getMessage(JText::sprintf('COM_FOXCONTACT_ERR_INVALID_VALUE', $this->get('label')));
		}
	
	}
	
	
	public function onBeforeRender()
	{
		$this->set('required', $this->get('file.min', 0) > 0);
	}
	
	
	public function addResources(JDocument $document)
	{
		$document->addScript(FoxHtmlResource::path('/media/com_foxcontact/js/upload', 'js'));
	}
	
	
	public function getHelp()
	{
		return JText::sprintf('COM_FOXCONTACT_FILE_SIZE_LIMIT', $this->getHumanReadable($this->getMaxFileSize()));
	}
	
	
	public function getMaxFileSize()
	{
		return (int) constant($this->get('file.size'));
	}
	
	
	public function getHumanReadable($bytes, $decimals = 'auto')
	{
		for ($i = 0; $bytes >= 1000; ++$i)
		{
			$bytes /= 1024;
		}
		
		if ($decimals === 'auto')
		{
			$decimals = 3 - strlen((string) floor($bytes));
		}
		
		$symbols = self::getSymbols();
		return sprintf('%.' . $decimals . 'f ' . $symbols[$i], $bytes);
	}
	
	
	private static function getSymbols()
	{
		if (is_null(self::$symbols))
		{
			self::$symbols = array(JText::_('COM_FOXCONTACT_B'), JText::_('COM_FOXCONTACT_KB'), JText::_('COM_FOXCONTACT_MB'), JText::_('COM_FOXCONTACT_GB'), JText::_('COM_FOXCONTACT_TB'), JText::_('COM_FOXCONTACT_PB'), JText::_('COM_FOXCONTACT_EB'), JText::_('COM_FOXCONTACT_ZB'), JText::_('COM_FOXCONTACT_YB'));
		}
		
		return self::$symbols;
	}
	
	
	public function getFilesForRender()
	{
		$files = $this->getValue();
		foreach ($files as $i => $file)
		{
			if (strlen($file['realname']) > 33)
			{
				$sub_str_fun = function_exists('mb_substr') ? 'mb_substr' : 'substr';
				$files[$i]['realname'] = "{$sub_str_fun($file['realname'], 0, 19)}...{$sub_str_fun($file['realname'], -13)}";
			}
		
		}
		
		return $files;
	}
	
	
	public function getValueAsText()
	{
		return $this->getValueForUser();
	}
	
	
	public function getValueForUser()
	{
		$text = '';
		foreach ($this->getValue() as $file)
		{
			if (!empty($text))
			{
				$text .= ', ';
			}
			
			$text .= $file['realname'];
		}
		
		return $text;
	}
	
	
	public function getValueForAdmin()
	{
		$elements = FoxHtmlElem::create();
		$base = JUri::base();
		foreach ($this->getValue() as $file)
		{
			if (!$elements->isEmpty())
			{
				$elements->append(', ');
			}
			
			$elements->append(FoxHtmlElem::create('a')->attr('href', "{$base}components/com_foxcontact/uploads/{$file['filename']}")->classes('field-table-href')->text($file['realname']));
		}
		
		return $elements->render();
	}
	
	
	public function isValueForAdminHtml()
	{
		return true;
	}

}