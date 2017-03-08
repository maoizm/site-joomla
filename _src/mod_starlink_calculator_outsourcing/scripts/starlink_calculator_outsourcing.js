

 /**
  * $gradient(): Generates unprefixed CSS value for gradient between ColorDarkm color1 and color2 at 0%, precent and 100% stops;
  * This vallue should be assigned to background-image CSS property and autoprefixed accordingly
  *
  * @param direction
  * @param colorDark
  * @param color1
  * @param color2
  * @param percent
  * @returns {string}
  */

function gradient(direction, colorDark, color1, color2, percent) {
  return 'linear-gradient(' + direction + ',' + colorDark + ' 0%,' + color1 + ' ' + percent + '%,' + color2 + ' ' + percent + '%,' + color2 + ' 100%)';
}






 /**
  * $getProperty(): gets calculated CSS property of #id element as it is before script execution
  *
  * @param id
  * @param property
  * @returns {string}
  */

function getProperty(id, property) {
  var tempElement = document.getElementById(id);
  var tempStyle = window.getComputedStyle(tempElement);
  return tempStyle.getPropertyValue(property);
}



jQuery.noConflict();
jQuery(document).ready(function($) {
  // check if calculator element exists on the page
  const CALC_ID = "#connect_form";
  if ( ! jQuery(CALC_ID).length ) {
    return;
  }

  jQuery(CALC_ID).attr('data-starlink-jqueryFull-version', jQuery.fn.jquery );
  jQuery(CALC_ID).attr('data-starlink-jqueryDollar-version', $.fn.jquery );



  var pcColor = getProperty('slider-pc-count', 'background-color');
  var pcDark = getProperty('slider-pc-count', 'border-left-color');
  var serverColor = getProperty('slider-server-count','background-color');
  var serverDark = getProperty('slider-server-count', 'border-left-color');
  var virtualColor = getProperty('slider-virtual-count','background-color');
  var virtualDark = getProperty('slider-virtual-count', 'border-left-color');
  var sliderColor = 'rgba(202,207,211,1)';

  // input Masks

  // Add or reduce count of "planed leaves"
  $('.sign--minus').click(function () {
    var Sinput = $(this).parent().find('input');
    var count = parseInt(Sinput.val()) - 1;
    count = count < 0 ? 0 : count;
    Sinput.val(count);
    Sinput.change();
    return false;
  });

  $('.sign--plus').click(function () {
    var Sinput = $(this).parent().find('input');
    Sinput.val(parseInt(Sinput.val()) + 1);
    Sinput.change();
    return false;
  });


  var changeActiveDigit = function (id, value) {
    $(id + ' .digit--active').removeClass('digit--active');
    $(id).children().eq(Math.floor(value)).addClass('digit--active');
  };

  var sliderConfig = {
    '#slider-pc-count': {
      min: 0, max:29, value: 25, link: '#pcCount',
      colors: [ pcDark, pcColor ]
    },
    '#slider-server-count': {
      min: 0, max:15, value: 10, link: '#serverCount',
      colors: [ serverDark, serverColor ]
    },
    '#slider-virtual-count': {
      min: 0, max:7, value: 5, link: '#virtualCount',
      colors: [ virtualDark, virtualColor ]
    }
  };


  function slideFunction(id) {
    return function(event, ui) {
      $(sliderConfig[id].config.link).val(ui.value);

      var val = ui.value / sliderConfig[id].max * 100;
      $(id).css( 'background-image', '-webkit-' +
          gradient('left', sliderConfig[id].config.colors[0], sliderConfig[id].config.colors[1],
                    sliderColor, val)
      ).css(
        'background-image',
        gradient('to right', sliderConfig[id].config.colors[0], sliderConfig[id].config.colors[1],
                    sliderColor, val)
      );
      changeActiveDigit( id + "-digits", ui.value);
    }
  }

  for (var k in Object.keys(sliderConfig)) {
    var s = Object.keys(sliderConfig)[k];
    $(s).slider({
      orientation: "horizontal",
      min: sliderConfig[s].min, max: sliderConfig[s].max,
      value: sliderConfig[s].value
    });
    $(s).on("slide", slideFunction(s));
    changeActiveDigit(s + '-digits', sliderConfig[s].value);
    $(sliderConfig[s].config.link).val(sliderConfig[s].value);
  }

  // Parse admin data
  var pcPrice = $("#pc_price").val();
  var serverPrice = $("#server_price").val();
  var virtualPrice = $("#virtual_server_price").val();
  var personalDevicePrice = $("#personal_device_price").val();
  var additionalLeavePrice = $("#additional_leave").val();
  var kursEuro = parseFloat($("#kurs_euro").val());
  var inflationPercent = $("#inflation_percent").val();

  var pcPriceArr = pcPrice.split("; ").map(Number);
  var serverPriceArr = serverPrice.split("; ").map(Number);
  var virtualPriceArr = virtualPrice.split("; ").map(Number);
  var personalDevicePriceArr = personalDevicePrice.split("; ").map(Number);
  var additionalLeavePriceArr = additionalLeavePrice.split("; ").map(Number);

  // Main calculate function
  function calculateResult() {
    var result = 0;
    var pcCount = parseInt(jQuery("#pcCount").val());
    var serverCount = parseInt(jQuery("#serverCount").val());
    var virtualCount = parseInt(jQuery("#virtualCount").val());
    var nTotalServ = serverCount + virtualCount;

    var leavesCount1 = parseInt(jQuery("#leavesCount1").val());
    var leavesCount2 = parseInt(jQuery("#leavesCount2").val());
    var leavesCount3 = parseInt(jQuery("#leavesCount3").val());

    var serviceLevel = parseInt(jQuery("input[name=level]:checked").val());

    var discount = Math.max( pcCount < 20 ? 0 : pcCount < 40 ? 0.1 : pcCount < 60 ? 0.2 : 0.25, nTotalServ < 6 ? 0 : nTotalServ < 12 ? 0.1 : 0.15 );

    if(serviceLevel == 0) {
      result = pcCount*pcPriceArr[0] + serverCount*serverPriceArr[0] + virtualCount*virtualPriceArr[0] + leavesCount1*additionalLeavePriceArr[0];
    }

    if(serviceLevel == 1) {
      result = pcCount*pcPriceArr[1] + serverCount*serverPriceArr[1] + virtualCount*virtualPriceArr[1] + leavesCount2*additionalLeavePriceArr[1];
    }

    if(serviceLevel == 2) {
      result = pcCount*pcPriceArr[2] + serverCount*serverPriceArr[2] + virtualCount*virtualPriceArr[2] + leavesCount3*additionalLeavePriceArr[2];
    }

    result = Math.round(result * inflationPercent * kursEuro * (1 - discount));

    jQuery("#calcResult").val(result);
  }

  // If CHANGE "#slider-pc-count"
  $("#slider-pc-count").slider({
    change: function(event, ui) {
      calculateResult();
    }
  });

  // If CHANGE "input-pc-count"
  $("#pcCount").change(function() {
    var pcCount = parseInt($(this).val());

    if(!pcCount || pcCount < 0) {
      pcCount = 0;
      $(this).val(0);
    }

    if(pcCount > 60) {
      pcCount = 60;
      swal('Значение более "60" нужно просчитывать с менеджером компании');
      //alert('Значение более "60" нужно просчитывать с менеджером компании');
      $(this).val(60);
    }

    $("#slider-pc-count").slider({
      value: pcCount
    });

    $(this).val(pcCount);

    calculateResult();
  });

  // If CHANGE "#slider-server-count"
  $("#slider-server-count").slider({
    change: function(event, ui) {
      calculateResult();
    }
  });

  // If CHANGE "input-server-count"
  $("#serverCount").change(function() {
    var serverCount = parseInt($(this).val());

    if(!serverCount || serverCount < 0) {
      serverCount = 0;
      $(this).val(0);
    }

    if(serverCount > 15) {
      swal('Значение более "15" нужно просчитывать с менеджером компании');
      //alert('Значение более "15" нужно просчитывать с менеджером компании');
      $(this).val(15);
      serverCount = 15;
    }

    $("#slider-server-count").slider({
      value: serverCount
    });

    $(this).val(serverCount);

    calculateResult();
  });

  // If CHANGE "#slider-virtual-count"
  $("#slider-virtual-count").slider({
    change: function(event, ui) {
      calculateResult();
    }
  });

  // If CHANGE "input-server-count"
  $("#virtualCount").change(function() {
    var virtualCount = parseInt($(this).val());

    if(!virtualCount || virtualCount < 0) {
      virtualCount = 0;
      $(this).val(0);
    }

    if(virtualCount > 15) {
      swal('Значение более "15" нужно просчитывать с менеджером компании');
      //alert('Значение более "15" нужно просчитывать с менеджером компании');
      $(this).val(15);
      virtualCount = 15;
    }

    $("#slider-virtual-count").slider({
      value: virtualCount
    });

    $(this).val(virtualCount);

    calculateResult();
  });


  $(".sign").click(function() {
    calculateResult();
  });

  $("input[name='level']").change(function() {
    $('.SLAtable .SLAtable__row').removeClass('SLAtable__row--active');
    if ($(this).is(':checked')) {
      $(this).parent().parent().addClass('SLAtable__row--active');
    }
    calculateResult();
  });

});