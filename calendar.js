
var paav = paav || {};

+function() {
  var
    modules = [
      [ jQuery, 'jQuery' ],
      [ paav.date, 'paav.date' ],
      [ paav.lib, 'paav.lib' ],
    ],
    i;

  for (i = 0; i < modules.length; i++) {
    if (typeof modules[i][0] === 'undefined')
      throw new Error('paav.calendar requires ' + modules[i][1]);
  }
}();

paav.calendar = (function($) {
  'use strict';

  function Calendar(el, options) {
    var
       self = Calendar;

    if (el === 'undefined' || el.tagName !== 'INPUT')
      throw new Error('undefined or not input element');

    this._$el = $(el);
    this._options = $.extend(self._defaults, options);
    this._date = new paav.date('2015-05-15'); 
    this._picked = new paav.date('2015-05-15');

    this._selectors = self._makeSelectors(this._options.classes);

    this._$box = self._buildBox(this._options.classes);
    this._$dates = this._$box
      .find('tbody')
      .html(this._buildDates(this._date));

    this._$month = this._$box.find(this._selectors.month);
    this._$year = this._$box.find(this._selectors.year);

    this._setMonth();
    this._setYear();

    this._$el.after(this._$box);

    this._bindEvents();
  }

  Calendar._defaults = {
    classes: {
      prevMonth: 'prev',
      nextMonth: 'next',
      year: 'year',
      month: 'month',
      box: 'box',
      today: 'today',
      picked: 'picked',
      dates: 'dates',
      datesBox: 'datesBox',
      header: 'header',
      title: 'title',
    },
  };

  /**
   * @param {Object} classes CSS-classes
   */
  Calendar._buildBox = function(classes) {
    var tmpl =
      '<div class="' + classes.box + '">' +
        '<div class="' + classes.header + '">' +
          '<a class="' + classes.prevMonth + '">◀</a>' +
          '<a class="' + classes.nextMonth + '">▶</a>' +
          '<div class="' + classes.title + '">' +
            '<span class="' + classes.month + '"></span>' +
            '<span class="' + classes.year + '"></span>' +
          '</div>' +
        '</div>' +
        '<table class="' + classes.datesBox + '">' +
          '<thead>' +
            '<tr class="day-names">' +
              '<th>Пн</th>' +
              '<th>Вт</th>' +
              '<th>Ср</th>' +
              '<th>Чт</th>' +
              '<th>Пт</th>' +
              '<th>Сб</th>' +
              '<th>Вс</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody class="' + classes.dates + '">' +
          '</tbody>' +
        '</table>' +
      '</div>';

    return $(tmpl);
  };

  Calendar._makeSelectors = function(classes) {
    var
      selectors = {},
      key;

    for (key in classes)
      selectors[key] = '.' + classes[key];

    return selectors;
  };

  Calendar.prototype._bindEvents = function() {
    this._$box.on('click', this._selectors.prevMonth, this._onMonthChange.bind(this));
    this._$box.on('click', this._selectors.nextMonth, this._onMonthChange.bind(this));
    this._$box.on('click', this._selectors.dates + ' td:not(.empty)', this._onDateClick.bind(this));
  };

  Calendar.prototype._buildDates = function() {
    var
      oDate = this._date,
      oPickedDate = this._picked,
      oToday = new paav.date('2015-05-02'),
      monthFirstDay = oDate.getMonthFirstDay(),
      monthLastDate = oDate.getMonthLastDate(),
      html = '<tr>',
      date,
      cell,
      addClass,
      i;

    for (i = 0; i < monthFirstDay; i++)  {
      html += '<td class="empty"></td>';
    }

    //var monthLastDateDate = (new Date(year, month + 1, 0)).getDate();

    addClass = function(date, htmlString) {
      var
        classes = this._options.classes,
        dates = [
          {
            date: oPickedDate,
            className: classes.picked,
          },
          {
            date: oToday,
            className: classes.today,
          },
        ],
        oTargetDate,
        newHtml = htmlString;

      $.each(dates, function(i, val) {
        oTargetDate = val.date;

        newHtml = paav.lib.addClassIf(newHtml, val.className, function() {
          return date === oTargetDate.getDate() &&
            oDate.getFullYear() === oTargetDate.getFullYear() &&
            oDate.getMonth() === oTargetDate.getMonth();
        });
      });

      return newHtml;

    }.bind(this);

    for (date = 0; date < monthLastDate; i++) {
      cell = '<td>' + (++date) + '</td>';

      html += addClass(date, cell);

      if (i % 7 == 6)
        html += '</tr><tr>';
    }

    for (; i % 7 !== 0; i++)
      html += '<td class="empty"></td>';

    return html;

    //while(varDate.getMonth() == month) {
      //var varDateDate = varDate.getDate();
      //var varDateDay = getDay(varDate); 

      //table += '<td class="date-cell';

      //if (+varDate == +todayDate) {
        //table += " today-cell";
      //}

      //if (+varDate == +selectedDate) {
        //table += " selected-cell";
      //}

      //table += '">' + varDateDate + '</td>';

      //if (varDateDay % 7 == 6 &&
        //varDateDate != monthLastDateDate) {
        //table += '</tr><tr>';
      //}

      //varDate.setDate(varDateDate + 1);
    //}

    //varDateDay = getDay(varDate);

    //if (varDateDay != 0) {
      //for (var i = varDateDay; i < 7; i++) {
        //table += '<td></td>';
      //}
    //}
  };

  Calendar.prototype._buildMonth = function() {
    var $month = $(Calendar._monthTmpl);

    $month.find('td:nth-child(1)').addClass(this._options.classes.prevMonth);
    this._$month = $month.find('td:nth-child(2)').text(this._date.getMonthName());
    $month.find('td:nth-child(3)').addClass(this._options.classes.nextMonth);

    return $month[0];
  };

  Calendar.prototype._onMonthChange = function(e) {
    var
      classes = this._options.classes;

    switch(e.target.className) {
      case classes.prevMonth:
        this._date.prevMonth();
        break;

      case classes.nextMonth:
        this._date.nextMonth();
        break;
    }

    this._setDates();
    this._setMonth();
    this._setYear();
  };

  Calendar.prototype._onDateClick = function(e) {
    var
      $cell = $(e.target);

    this._picked = new paav.date(+this._date.setDate($cell.text())); 

    this._setDates();

    this._$el.val(this._picked.format('dd.mm.yyyy'));
  };

  Calendar.prototype._setMonth = function() {
    this._$month.text(this._date.getMonthName());
  };

  Calendar.prototype._setYear = function() {
    this._$year.text(this._date.getFullYear());
  };

  Calendar.prototype._setDates = function() {
    this._$dates.html(this._buildDates(this._date)); 
  };

  var  defaults = {
    selector: '.paav-calendar',
  };

  var create = function(selector) {
    selector = typeof selector === 'undefined' ? defaults.selector : selector;

    var $el = $(selector);
    
    if (!$el) return;

    var inst = new Calendar($el[0]);
  };


  //** API
  //
  return {
    create: create,
  };
})(jQuery);
