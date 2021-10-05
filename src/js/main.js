(function () {
    "use strict";
    /**1. Get current year at footer area */
    var date = new Date();
    var currentYear = "&copy;" + date.getFullYear();
    document.getElementById("cYear").innerHTML =
      currentYear + " Obids | All Rights Reserved";
  
  });