var loginForm = document.getElementById('loginForm');
var signupForm = document.getElementById('signupForm');

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
  var dataGood = true;
  for (var i = 0; i < inputs.length; ++i) {
    var value = inputs[i].value;
    if (value === "") {
      dataGood = false;
      break;
    }
  }
  if (dataGood)
    warning.style.visibility = 'none';
  else
    warning.style.visibility= 'initial';
  return dataGood;
}

if (loginForm != null) {
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateInputs())
      sendData(loginForm, true);
  });
}
else if (signupForm != null) {
  signupForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateInputs())
      sendData(signupForm, false);
  });
}