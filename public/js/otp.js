document.addEventListener("DOMContentLoaded", () => {
  const inputs = Array.from(document.querySelectorAll(".otp-inputs input"));
  
  const isRTL = getComputedStyle(inputs[0]).direction === "rtl";
  const otpInputs = isRTL ? inputs.reverse() : inputs;

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "" && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
});

const form = document.querySelector('form');
const inputs = document.querySelectorAll('.otp-inputs input');
const otpField = document.getElementById('otp');

form.addEventListener('submit', (e) => {
  const otpArray = Array.from(inputs).map(i => i.value);
  const isRTL = getComputedStyle(document.body).direction === 'rtl';
  const otpValue = isRTL ? otpArray.reverse().join('') : otpArray.join('');
  otpField.value = otpValue;
});
