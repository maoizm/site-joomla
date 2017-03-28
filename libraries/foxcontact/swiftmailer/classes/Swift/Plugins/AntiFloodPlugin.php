<?php defined('_JEXEC') or die;
/**
 * @package   Fox Contact for Joomla
 * @copyright Copyright (c) Fox Labs, all rights reserved.
 * @license   Distributed under the terms of the GNU General Public License GNU/GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 * @see       Documentation: http://www.fox.ra.it/forum/2-documentation.html
 */

class Swift_Plugins_AntiFloodPlugin implements Swift_Events_SendListener, Swift_Plugins_Sleeper
{
	private $_threshold;
	private $_sleep;
	private $_counter = 0;
	private $_sleeper;
	
	public function __construct($threshold = 99, $sleep = 0, Swift_Plugins_Sleeper $sleeper = null)
	{
		$this->setThreshold($threshold);
		$this->setSleepTime($sleep);
		$this->_sleeper = $sleeper;
	}
	
	
	public function setThreshold($threshold)
	{
		$this->_threshold = $threshold;
	}
	
	
	public function getThreshold()
	{
		return $this->_threshold;
	}
	
	
	public function setSleepTime($sleep)
	{
		$this->_sleep = $sleep;
	}
	
	
	public function getSleepTime()
	{
		return $this->_sleep;
	}
	
	
	public function beforeSendPerformed(Swift_Events_SendEvent $evt)
	{
	}
	
	
	public function sendPerformed(Swift_Events_SendEvent $evt)
	{
		++$this->_counter;
		if ($this->_counter >= $this->_threshold)
		{
			$transport = $evt->getTransport();
			$transport->stop();
			if ($this->_sleep)
			{
				$this->sleep($this->_sleep);
			}
			
			$transport->start();
			$this->_counter = 0;
		}
	
	}
	
	
	public function sleep($seconds)
	{
		if (isset($this->_sleeper))
		{
			$this->_sleeper->sleep($seconds);
		}
		else
		{
			sleep($seconds);
		}
	
	}

}