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
