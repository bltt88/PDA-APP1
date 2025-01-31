document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("loggedIn") === "true") {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("app-content").style.display = "block";
        loadTasks();
    } else {
        document.getElementById("login-screen").style.display = "block";
        document.getElementById("app-content").style.display = "none";
    }
});

function checkLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const correctUsername = "admin";
    const correctPassword = "wachtwoord123";

    if (username === correctUsername && password === correctPassword) {
        localStorage.setItem("loggedIn", "true");
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("app-content").style.display = "block";
        loadTasks();
    } else {
        document.getElementById("login-error").innerText = "Ongeldige login!";
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    location.reload();
}

function loadTasks() {
    const taskList = document.getElementById("task-list");

    const tasks = [
        { id: 1, klant: "Jansen BV", adres: "Fazantstraat 22, Borne, Nederland", contact: "Jan de Vries", prijs: "€250", artikel: "TAPIJT SILVERTON TAUPE", werkzaamheden: "Leggen van tapijt", afmetingen: "400cm x 300cm" },
        { id: 2, klant: "Bakkerij De Groot", adres: "Hooi-esch 26, Delden, Nederland", contact: "Petra Bakker", prijs: "€180", artikel: "Vloercoating", werkzaamheden: "Aanbrengen van coating", afmetingen: "500cm x 400cm" },
        { id: 3, klant: "Tech Solutions", adres: "Spanbeddestraat 41, Haaksbergen, Nederland", contact: "Mark Jansen", prijs: "€320", artikel: "Laminaat Eiken", werkzaamheden: "Leggen van laminaat", afmetingen: "600cm x 350cm" }
    ];

    taskList.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h2>${task.klant}</h2>
            <p><strong>Adres:</strong> ${task.adres}</p>
            <button class="green-button" onclick="openTask(${task.id})">Bekijk Opdracht</button>
        `;
        taskList.appendChild(li);
    });
}

function openTask(taskId) {
    const selectedTask = getTaskById(taskId);
    if (!selectedTask) return;

    document.body.innerHTML = `
        <button class="green-button" onclick="loadTasks()">← Terug</button>
        <button class="green-button" onclick="logout()">🔒 Uitloggen</button>
        <h2>Opdracht details</h2>
        <p><strong>Ordernummer:</strong> ${taskId}</p>
        <p><strong>Adres:</strong> ${selectedTask.adres}</p>
        <button class="red-button" onclick="navigateTo('${selectedTask.adres}')">📍 Navigeer naar Adres</button>
        <p><strong>Contactpersoon:</strong> ${selectedTask.contact}</p>
        <p><strong>Prijs:</strong> ${selectedTask.prijs}</p>
        <p><strong>Artikel:</strong> ${selectedTask.artikel}</p>
        <p><strong>Werkzaamheden:</strong> ${selectedTask.werkzaamheden}</p>
        <button class="green-button" onclick="openAfmetingen(${taskId})">Afmetingen</button>
        <button class="green-button" onclick="openHandtekening(${taskId})">Handtekening klant</button>
    `;
}

function navigateTo(address) {
    const encodedAddress = encodeURIComponent(address.trim());
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank");
}

function openAfmetingen(taskId) {
    document.body.innerHTML = `
        <button class="green-button" onclick="openTask(${taskId})">← Terug</button>
        <h2>Afmetingen</h2>
        ${generateAfmetingenInputs()}
    `;
}

function generateAfmetingenInputs() {
    const ruimtes = ["Woonkamer", "Keuken", "WC", "Gang", "Bijkeuken", "Kelder",
        "Slaapkamer 1", "Slaapkamer 2", "Slaapkamer 3", "Slaapkamer 4", "Slaapkamer 5", "Slaapkamer 6", "Slaapkamer 7",
        "Overloop", "Zolder 1", "Zolder 2", "Zolder 3", "Zolder 4", "Zolderoverloop"];

    return ruimtes.map(ruimte => `
        <p><strong>${ruimte}:</strong></p>
        <input type="text" placeholder="Lengte (m)" style="width: 80px;">
        <input type="text" placeholder="Breedte (m)" style="width: 80px;">
    `).join("<br>");
}

function openHandtekening(taskId) {
    document.body.innerHTML = `
        <button class="green-button" onclick="openTask(${taskId})">← Terug</button>
        <h2>Handtekening klant</h2>
        <canvas id="signature-pad" width="100%" height="300" style="border:1px solid #000;"></canvas>
        <br>
        <button class="green-button" onclick="clearSignature()">Handtekening Wissen</button>
        <button class="green-button" onclick="saveSignature()">Handtekening Opslaan</button>
    `;

    setupSignaturePad();
}

function getTaskById(taskId) {
    const tasks = [
        { id: 1, klant: "Jansen BV", adres: "Fazantstraat 22, Borne, Nederland", contact: "Jan de Vries", prijs: "€250", artikel: "TAPIJT SILVERTON TAUPE", werkzaamheden: "Leggen van tapijt", afmetingen: "400cm x 300cm" },
        { id: 2, klant: "Bakkerij De Groot", adres: "Hooi-esch 26, Delden, Nederland", contact: "Petra Bakker", prijs: "€180", artikel: "Vloercoating", werkzaamheden: "Aanbrengen van coating", afmetingen: "500cm x 400cm" },
        { id: 3, klant: "Tech Solutions", adres: "Spanbeddestraat 41, Haaksbergen, Nederland", contact: "Mark Jansen", prijs: "€320", artikel: "Laminaat Eiken", werkzaamheden: "Leggen van laminaat", afmetingen: "600cm x 350cm" }
    ];
    return tasks.find(task => task.id === taskId);
}

function clearSignature() {
    const canvas = document.getElementById("signature-pad");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
    alert("Handtekening opgeslagen!");
}
