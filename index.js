"use strict";

const form = document.getElementById("myForm");
const email = form.elements.email;

class YandexForm {
  constructor(form) {
    this.form = form;
    this.inputs = {
      fio: this.form.elements.fio,
      email: this.form.elements.email,
      phone: this.form.elements.phone
    };
    this.addHandlers();
  }

  validators(value) {
    return {
      isPhoneValid() {
        const regex = /^\+7\(\d\d\d\)\d\d\d-\d\d-\d\d$/;
        const PHONE_MAX_SUM = 30;
        const digits = value.match(/\d/g);
        let sum = 0;
        if (digits) {
          sum = digits.reduce((acc, el) => acc + +el, sum);
        }

        return regex.test(value) && digits && sum <= PHONE_MAX_SUM;
      }
    };
  }

  addHandlers() {
    const phone = this.inputs.phone;
    phone.addEventListener("input", () => {
      console.log(phone.name, this.validators(phone.value).isPhoneValid());
    });
  }
}

new YandexForm(document.getElementById("myForm"));

const isPhoneValid = value => {
  const regex = /^\+7\(\d\d\d\)\d\d\d-\d\d-\d\d$/;
  const PHONE_MAX_SUM = 30;
  const digits = value.match(/\d/g);
  let sum = 0;
  if (digits) {
    sum = digits.reduce((acc, el) => acc + +el, sum);
  }

  return regex.test(value) && digits && sum <= PHONE_MAX_SUM;
};
// +7(971)111-11-11

const isFioValid = value => {
  return value.trim().split(/\s+/).length === 3;
};

const isEmailValid = value => {
  // RFC 5322 Official Standard
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const DOMAINS = [
    "ya.ru",
    "yandex.ru",
    "yandex.ua",
    "yandex.by",
    "yandex.kz",
    "yandex.com"
  ];

  return regex.test(value) && DOMAINS.includes(value.split("@")[1]);
};

function max_sum_of_numbers(field, maxSum) {
  var nums = field.match(/\d/g),
    sum = 0;

  for (var i = 0; i < nums.length; i++) {
    sum += parseInt(nums[i]);
  }
  console.log(sum);

  return sum <= maxSum;
}

form.elements.fio.addEventListener("input", function() {
  console.log(this.name, isFioValid(this.value));
});
form.elements.email.addEventListener("input", function() {
  console.log(this.name, isEmailValid(this.value));
});
form.elements.phone.addEventListener("input", function() {
  //console.log(this.name, isPhoneValid(this.value));
});

[...form.elements].forEach(element => {
  if (element.tagName === "INPUT") {
    //eventHandler(element);
  }
});

function eventHandler(element) {
  element.addEventListener("input", () => {
    let specialCaseForValidation = true;

    if (element.name === "phone") {
      specialCaseForValidation = max_sum_of_numbers(element.value, 24);
    }

    var isValid =
      !element.validity.valueMissing &&
      regex[element.name].test(element.value) &&
      specialCaseForValidation;

    if (isValid) {
      element.classList.remove("error");
    } else {
      element.classList.add("error");
    }
    console.log(element.name, isValid);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();
});
