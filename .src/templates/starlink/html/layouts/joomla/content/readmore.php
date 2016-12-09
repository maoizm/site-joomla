<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
 * @copyright   Copyright (C) 2005 - 2016 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('JPATH_BASE') or die;

$params = $displayData['params'];
$item = $displayData['item'];

$catid=getCatId();
echo '<!-- catid= ' . $catid . ' -->' ;

if ($catid == 9) {
  $classReadmoreBtn = 'btn';
} else {
  $classReadmoreBtn = 'blogReadmore';
}

?>

<!-- the p below is generated by starlink & joomla/content/readmore layout override -->
<p class="article__readMore article__readMore--right">
	<a class="<?=$classReadmoreBtn?> article__btn article__btn--news" href="<?php echo $displayData['link']; ?>" itemprop="url">
		<span class="icon-chevron-right"></span>
		<?php if (!$params->get('access-view')) :
			echo JText::_('COM_CONTENT_REGISTER_TO_READ_MORE');
		elseif ($readmore = $item->alternative_readmore) :
			echo $readmore;
			if ($params->get('show_readmore_title', 0) != 0) :
				echo JHtml::_('string.truncate', ($item->title), $params->get('readmore_limit'));
			endif;
		elseif ($params->get('show_readmore_title', 0) == 0) :
			echo JText::sprintf('COM_CONTENT_READ_MORE_TITLE');
		else :
			echo JText::_('COM_CONTENT_READ_MORE');
			echo JHtml::_('string.truncate', ($item->title), $params->get('readmore_limit'));
		endif; ?>
	</a>
</p>
