"use strict";

const form = document.getElementById("myForm");
const email = form.elements.email;

const regex = {
  fio: /^$|^[a-zA-Za-яА-ЯёЁ]+ [a-zA-Za-яА-ЯёЁ]+ [a-zA-Za-яА-ЯёЁ]+?$/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((ya.ru)|(yandex.(ru|ua|by|kz|com)))$/,
  phone: /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/
};

//const emailRegex = "aa@bb.ru";
//email.setAttribute("pattern", emailRegex);
//email.pattern = emailRegex;

function max_sum_of_numbers(field, maxSum) {
  var nums = field.match(/\d/g),
    sum = 0;

  for (var i = 0; i < nums.length; i++) {
    sum += parseInt(nums[i]);
  }

  return sum <= maxSum;
}

[...form.elements].forEach(element => {
  if (element.tagName === "INPUT") {
    eventHandler(element);
  }
});

function eventHandler(element) {
  element.addEventListener("input", () => {
    var isValid = !element.validity.valueMissing && regex[element.name].test(element.value);

    if (isValid) {
      element.classList.remove("error");
    } else {
      element.classList.add("error");
    }
      console.log(
      "valid: ", element.validity.valid,
      "valueMissing: ", element.validity.valueMissing,
      "regex: ", regex[element.name].test(element.value)
    );
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  console.dir(email);
  if (!email.validity.valid || email.validity.valueMissing) {
    email.classList.add("error");
  }
});
