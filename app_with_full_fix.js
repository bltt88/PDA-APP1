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

let storedMeasurements = {};
let storedSignature = {};

function loadTasks() {
    document.body.innerHTML = `
        <div id="app-content">
            <button class="green-button" onclick="logout()">🔒 Uitloggen</button>
            <h2>Opdrachten</h2>
            <ul id="task-list"></ul>
        </div>
    `;

    const taskList = document.getElementById("task-list");

    const tasks = [
        { id: 1, klant: "Muhammed Bolat", adres: "Willem Kloosstraat 27, Almelo", contact: "0621527392", email: "muhammed.bolat@gmail.com", werkzaamheden: "Tapijt leggen", prijs: "€250", product: "TAPIJT SILVERTON TAUPE" },
        { id: 2, klant: "Adem Bolat", adres: "Gerard Doustraat 1, Almelo", contact: "0621264655", email: "bolat_adem@yahoo.com", werkzaamheden: "Vloercoating aanbrengen", prijs: "€180", product: "Vloercoating" },
        { id: 3, klant: "Beyazit Bolat", adres: "Willem Kloosstraat 46, Almelo", contact: "0616415140", email: "beyazit.bolat@gmail.com", werkzaamheden: "Laminaat leggen", prijs: "€320", product: "Laminaat Eiken" }
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
        <div id="task-screen">
            <button class="green-button" onclick="loadTasks()">← Terug naar het beginscherm</button>
            <button class="green-button" onclick="logout()">🔒 Uitloggen</button>
            <h2>Opdracht details</h2>
            <p><strong>Ordernummer:</strong> ${taskId}</p>
            <p><strong>Adres:</strong> ${selectedTask.adres}</p>
            <p><strong>Telefoonnummer:</strong> <a href="tel:${selectedTask.contact}" style="color:blue; text-decoration: none;">${selectedTask.contact}</a></p>
            <p><strong>Email:</strong> ${selectedTask.email}</p>
            <p><strong>Werkzaamheden:</strong> ${selectedTask.werkzaamheden}</p>
            <p><strong>Prijs:</strong> ${selectedTask.prijs}</p>
            <p><strong>Gekozen product:</strong> ${selectedTask.product}</p>
            <button class="red-button" onclick="navigateTo('${selectedTask.adres}')">📍 Navigeer naar Adres</button>
            <button class="green-button" onclick="openAfmetingen(${taskId})">Afmetingen</button>
            <button class="green-button" onclick="openHandtekening(${taskId})">Handtekening klant</button>
            <button class="green-button" onclick="verzendOpdracht(${taskId})">✅ Opdracht afronden</button>
        </div>
    `;
}

function openAfmetingen(taskId) {
    document.body.innerHTML = `
        <div id="afmetingen-screen">
            <button class="green-button" onclick="openTask(${taskId})">← Terug naar opdracht</button>
            <h2>Afmetingen</h2>
            ${generateAfmetingenInputs(taskId)}
        </div>
    `;
}

function generateAfmetingenInputs(taskId) {
    const ruimtes = ["Woonkamer", "Keuken", "WC", "Gang", "Bijkeuken", "Kelder",
        "Slaapkamer 1", "Slaapkamer 2", "Slaapkamer 3", "Slaapkamer 4", "Slaapkamer 5", "Slaapkamer 6", "Slaapkamer 7",
        "Overloop", "Zolder 1", "Zolder 2", "Zolder 3", "Zolder 4", "Zolderoverloop"];

    return ruimtes.map((ruimte, index) => `
        <p><strong>${ruimte}:</strong></p>
        <input type="number" id="length-${taskId}-${index}" placeholder="Lengte" style="width: 80px;" oninput="calculateArea(${taskId}, ${index})">
        <input type="number" id="width-${taskId}-${index}" placeholder="Breedte" style="width: 80px;" oninput="calculateArea(${taskId}, ${index})">
        <input type="text" id="area-${taskId}-${index}" placeholder="m²" style="width: 80px;" readonly>
    `).join("<br>");
}

function calculateArea(taskId, index) {
    const length = document.getElementById(`length-${taskId}-${index}`).value;
    const width = document.getElementById(`width-${taskId}-${index}`).value;
    const areaField = document.getElementById(`area-${taskId}-${index}`);

    if (length && width) {
        areaField.value = (parseFloat(length) * parseFloat(width)).toFixed(2);
    } else {
        areaField.value = "";
    }
}

function verzendOpdracht(taskId) {
    const selectedTask = getTaskById(taskId);
    if (!selectedTask) return;

    const emailBody = `
        Opdracht afgerond voor ${selectedTask.klant}.

        Adres: ${selectedTask.adres}

        Telefoonnummer: ${selectedTask.contact}

        Email: ${selectedTask.email}

        Werkzaamheden: ${selectedTask.werkzaamheden}

        Prijs: ${selectedTask.prijs}

        Gekozen product: ${selectedTask.product}

    `;

    window.location.href = `mailto:${selectedTask.email}?subject=Opdrachtbevestiging&body=${encodeURIComponent(emailBody)}`;
}
