<?php
/**
 * @package         Sourcerer
 * @version         7.1.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2017 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Sourcerer;

defined('_JEXEC') or die;

use JFactory;

class Code
{
	public static function run($src_string = '', &$src_vars, $src_backup_vars)
	{
		if (!is_string($src_string) || $src_string == '')
		{
			return '';
		}

		ob_start();
		$src_new_vars = self::execute($src_string, $src_vars);
		$src_output   = ob_get_contents();
		ob_end_clean();

		if (!is_array($src_new_vars))
		{
			return $src_output;
		}

		$src_diff_vars = array_diff(array_keys($src_new_vars), $src_backup_vars);

		foreach ($src_diff_vars as $src_diff_key)
		{
			if (!in_array($src_diff_key, ['src_vars', 'article', 'Itemid', 'mainframe', 'app', 'document', 'doc', 'database', 'db', 'user'])
				&& substr($src_diff_key, 0, 4) != 'src_'
			)
			{
				$src_vars[$src_diff_key] = $src_new_vars[$src_diff_key];
			}
		}

		return $src_output;
	}

	private static function execute($string = '', $src_vars)
	{
		list($function_name, $contents) = self::generateFileContents($string);

		$folder    = JFactory::getConfig()->get('tmp_path', JPATH_ROOT . '/tmp');
		$temp_file = tempnam($folder, 'src_');

		$handle = fopen($temp_file, "w");
		fwrite($handle, $contents);
		fclose($handle);

		include $temp_file;

		unlink($temp_file);

		return $function_name($src_vars);
	}

	private static function generateFileContents($string = '')
	{
		$function_name = uniqid('src_');

		$init_vars = [];

		if (strpos($string, '$Itemid') !== false)
		{
			$init_vars[] = '$Itemid = JFactory::getApplication()->input->getInt(\'Itemid\');';
		}

		if (strpos($string, '$app') !== false)
		{
			$init_vars[] = '$app = JFactory::getApplication();';
		}

		if (strpos($string, '$mainframe') !== false)
		{
			$init_vars[] = '$mainframe = JFactory::getApplication();';
		}

		if (strpos($string, '$document') !== false)
		{
			$init_vars[] = '$document = JFactory::getDocument();';
		}

		if (strpos($string, '$doc') !== false)
		{
			$init_vars[] = '$doc = JFactory::getDocument();';
		}

		if (strpos($string, '$user') !== false)
		{
			$init_vars[] = '$user = JFactory::getUser();';
		}

		$init_vars[] =
			'if (is_array($src_vars)) {'
			. 'foreach ($src_vars as $src_key => $src_value) {'
			. '${$src_key} = $src_value;'
			. '}'
			. '}';

		$contents = [
			'<?php',
			'defined(\'_JEXEC\') or die;',
			'function ' . $function_name . '($src_vars){',
			implode("\n", $init_vars),
			$string,
			'return get_defined_vars();',
			';}',
		];

		return array(
			$function_name,
			implode("\n", $contents),
		);
	}
}
