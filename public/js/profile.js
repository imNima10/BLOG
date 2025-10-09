const avatarInput = document.getElementById('avatar-input');
const profileImg = document.getElementById('profile-img');

avatarInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profileImg.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});