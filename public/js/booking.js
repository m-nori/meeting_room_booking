(function($, option) {
  var $bookingArea = $('#bookingArea')
    , times = $('div[data-time]')
    , rooms
    , roomOffset
    , $eventArea = $('#eventArea')
    ;

  /**
   * Booking Model
   * TODO: Backbone
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

  /**
   * Room Model
   * TODO: Backbone
   */
  var Room = (function() {
    function Room(o) {
      this.id = o.id || "";
      this.name = o.name || "";
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
        // , new Room({id: "7", name: "Room8"})
        // , new Room({id: "8", name: "Room9"})
        , new Room({id: "9", name: "Room10"})
      ];
    }
    return Room;
  })();

  /**
   * Calendar View
   */
  var CalendarView = Backbone.View.extend({
    events: {
      'click .custom-next': 'nextMonth',
      'click .custom-prev': 'previousMonth'
    },
    initialize: function(options) {
      this.render();
    },
    render: function() {
      this.cal = $(".fc-calendar-container", this.el).calendario({
        months : [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        onDayClick : this.dayClick,
        displayWeekAbbr : true
      });
      this.month = $('#custom-month').html(this.cal.getMonthName())
      this.year = $('#custom-year').html(this.cal.getYear())
    },
    nextMonth: function(e) {
      this.cal.gotoNextMonth($.proxy(this.updateMonthYear, this));
    },
    previousMonth: function(e) {
      this.cal.gotoPreviousMonth($.proxy(this.updateMonthYear, this));
    },
    updateMonthYear: function() {
      this.month.html(this.cal.getMonthName());
      this.year.html(this.cal.getYear());
    },
    dayClick: function($el, $contentEl, dateProperties) {
      $('.fc-today').removeClass('fc-today');
      $el.addClass('fc-today');
    }
  });

  /**
   * Room View
   */
  var RoomView = Backbone.View.extend({
    events: {
      'click div[data-time]': 'roomClick'
    },
    initialize: function(options) {
      this.startTime = options.option.startTime;
      this.collect = this.collection.all()
      this.render();
    },
    render: function() {
      var y = getTopY(this.startTime)
        , data = {rooms: rooms}
        ;
      for(var i = 0; i < rooms.length; i++) {
        rooms[i] = this.collect[i] ? this.collect[i] : new Room({}) ;
      }
      $('#booking-rooms-header').append(_.template($('#booking-rooms-header-view').text(), data));
      $('#booking-rooms-body').append(_.template($('#booking-rooms-body-view').text(), data));
      $('#booking-time-area').scrollTop(y);
    },
    roomClick: function(e) {
      var $div = $(e.currentTarget)
        , time = $div.data('time')
        , x =  e.pageX - $div.offset().left
        , room = this.getRoom(x)
        ;
      if(room) {
        var booking = new Booking({
            roomId: room.id
          , start: time
          , end: "15:00"
        });
        setBooking(booking);
      }
    },
    getRoom: function(x) {
      var i = Math.floor(x / roomOffset);
      return rooms.length > i ? rooms[i] : null;
    }
  });

  /**
   * Document Ready
   */
  $(function() {
    new CalendarView({el: $('#calendar-view')});
    rooms = new Array(option.roomCount);
    new RoomView({el: $('#booking-rooms'), collection: Room, option: option});
    roomOffset = $('[data-room]').eq(0).width();
  });

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
    return _.template($('#booking-view').text(), data);
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

