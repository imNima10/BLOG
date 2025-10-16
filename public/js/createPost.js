const coverInput = document.getElementById("cover");
const coverImg = document.getElementById("cover-img");

coverInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            coverImg.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});
