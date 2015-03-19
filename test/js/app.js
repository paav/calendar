requirejs.config({
  "baseUrl": "js/lib",
  "paths": {
    "pcalendar": "paav/calendar/calendar",
    "pdate": "paav/pdate/pdate",
    "plib": "paav/lib/lib",
    "app": "../app",
    "jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min"
  }
});

requirejs(["app/main"]);
