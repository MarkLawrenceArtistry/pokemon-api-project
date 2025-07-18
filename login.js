import { saveStorage, loadStorage, createSession } from "./util.js";

let trainerNameBtn = document.querySelector('#trainer_name_login');
let trainerNameInput = document.querySelector('#trainer_name');

trainerNameBtn.addEventListener('click', () => {
    let trainerName = trainerNameInput.value;
    let trainers = loadStorage('trainers');

    if (!trainerName) {
        alert('Error! Empty name.')
        return;
    }

    let userFound = trainers.find(e => e.name === trainerName);
    if (!userFound) {
        alert('User does not exist!');
        return;
    }

    alert('Logged in successfully!');

    createSession(trainerName);
})

trainerNameInput.addEventListener('keydown', (event) => {
    if(event.key === "Enter") {
        trainerNameBtn.click();
    }
})