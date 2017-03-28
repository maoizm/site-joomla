<?php defined('_JEXEC') or die;
/**
 * @package   Fox Contact for Joomla
 * @copyright Copyright (c) Fox Labs, all rights reserved.
 * @license   Distributed under the terms of the GNU General Public License GNU/GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 * @see       Documentation: http://www.fox.ra.it/forum/2-documentation.html
 */

abstract class Swift_ByteStream_AbstractFilterableInputStream implements Swift_InputByteStream, Swift_Filterable
{
	protected $_sequence = 0;
	private $_filters = array();
	private $_writeBuffer = '';
	private $_mirrors = array();
	
	protected abstract function _commit($bytes);
	
	protected abstract function _flush();
	
	public function addFilter(Swift_StreamFilter $filter, $key)
	{
		$this->_filters[$key] = $filter;
	}
	
	
	public function removeFilter($key)
	{
		unset($this->_filters[$key]);
	}
	
	
	public function write($bytes)
	{
		$this->_writeBuffer .= $bytes;
		foreach ($this->_filters as $filter)
		{
			if ($filter->shouldBuffer($this->_writeBuffer))
			{
				return;
			}
		
		}
		
		$this->_doWrite($this->_writeBuffer);
		return ++$this->_sequence;
	}
	
	
	public function commit()
	{
		$this->_doWrite($this->_writeBuffer);
	}
	
	
	public function bind(Swift_InputByteStream $is)
	{
		$this->_mirrors[] = $is;
	}
	
	
	public function unbind(Swift_InputByteStream $is)
	{
		foreach ($this->_mirrors as $k => $stream)
		{
			if ($is === $stream)
			{
				if ($this->_writeBuffer !== '')
				{
					$stream->write($this->_writeBuffer);
				}
				
				unset($this->_mirrors[$k]);
			}
		
		}
	
	}
	
	
	public function flushBuffers()
	{
		if ($this->_writeBuffer !== '')
		{
			$this->_doWrite($this->_writeBuffer);
		}
		
		$this->_flush();
		foreach ($this->_mirrors as $stream)
		{
			$stream->flushBuffers();
		}
	
	}
	
	
	private function _filter($bytes)
	{
		foreach ($this->_filters as $filter)
		{
			$bytes = $filter->filter($bytes);
		}
		
		return $bytes;
	}
	
	
	private function _doWrite($bytes)
	{
		$this->_commit($this->_filter($bytes));
		foreach ($this->_mirrors as $stream)
		{
			$stream->write($bytes);
		}
		
		$this->_writeBuffer = '';
	}

}