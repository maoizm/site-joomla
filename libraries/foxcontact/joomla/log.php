<?php defined('_JEXEC') or die(file_get_contents('index.html'));
/**
 * @package   Fox Contact for Joomla
 * @copyright Copyright (c) 2010 - 2015 Demis Palma. All rights reserved.
 * @license   Distributed under the terms of the GNU General Public License GNU/GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 * @see       Documentation: http://www.fox.ra.it/forum/2-documentation.html
 */

class FoxLog extends JLog
{
	private static $category_by_file = array();
	
	public static function addLogger(array $options, $priority = self::ALL, $categories = array(), $exclude = false)
	{
		$key = $exclude ? "1:{$options['text_file']}" : "0:{$options['text_file']}";
		foreach ($categories as $category)
		{
			self::$category_by_file[$key][$category] = true;
		}
		
		JLog::addLogger($options, $priority, array_keys(self::$category_by_file[$key]), $exclude);
	}
	
	
	public static function add($entry, $priority = self::INFO, $category = '', $date = null)
	{
		try
		{
			JLog::add($entry, $priority, $category, $date);
		}
		catch (Throwable $t)
		{
		}
		catch (Exception $e)
		{
		}
	
	}

}