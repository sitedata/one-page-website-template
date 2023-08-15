(function () {
  "use strict";

  var CONTACT_ENDPOINT = "/api/contact";

  window.addEventListener("load", onLoad);

  function onLoad() {
    window.removeEventListener("load", onLoad);

    document
      .querySelector("#arrow-down")
      .addEventListener("click", function (event) {
        event.preventDefault();
        document.querySelector("#main").scrollIntoView();
      });

    var contactForm = document.querySelector("#contact-form");

    contactForm.addEventListener("submit", onSubmit);

    function onSubmit(event) {
      event.preventDefault();
      event.stopPropagation();

      var button = contactForm.querySelector('button[type="submit"]');
      button.blur();

      var name = contactForm.querySelector("#contact-name").value.trim();
      var email = contactForm.querySelector("#contact-email").value.trim();
      var message = contactForm.querySelector("#contact-message").value.trim();

      if (!name || !email || !message) {
        return;
      }

      button.disabled = true;

      request(
        CONTACT_ENDPOINT,
        {
          name: name,
          email: email,
          message: message,
        },
        function (status, response) {
          button.disabled = false;
          if (status !== 200) {
            console.error(status, response);
            return;
          }
          contactForm.reset();
        }
      );
    }
  }

  function request(url, params, callback) {
    var req = new XMLHttpRequest();

    req.open("POST", url);

    var headers = {
      "Content-type": "application/json",
    };

    for (var header in headers) {
      req.setRequestHeader(header, headers[header]);
    }

    req.onload = function () {
      callback(this.status, this.responseText);
    };

    req.onerror = function (e) {
      console.error(e);
      callback();
    };

    var body = JSON.stringify(params);

    req.send(body);
  }
})();
