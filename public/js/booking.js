$(function() {
  /**
   * カレンダー周りの操作
   */
  var $wrapper = $('#custom-inner')
    , $calendar = $('#calendar')
    , cal = $calendar.calendario( {
        months : [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        onDayClick : onDayClick,
        displayWeekAbbr : true
      })
    , $month = $('#custom-month').html(cal.getMonthName())
    , $year = $('#custom-year').html(cal.getYear())
    ;

  $('#custom-next').on('click', function() {
    cal.gotoNextMonth(updateMonthYear);
  });
  $('#custom-prev').on('click', function() {
    cal.gotoPreviousMonth(updateMonthYear);
  });

  function onDayClick($el, $contentEl, dateProperties) {
    $('.fc-today').removeClass('fc-today');
    $el.addClass('fc-today');
  }

  function updateMonthYear() {
    $month.html(cal.getMonthName());
    $year.html(cal.getYear());
  }

  /**
   * 予定表周りの操作
   */
});
