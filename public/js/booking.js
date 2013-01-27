(function($, option) {
  // TODO: リファクタリング必須
  var $calendar = $('#calendar')
    , cal = $calendar.calendario( {
        months : [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        onDayClick : onDayClick,
        displayWeekAbbr : true
      })
    , $month = $('#custom-month').html(cal.getMonthName())
    , $year = $('#custom-year').html(cal.getYear())
    , $bookingArea = $('#bookingArea')
    , times = $('div[data-time]')
    , rooms
    , roomOffset
    , viewRooms
    , viewRoomTime = $("th.fc-agenda-axis.fc-widget-header.fc-first ~ td.fc-disabled")
    , $eventArea = $('#eventArea')
    ;

  /**
   * Model
   */
  var Booking =  (function () {
    function Booking(o) {
      this.id =  o.id || "0";
      this.roomId =  o.roomId || "0";
      this.title =  o.title || "test";
      this.start =  o.start || "15:00";
      this.end =  o.end || "16:00";
    }
    return Booking;
  })();

  var Room = (function() {
    function Room(o) {
      this.id = o.id || "0";
      this.name = o.name || "Room";
    };
    Room.all = function() {
      return [
          new Room({id: "0", name: "Room1"})
        , new Room({id: "1", name: "Room2"})
        , new Room({id: "2", name: "Room3"})
        , new Room({id: "3", name: "Room4"})
        , new Room({id: "4", name: "Room5"})
        , new Room({id: "5", name: "Room6"})
        , new Room({id: "6", name: "Room7"})
        , new Room({id: "7", name: "Room8"})
        , new Room({id: "8", name: "Room9"})
        , new Room({id: "9", name: "Room10"})
      ];
    }
    return Room;
  })();

  /**
   * Controller
   */

  /**
   * 表示設定
   */
  function initRoom(option) {
    var roopCount = option.roomCount - 1;
    $('#booking-rooms-header-view').tmpl({rooms: new Array(roopCount)}).appendTo('#booking-rooms-header');
    $('#booking-rooms-body-view').tmpl({rooms: new Array(roopCount)}).appendTo('#booking-rooms-body');
  }
  function initStartTime(option) {
    var y = getTopY(option.startTime);
    $('#booking-time-area').scrollTop(y);
  }
  initRoom(option);
  initStartTime(option);
  viewRooms = $('[data-room]')
  roomOffset = $(viewRooms[0]).width();

  /**
   * カレンダー周りのイベント
   */
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
   * 予定表周りのイベント
   */
  // TODO: 会議室の取得
  rooms = Room.all();

  // 会議室の設定
  for(var i =  0; i < rooms.length; i++) {
    var $view =  $(viewRooms[i]);
    $view.data('room', rooms[i].id);
    $view.text(rooms[i].name);
    $view.removeClass('fc-disabled');
    $(viewRoomTime[i]).removeClass('fc-disabled');
  }

  // 時間をクリックした時の処理
  $(document).on('click', 'div[data-time]', function(e) {
    var $div = $(this)
      , time = $div.data('time')
      , x =  e.pageX - $div.offset().left
      , room = getRoom(x)
      ;
    if(room) {
      var booking = new Booking({
          roomId: room.id
        , start: time
        , end: "15:00"
      });
      setBooking(booking);
    }
    return false;
  });

  function getRoom(x) {
    var i = Math.floor(x / roomOffset);
    if(rooms.length > i) {
      return rooms[i];
    }
    return null;
  }

  /**
   * 予定周りのイベント
   */
    ;
  function setBooking(booking) {
    $bookingArea.append(bookingToHtml(booking));
  }

  function bookingToHtml(booking) {
    var top = getTopY(booking.start)
      , left = getStartX(booking.roomId)
      , height = getHeight(booking.start, booking.end)
      , width = roomOffset - 3
      , data = {booking: booking, top: top, left: left, height: height, width: width}
      ;
    return $('#booking-view').tmpl(data);
  }

  function getStartX(roomId) {
    var index = -1;
    for(var i =  0; i < rooms.length; i++) {
      if(rooms[i].id === roomId) {
        index = i;
        break;
      }
    }
    if(index >= 0) {
      return 50 + (index * (roomOffset + 2));
    }
  }

  function getTopY(time) {
    var index = getTimeIndex(time);
    if(index >= 0) {
      return (index * 21)
    }
  }

  function getHeight(startTime, endTime) {
    var startIndex = getTimeIndex(startTime)
      , endIndex = getTimeIndex(endTime)
      , length = (endIndex - startIndex);
      ;
    return (21 * length);
  }

  function getTimeIndex(time) {
    var targetSlotClass
      , index = -1
      ;
    for(var i = 0; i < times.length; i++) {
      $div = $(times[i]);
      if($div.data('time') === time) {
        targetSlotClass = $div.parent().parent().attr('class');
        index = parseInt(targetSlotClass.substring(7));
        break;
      }
    }
    return index;
  }

})( jQuery, bookingOption );

