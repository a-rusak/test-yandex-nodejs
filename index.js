var MyForm = (function() {
  "use strict";

  class YandexForm {
    constructor(form) {
      this.form = form;
      this.isValid = false;
      this.fields = ["fio", "email", "phone"];
      this.errorFields = new Set(this.fields);
      this.inProgress = false;

      this.domButton = this.form.elements.submitButton;
      this.domResultContainer = document.getElementById("resultContainer");
    }

    get validators() {
      return {
        phone(value) {
          const regex = /^\+7\(\d\d\d\)\d\d\d-\d\d-\d\d$/;
          const PHONE_MAX_SUM = 30;
          const digits = value.match(/\d/g);
          let sum = 0;
          if (digits) {
            sum = digits.reduce((acc, el) => acc + +el, sum);
          }

          return regex.test(value) && digits && sum <= PHONE_MAX_SUM;
        },
        email(value) {
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
        },
        fio(value) {
          return value.trim().split(/\s+/).length === 3;
        }
      };
    }

    checkValidity() {
      this.isValid = true;

      this.fields.forEach(name => {
        const field = this.form.elements[name];
        const isValid = this.validators[name](field.value);

        if (isValid) {
          this.errorFields.delete(name);
        } else {
          this.errorFields.add(name);
          this.isValid = false;
        }
        field.isValid = isValid;
      });

      return this.isValid;
    }

    setValidity() {
      this.fields.forEach(name => {
        const field = this.form.elements[name];
        if (field.isValid) {
          field.classList.remove("error");
        } else {
          field.classList.add("error");
        }
      });
    }

    setFields(data) {
      this.fields.forEach(name => {
        if (data[name]) {
          const field = this.form.elements[name];
          field.value = data[name];
        }
      });
    }

    setContainer(result) {
      switch (result.status) {
        case "success":
          this.domResultContainer.textContent = "Success";
          break;
        case "error":
          this.domResultContainer.textContent = result.reason;
          break;
        case "progress":
          setTimeout(() => {
            this.response();
          }, result.timeout);
          break;
        default:
          throw new Error("Not valid response from server: " + result);
      }
      this.domResultContainer.className = result.status;
    }

    get response() {
      return async () => {
        let response = await fetch(form.action);
        let status = await response.json();
        this.setContainer(status);

        //this.domButton.removeAttribute("disabled");
      };
    }

    onSubmit(event) {
      event && event.preventDefault();

      const isFormValid = this.checkValidity();
      if (isFormValid) {
        this.response();
        this.domButton.setAttribute("disabled", "disabled");
      }
      this.setValidity();
    }
  }

  ///

  const form = document.getElementById("myForm");
  const yandexForm = new YandexForm(form);
  form.addEventListener("submit", yandexForm.onSubmit.bind(yandexForm));

  ///

  const validate = () => {
    var errorFields = function() {
      yandexForm.checkValidity();
      return [...yandexForm.errorFields];
    };

    return {
      isValid: yandexForm.checkValidity(),
      errorFields: errorFields()
    };
  };

  const getData = () => {
    var obj = {};
    yandexForm.fields.forEach(function(name) {
      var value = yandexForm.form.elements[name].value;
      obj[name] = value;
    });
    return obj;
  };

  const setData = data => {
    return yandexForm.setFields(data);
  };

  const submit = () => {
    yandexForm.onSubmit();
  };

  return {
    validate,
    getData,
    setData,
    submit
  };
})();
