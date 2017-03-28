<?php defined('_JEXEC') or die;
/**
 * @package   Fox Contact for Joomla
 * @copyright Copyright (c) Fox Labs, all rights reserved.
 * @license   Distributed under the terms of the GNU General Public License GNU/GPL v3 http://www.gnu.org/licenses/gpl-3.0.html
 * @see       Documentation: http://www.fox.ra.it/forum/2-documentation.html
 */

class Swift_Events_SimpleEventDispatcher implements Swift_Events_EventDispatcher
{
	private $_eventMap = array();
	private $_listeners = array();
	private $_bubbleQueue = array();
	
	public function __construct()
	{
		$this->_eventMap = array('Swift_Events_CommandEvent' => 'Swift_Events_CommandListener', 'Swift_Events_ResponseEvent' => 'Swift_Events_ResponseListener', 'Swift_Events_SendEvent' => 'Swift_Events_SendListener', 'Swift_Events_TransportChangeEvent' => 'Swift_Events_TransportChangeListener', 'Swift_Events_TransportExceptionEvent' => 'Swift_Events_TransportExceptionListener');
	}
	
	
	public function createSendEvent(Swift_Transport $source, Swift_Mime_Message $message)
	{
		return new Swift_Events_SendEvent($source, $message);
	}
	
	
	public function createCommandEvent(Swift_Transport $source, $command, $successCodes = array())
	{
		return new Swift_Events_CommandEvent($source, $command, $successCodes);
	}
	
	
	public function createResponseEvent(Swift_Transport $source, $response, $valid)
	{
		return new Swift_Events_ResponseEvent($source, $response, $valid);
	}
	
	
	public function createTransportChangeEvent(Swift_Transport $source)
	{
		return new Swift_Events_TransportChangeEvent($source);
	}
	
	
	public function createTransportExceptionEvent(Swift_Transport $source, Swift_TransportException $ex)
	{
		return new Swift_Events_TransportExceptionEvent($source, $ex);
	}
	
	
	public function bindEventListener(Swift_Events_EventListener $listener)
	{
		foreach ($this->_listeners as $l)
		{
			if ($l === $listener)
			{
				return;
			}
		
		}
		
		$this->_listeners[] = $listener;
	}
	
	
	public function dispatchEvent(Swift_Events_EventObject $evt, $target)
	{
		$this->_prepareBubbleQueue($evt);
		$this->_bubble($evt, $target);
	}
	
	
	private function _prepareBubbleQueue(Swift_Events_EventObject $evt)
	{
		$this->_bubbleQueue = array();
		$evtClass = get_class($evt);
		foreach ($this->_listeners as $listener)
		{
			if (array_key_exists($evtClass, $this->_eventMap) && $listener instanceof $this->_eventMap[$evtClass])
			{
				$this->_bubbleQueue[] = $listener;
			}
		
		}
	
	}
	
	
	private function _bubble(Swift_Events_EventObject $evt, $target)
	{
		if (!$evt->bubbleCancelled() && ($listener = array_shift($this->_bubbleQueue)))
		{
			$listener->{$target}($evt);
			$this->_bubble($evt, $target);
		}
	
	}

}