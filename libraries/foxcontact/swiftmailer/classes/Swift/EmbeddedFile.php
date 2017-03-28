<?php defined('_JEXEC') or die;
/**
 * @package   Fox Contact for Joomla
 * @copyright Copyright (c) Fox Labs, all rights reserved.
 * @license   Distributed under the terms of the GNU General Public License GNU/GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 * @see       Documentation: http://www.fox.ra.it/forum/2-documentation.html
 */

class Swift_EmbeddedFile extends Swift_Mime_EmbeddedFile
{
	
	public function __construct($data = null, $filename = null, $contentType = null)
	{
		call_user_func_array(array($this, 'Swift_Mime_EmbeddedFile::__construct'), Swift_DependencyContainer::getInstance()->createDependenciesFor('mime.embeddedfile'));
		$this->setBody($data);
		$this->setFilename($filename);
		if ($contentType)
		{
			$this->setContentType($contentType);
		}
	
	}
	
	
	public static function newInstance($data = null, $filename = null, $contentType = null)
	{
		return new self($data, $filename, $contentType);
	}
	
	
	public static function fromPath($path)
	{
		return self::newInstance()->setFile(new Swift_ByteStream_FileByteStream($path));
	}

}