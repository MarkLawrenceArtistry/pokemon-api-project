export let saveStorage = (string, data) => {
    return localStorage.setItem(`${string}`, JSON.stringify(data));
}

export let loadStorage = (data) => {
    return JSON.parse(localStorage.getItem(`${data}`)) || [];
}

export let createSession = (nameInput) => {
    let session = loadStorage('session');
    let trainers = loadStorage('trainers');

    let userFound = trainers.find(e => e.name === nameInput);
    let currentUser = [userFound.id, userFound.name, userFound.team];
    session = currentUser;

    saveStorage('session', session);

    window.location.href = './dashboard.html';
}

export let checkSession = () => {
    let session = JSON.parse(localStorage.getItem('session'));
    if (!session || session === null) {
        alert('Session does not exist!');
        window.location.href = './index.html';
        return;
    }
}

export let redirectSession = () => {
    let session = JSON.parse(localStorage.getItem('session'));
    if (session) {
        window.location.href = './dashboard.html';
        return;
    }
}