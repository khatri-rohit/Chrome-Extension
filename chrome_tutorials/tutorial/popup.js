document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const greetElement = document.getElementById('greet');

    nameInput.addEventListener('keyup', () => {
        greetElement.textContent = 'Hello ' + nameInput.value;
    });
});