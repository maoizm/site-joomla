<?php defined('_JEXEC') or die;
/**
 * @package   Fox Contact for Joomla
 * @copyright Copyright (c) Fox Labs, all rights reserved.
 * @license   Distributed under the terms of the GNU General Public License GNU/GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 * @see       Documentation: http://www.fox.ra.it/forum/2-documentation.html
 */

class Swift_StreamFilters_ByteArrayReplacementFilter implements Swift_StreamFilter
{
	private $_search;
	private $_replace;
	private $_index;
	private $_tree = array();
	private $_treeMaxLen = 0;
	private $_repSize;
	
	public function __construct($search, $replace)
	{
		$this->_search = $search;
		$this->_index = array();
		$this->_tree = array();
		$this->_replace = array();
		$this->_repSize = array();
		$tree = null;
		$i = null;
		$last_size = $size = 0;
		foreach ($search as $i => $search_element)
		{
			if ($tree !== null)
			{
				$tree[-1] = min(count($replace) - 1, $i - 1);
				$tree[-2] = $last_size;
			}
			
			$tree =& $this->_tree;
			if (is_array($search_element))
			{
				foreach ($search_element as $k => $char)
				{
					$this->_index[$char] = true;
					if (!isset($tree[$char]))
					{
						$tree[$char] = array();
					}
					
					$tree =& $tree[$char];
				}
				
				$last_size = $k + 1;
				$size = max($size, $last_size);
			}
			else
			{
				$last_size = 1;
				if (!isset($tree[$search_element]))
				{
					$tree[$search_element] = array();
				}
				
				$tree =& $tree[$search_element];
				$size = max($last_size, $size);
				$this->_index[$search_element] = true;
			}
		
		}
		
		if ($i !== null)
		{
			$tree[-1] = min(count($replace) - 1, $i);
			$tree[-2] = $last_size;
			$this->_treeMaxLen = $size;
		}
		
		foreach ($replace as $rep)
		{
			if (!is_array($rep))
			{
				$rep = array($rep);
			}
			
			$this->_replace[] = $rep;
		}
		
		for ($i = count($this->_replace) - 1; $i >= 0; --$i)
		{
			$this->_replace[$i] = $rep = $this->filter($this->_replace[$i], $i);
			$this->_repSize[$i] = count($rep);
		}
	
	}
	
	
	public function shouldBuffer($buffer)
	{
		$endOfBuffer = end($buffer);
		return isset($this->_index[$endOfBuffer]);
	}
	
	
	public function filter($buffer, $_minReplaces = -1)
	{
		if ($this->_treeMaxLen == 0)
		{
			return $buffer;
		}
		
		$newBuffer = array();
		$buf_size = count($buffer);
		for ($i = 0; $i < $buf_size; ++$i)
		{
			$search_pos = $this->_tree;
			$last_found = PHP_INT_MAX;
			for ($j = 0; $j <= $this->_treeMaxLen; ++$j)
			{
				if (isset($buffer[$p = $i + $j]) && isset($search_pos[$buffer[$p]]))
				{
					$search_pos = $search_pos[$buffer[$p]];
					if (isset($search_pos[-1]) && $search_pos[-1] < $last_found && $search_pos[-1] > $_minReplaces)
					{
						$last_found = $search_pos[-1];
						$last_size = $search_pos[-2];
					}
				
				}
				elseif ($last_found !== PHP_INT_MAX)
				{
					$rep_size = $this->_repSize[$last_found];
					for ($j = 0; $j < $rep_size; ++$j)
					{
						$newBuffer[] = $this->_replace[$last_found][$j];
					}
					
					$i += $last_size - 1;
					if ($i >= $buf_size)
					{
						$newBuffer[] = $buffer[$i];
					}
					
					continue 2;
				}
				else
				{
					break;
				}
			
			}
			
			$newBuffer[] = $buffer[$i];
		}
		
		return $newBuffer;
	}

}