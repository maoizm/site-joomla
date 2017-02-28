jQuery(document).ready(function ($) {

  /*********   CONTACT FORMS   **********/

  // Add required attribute for input fields Fox with class='foxContactAddRequired'
  jQuery('.foxContactAddRequired input[type="text"]').attr('required', true);
  jQuery('.foxContactAddTypeEmail input[type="text"]').attr('type', 'email');

  // Change modal text before submit form IT-outsourcing
  jQuery('form[name="fox-form-m115"]').submit(function (e) {
    var form = this;
    e.preventDefault();

    jQuery('#modalContactFormBlock').modal('hide');
    jQuery('#modalThankYouOutsourcing').modal('show');

    setTimeout(function () {
      form.submit();
    }, 3000);
  });


  /******* Other utilities ******/

  // Scroll bottom on about page
  jQuery(".aboutCompany__bottomArrow").click( function (e) {
    e.preventDefault();
    jQuery('html, body').animate({
              scrollTop: jQuery(".article").offset().top - 30
            },
            'slow');
  });

  // Scroll to top page on scrollTopButton click
  jQuery(".scrollTopBtn").click(function () {
    jQuery('html, body').animate({
              scrollTop: jQuery("html").offset().top - 30
            },
            'slow');
  });

  // Scroll bottom on IT outsourcing page
  jQuery(".bottomScroll.bottomScroll--outsourcing").click(function (e) {
    e.preventDefault();
    jQuery('html,body').animate({
              scrollTop: jQuery(".article").offset().top - 30
            },
            'slow');
  });


  /******** Menu utilities ********/

  // Menu for screen width <767 (mobile):
  // Expand level 1 menu items with submenus instead of following the level 1 menu link
  jQuery("#mainmenu > li.deeper > a").click(function (e) {
    if (jQuery(window).width() <= 767) {
      e.preventDefault();
      jQuery(this).siblings('ul').toggle(250, "swing", true);                               // show or hide submeny of currently clicked item
      jQuery(this).parent().siblings("li.deeper").children("ul").hide(250, "swing", true);  // hide sibling submenus in any case
      jQuery.dequeue();
      jQuery(this).parent().toggleClass("expanded");
    }
  });

  // Add hover style to parent menu item in main menu
  jQuery("#mainmenu > li > ul").hover(
    function () {
      if (jQuery(window).width() > 767) {
        jQuery(this).parent().addClass("expanded");
      }
    },
    function () {
      if (jQuery(window).width() > 767) {
        jQuery(this).parent().removeClass("expanded");
      }
    }
  );

  // Hide expanded submenus when screen becomes wider than mobile
  jQuery(window).resize(function () {
    if (jQuery('.container').width() >= 720 ) {
      jQuery("#mainmenu > li.deeper > ul").hide();
      jQuery("#mainmenu > li.deeper > ul").removeAttr("style");
    }
  });



  /*********** SEARCH BUTTON ***********/

  // Search button changes
  jQuery('.searchButton').click(function () {
    jQuery('.mainMenuDiv').fadeOut(100);
    setTimeout(function () {
      jQuery('.searchLineDiv').fadeIn(200);
      jQuery('#mod-search-searchword').focus();
    }, 250);
  });
  jQuery('#mod-search-searchword').focusout(function () {
    jQuery('.searchLineDiv').fadeOut(100);
    setTimeout(function () {
      jQuery('.mainMenuDiv').fadeIn(100);
    }, 150);
  });



});
