$(function() {
  var $wrapper = $('#custom-inner')
    , $calendar = $('#calendar')
    , cal = $calendar.calendario( {
        onDayClick : function($el, $contentEl, dateProperties) {
          console.log($el);
          console.log($contentEl);
          console.log(dateProperties);
        },
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

  function updateMonthYear() {
    $month.html(cal.getMonthName());
    $year.html(cal.getYear());
  }
});
