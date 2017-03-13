<?php
  defined( '_JEXEC' ) or die;
  require_once JPATH_THEMES.'/'.$this->template.'/logic.php';
?>
<!doctype html>
<html lang="<?php echo $this->language; ?>">
<!-- template:<?php echo $this->template; ?> -->
<!--   itemId:<?php echo $itemId; ?>         -->
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&amp;subset=cyrillic,cyrillic-ext" rel="stylesheet">
  <!--
       TODO bootstrap 3.3.7 plugins: collapse, transition, modal, buttons,
       TODO remove redundand & debug css/js in production:
       TODO replace with minified files the rest -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-W8KDD4');</script>

  <jdoc:include type="head" />
<!--  <script
      src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"
      integrity="sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30="
      crossorigin="anonymous"></script>-->
</head>

<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W8KDD4"
                    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <?php include_once($assetsPathFile . '/images/icons.svg'); ?>


  <header class="container-fluid">
    <div class="b-topRow row">
      <div class="col-xs-12 col-sm-8 col-md-3 col-lg-4">
        <a title="StarLink" href="<?php JURI::base() ?>">
          <div class="b-logo">
            <img class="b-logo__image" src="<?=$assetsPath?>/images/logo-vector.svg">
            <!--<svg class="b-logo__image">
              <use xlink:href="#iconStarlink" class="" />
            </svg>-->
          </div>
        </a>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
        <div class="b-phone">
          <!-- TODO  change phone number and logo for parameters of template  -->
          <div class="custom">
            <div class="-no-topPhone -no-b-phone">
              <a class="b-phone__link" href="tel:+380443777090">
                <svg class="icon iconPhone"><use xlink:href="#iconPhone" /></svg>
                &nbsp;<span class="b-phone__small">(</span>044<span class="b-phone__small">)</span> 3777-090</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-6 col-md-offset-0 col-lg-5 mainMenuDiv">
        <nav class="navbar navbar-default">
          <div class="navbar-header MenuToggleHolder__content">
            <button type="button" class="navbar-toggle collapsed"
                    data-toggle="collapse" data-target="#mainCollapse" aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          <div class="collapse navbar-collapse" id="mainCollapse">
            <jdoc:include type="modules" name="s01-MainMenu" />
            <a href="javascript:void(0)" class="searchButton">
              <img src="/images/main/search_icon.png">
            </a>
          </div>
        </nav>
      </div>
      <div class="hidden-xs hidden-sm col-md-6 col-lg-5 searchLineDiv">
        <jdoc:include type="modules" name="s02-search" />
      </div>
    </div>
  </header>

  <?php
  foreach (array('s03-HeroPosition', 's04-SubMenu', 's05-Offer') as $position) {
    if ($this->countModules($position)) : ?>
      <!-- begin jdoc:include type="modules" name="< ?= $position ? >" -->
        <jdoc:include type="modules" name="<?=$position?>" />
    <?php endif;
  } ?>


  <main>
    <!-- BEGIN jdoc:include type="component" -->
    <jdoc:include type="component"/>
  </main>


  <?php
  foreach (array('s06-Details', 's07-AllServices', 's08-CalltoAction', 's09-InfoBlock', 's10-BottomBlock') as $position) {
    if ($this->countModules($position)) : ?>
      <!-- begin jdoc:include type="modules" name="< ?=$position? >" -->
        <jdoc:include type="modules" name="<?=$position?>" />
    <?php endif;
  } ?>

  <div class="pre-footer"></div>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-xs-12 copyright h5 footer__row">
          &copy; 2016 &nbsp; <a class="footer__link" href="<?= JURI::base() ?>">Старлинк</a>
        </div>
        <div class="col-md-6 col-xs-12 h5 footer__row">
          <jdoc:include type="modules" name="s80-FooterMenu" />
        </div>


        <div class="col-md-3 col-xs-12 text-center footer__socialBlock">
          <a class="footer__link footer__link--icon mr2" href="https://www.facebook.com/StarlinkUA/" target="_blank">
            <svg class="svgBlock">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#iconFacebook" class="svgBlock__icon svgBlock__icon--facebook" />
            </svg>
          </a>
          <a class="footer__link footer__link--icon mr2" href="https://twitter.com/StarlinkUa/" target="_blank">
            <svg class="svgBlock">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#iconTwitter" class="svgBlock__icon svgBlock__icon--twitter" />
            </svg>
          </a>
          <a class="footer__link footer__link--icon" href="https://plus.google.com/u/1/b/107580631455821459922/107580631455821459922?hl=uk" target="_blank">
            <svg class="svgBlock">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#iconGooglePlus" class="svgBlock__icon svgBlock__icon--google" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>

  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalContactFormBlock" id="modalContactFormBlock">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="modalFormCloseBtn close" data-dismiss="modal" aria-hidden="true"></button>
          <h2 class="header mt2 mb0">Отправить заявку на абонентское обслуживание</h2>
        </div>
        <jdoc:include type="modules" name="s99-ModalContactForm" />
        <div class="mb2"></div>
      </div>
    </div>
  </div>
  <div class="modal fade" role="dialog" aria-labelledby="modalThankYouOutsourcing" id="modalThankYouOutsourcing">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="modalFormCloseBtn close" data-dismiss="modal" aria-hidden="true"></button>
          <h2 class="header mt2 mb0">Ваша заявка успешно отправлена</h2>
        </div>
        <div class="modal-body">
          <p class="article__text">Спасибо за ваше обращение! Наши специалисты ответят на Ваш запрос в ближайшее время.</p>
        </div>
      </div>
      <div class="js-thankYouOutsourcing">
        <h2 class="header mt2 mb3">Ваша заявка успешно отправлена</h2>
        <p class="article__text">Спасибо за ваше обращение! Наши специалисты ответят на Ваш запрос в ближайшее время.</p>
      </div>
    </div>
  </div>

</body>

</html>
