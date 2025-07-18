import { saveStorage, loadStorage, createSession } from "./util.js";

let trainerNameBtn = document.querySelector('#trainer_name_register');
let trainerNameInput = document.querySelector('#trainer_name');

trainerNameBtn.addEventListener('click', () => {
    let trainerName = trainerNameInput.value;
    let trainers = loadStorage('trainers');

    if (!trainerName) {
        alert('Error! Empty name.');
        return;
    }
    
    let userFound = trainers.find(e => e.name === trainerName);
    if (userFound) {
        alert('User already exists!');
        return;
    }

    let newTrainer = {
        id: Date.now(),
        name: trainerName,
        team: []
    }

    trainers.push(newTrainer);
    saveStorage('trainers', trainers);

    alert('Registered successfully!');

    createSession(trainerName);
});
