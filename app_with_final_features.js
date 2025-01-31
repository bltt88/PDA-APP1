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

function navigateTo(address) {
    const encodedAddress = encodeURIComponent(address.trim());
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank");
}

function openHandtekening(taskId) {
    document.body.innerHTML = `
        <div id="handtekening-screen">
            <button class="green-button" onclick="openTask(${taskId})">← Terug naar opdracht</button>
            <h2>Handtekening klant</h2>
            <canvas id="signature-pad" width="100%" height="300" style="border:1px solid #000; touch-action: none;"></canvas>
            <br>
            <button class="green-button" onclick="clearSignature()">Handtekening Wissen</button>
            <button class="green-button" onclick="saveSignature()">Handtekening Opslaan</button>
        </div>
    `;

    setupSignaturePad();
}

function setupSignaturePad() {
    const canvas = document.getElementById("signature-pad");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearSignature() {
    setupSignaturePad();
}

function saveSignature() {
    alert("Handtekening opgeslagen!");
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

function getTaskById(taskId) {
    const tasks = [
        { id: 1, klant: "Muhammed Bolat", adres: "Willem Kloosstraat 27, Almelo", contact: "0621527392", email: "muhammed.bolat@gmail.com", werkzaamheden: "Tapijt leggen", prijs: "€250", product: "TAPIJT SILVERTON TAUPE" },
        { id: 2, klant: "Adem Bolat", adres: "Gerard Doustraat 1, Almelo", contact: "0621264655", email: "bolat_adem@yahoo.com", werkzaamheden: "Vloercoating aanbrengen", prijs: "€180", product: "Vloercoating" },
        { id: 3, klant: "Beyazit Bolat", adres: "Willem Kloosstraat 46, Almelo", contact: "0616415140", email: "beyazit.bolat@gmail.com", werkzaamheden: "Laminaat leggen", prijs: "€320", product: "Laminaat Eiken" }
    ];
    return tasks.find(task => task.id === taskId);
}
