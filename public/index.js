var loginForm = document.getElementById('loginForm');

function sendData(form, login) {
  var xhr = new XMLHttpRequest();
  var fd = new FormData(form);

  xhr.addEventListener('load', function(event) {

  });

  xhr.addEventListener('error', function(event) {
    console.log('an error occured');
  });

  if (login)
    xhr.open('POST', 'http://localhost:8080/login');
  else
    xhr.open('POST', 'http://localhost:8080/signup');

  xhr.send(fd);
}

function validateInputs() {
  var inputs = document.getElementsByTagName('input');
  var warning = document.getElementById('warning');
  var missingData = false;
  for (var i = 0; i < inputs.length; ++i) {
    var value = inputs[i].value;
    if (value === "") {
      missingData = true;
      break;
    }
  }
  if (!missingData)
    warning.style.display = 'none';
  else
    warning.style.display = 'inline';
}

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  validateInputs();
});
