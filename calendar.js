var paav = {};

paav.date = (function($) {
  var PDate = function() {
    this._date = new Date('2015-04-01');
  };

  PDate._monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  PDate.prototype.getMonthFirstDay = function() {
    var
       oFirstDate = new Date(this._date.getFullYear(), this._date.getMonth()),
      firstDay = oFirstDate.getDay();

    return firstDay === 0 ? 6 : firstDay - 1;
  };

  PDate.prototype.getMonthLastDate = function() {
    var oMonthLastDate = new Date(this._date.getFullYear(), this._date.getMonth() + 1, 0);

    return oMonthLastDate.getDate();
  };

  PDate.prototype.getMonthName = function() {

    return PDate._monthNames[this._date.getMonth()];
  };

  PDate.prototype.nextMonth = function() {
    this._date.setMonth(this._date.getMonth() + 1);
  };

  PDate.prototype.prevMonth = function() {
    this._date.setMonth(this._date.getMonth() - 1);
  };

  [
    'geFullYear',
    'getMonth',
    'getDate',
    'getDay',
    'getDate',
    'setMonth',
  ].forEach(function (key) {
      PDate.prototype[key] = function () {
          return Date.prototype[key].apply(this._date, arguments);
      };
  });

  return PDate;
})(jQuery);

paav.calendar = (function($) {
  'use strict';

  function Calendar(el, options) {
    var
       self = Calendar;

    if (el === 'undefined' || el.tagName !== 'INPUT')
      throw new Error('undefined or not input element');

    this._$el = $(el);
    this._options = $.extend(self._defaults, options);
    this._date = new paav.date(); 

    this._selectors = self._makeSelectors(this._options.classes);

    this._$box = self._buildBox(this._options.classes);
    this._$dates = this._$box
      .find('tbody')
      .html(self._buildDates(this._date));

    this._$month = this._$box.find(this._selectors.month);
    this._setMonth();

    this._$el.after(this._$box);

    this._bindEvents();
  }

  Calendar._defaults = {
    classes: {
      prevMonth: 'prev-month',
      nextMonth: 'next-month',
      month: 'month',
      box: 'calendar',
    },
  };

  /**
   * @param {Object} classes CSS-classes
   */
  Calendar._buildBox = function(classes) {
    var tmpl =
      '<table class="' + classes.box + '">' +
        '<thead>' +
          '<tr>' +
            '<td class="' + classes.prevMonth + '">&laquo</td>' +
            '<td class="' + classes.month + '" colspan="5"></td>' +
            '<td class="' + classes.nextMonth + '">&raquo</td>' +
          '</tr>' +
          '<tr>' +
            '<td>пн</td>' +
            '<td>вт</td>' +
            '<td>ср</td>' +
            '<td>чт</td>' +
            '<td>пт</td>' +
            '<td>сб</td>' +
            '<td>вс</td>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
      '</table>';

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
  };

  /**
   *
   * @param {PDate} pdate paav.date object
   */
  Calendar._buildDates = function(pdate) {
    var
      monthFirstDay = pdate.getMonthFirstDay(),
      monthLastDate = pdate.getMonthLastDate(),
      html = '<tr>',
      date,
      i;

    for (i = 0; i < monthFirstDay; i++)  {
      html += '<td></td>';
    }

    //var monthLastDateDate = (new Date(year, month + 1, 0)).getDate();

    for (date = 0; date < monthLastDate; i++) {
      html += '<td>' + (++date) + '</td>';

      if (i % 7 == 6)
        html += '</tr><tr>';
    }

    for (; i % 7 !== 0; i++)
      html += '<td></td>';

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
  };

  Calendar.prototype._setMonth = function() {
    this._$month.text(this._date.getMonthName());
  };

  Calendar.prototype._setDates = function() {
    this._$dates.html(Calendar._buildDates(this._date)); 
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










// Old code
  var inputIds = [
    'cal-from',
    'cal-to',
    'cal',
  ];

  var classPrefix = 'paav-calendar';

  $(function() {
    var cals = [];
    var j = 0;
    
    for (var i = 0; i < inputIds.length; i++) {
      var inputJq = $('#' + inputIds[i]); 

      if (inputJq.length == 0) {
        continue;
      }

      inputJq.attr('autocomplete', 'off'); 
      
      var mainDivClass = classPrefix + ' ' + inputIds[i];
      var tableSelector = '.' + classPrefix + '.' + inputIds[i] + ' table';
      inputJq.wrap($('<div class="' + mainDivClass + '"></div>'));

      cals[j] = new Calendar();

      cals[j].appendTo(inputJq);
      cals[j].bindWith(inputJq);
      cals[j].hide();
    
      inputJq.on('click', null, { allCalObjs: cals }, (function(calObj) {
        return function(e) {
          var allCalObjs = e.data.allCalObjs;
          
          if (allCalObjs.length > 1) { 
            for (var i = 0; i < allCalObjs.length; i++) {
              allCalObjs[i].hide();
            }
          }

          calObj.show();
          e.stopPropagation();
        }
      })(cals[j]));

      $('html').on('click', hideCal(cals[j]));

      j++;
    }

    function hideCal(calObj) {
      return function() {
        calObj.hide();
      }
    }

    function Calendar(year, month) {
      var todayDate = new Date
      todayDate.setHours(0, 0, 0, 0);

      year = year || todayDate.getFullYear();
      month = month || todayDate.getMonth();

      var monthFirstDate = new Date(year, month - 1);
      var selectedDate = new Date(todayDate);
      var tableJq = $(render());
      var isBinded = false;
      var inputJq;

      tableJq.on('click', '.date-cell', function() {
        tableJq.find('.selected-cell').removeClass('selected-cell');
        selectedDate = new Date(monthFirstDate);
        selectedDate.setDate(+$(this).addClass('selected-cell').html());

        if (isBinded) {
          inputJq.val(dateFormat(selectedDate));
        }
      });

      tableJq.on('click', '#prev-month', function(e) {
        monthFirstDate.setMonth(monthFirstDate.getMonth() - 1); 
        tableJq.html(render());
        e.stopPropagation();
      });

      tableJq.on('click', '#next-month', function(e) {
        monthFirstDate.setMonth(monthFirstDate.getMonth() + 1); 
        tableJq.html(render());
        e.stopPropagation();
      });

      this.hide = function() {
        tableJq.hide();
      }

      this.show = function() {
        tableJq.show();
      }

      this.appendTo = function(jqObj) {
        jqObj.after(tableJq);
      }

      this.bindWith = function(jqInputObj) {
        if (jqInputObj.prop('tagName') != 'INPUT') {
          throw new Error('not an input jQuery object');
        }

        inputJq = jqInputObj;
        isBinded = true;

        var inputValue = inputJq.val()

        if (inputValue) {
          selectedDate = getDateFromFormat(inputValue);
        } else {
          selectedDate = new Date();
        }

        selectedDate.setHours(0, 0, 0, 0);
        monthFirstDate = new Date(selectedDate.getFullYear(),
          selectedDate.getMonth());

        tableJq.html(render());
      }
      
      function render() {
        year = monthFirstDate.getFullYear();
        month = monthFirstDate.getMonth();

        var monthName = getMonthName(month);
        var table = '<table class="cal">'
                  + '<tr class="month-selection">'
                  + '<td id="prev-month">&laquo</td>'
                  + '<td colspan="5">' + monthName + ' ' + year + '</td>'
                  + '<td id="next-month">&raquo</td>'
                  + "</tr>"
                  + '<tr class="day-names">'
                  + "<td>пн</td><td>вт</td><td>ср</td><td>чт</td>"
                  + "<td>пт</td><td>сб</td><td>вс</td>"
                  + "</tr>"
                  + "<tr>";

        var vardate = new date(monthfirstdate);

        for (var i = 0; i < getday(vardate); i++)  {
          table += "<td></td>";
        }

        var monthlastdatedate = (new date(year, month + 1, 0)).getdate();

        while(vardate.getmonth() == month) {
          var vardatedate = vardate.getdate();
          var vardateday = getday(vardate); 

          table += '<td class="date-cell';

          if (+vardate == +todaydate) {
            table += " today-cell";
          }

          if (+vardate == +selecteddate) {
            table += " selected-cell";
          }

          table += '">' + vardatedate + '</td>';

          if (vardateday % 7 == 6 &&
            vardatedate != monthlastdatedate) {
            table += '</tr><tr>';
          }

          vardate.setdate(vardatedate + 1);
        }

        vardateday = getday(vardate);

        if (vardateday != 0) {
          for (var i = vardateday; i < 7; i++) {
            table += '<td></td>';
          }
        }

        table += '</tr></table>';
        
        return table;
      }

      function getMonthName(monthNum) {
        var monthNames = [
          'Январь',
          'Февраль',
          'Март',
          'Апрель',
          'Май',
          'Июнь',
          'Июль',
          'Август',
          'Сентябрь',
          'Октябрь',
          'Ноябрь',
          'Декабрь',
        ];

        return monthNames[monthNum];
      }

      function getDay(date) {
        var day = date.getDay();

        if (day == 0) day = 7;

        return day - 1;
      }

      function getDateFromFormat(dateStr) {
        var dateParts = dateStr.split(/[./-]/);
        
        if (dateParts.length > 3) {
          throw new Error('more than three date parts');
        }

        return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);    
      }

      function dateFormat(dateObj) {
        var delim = '.';

        return strPad(dateObj.getDate()) + delim + strPad(dateObj.getMonth() + 1) + delim
          + dateObj.getFullYear();
      }

      function strPad(str) {
        console.log(str);
        return ('0' + str).slice(-2);
      }
    }
  });
})(jQuery);
