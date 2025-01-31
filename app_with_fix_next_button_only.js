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
            <button class="red-button" onclick="navigateTo('${selectedTask.adres}')">📍 Navigeer naar Adres</button>
            <p><strong>Telefoonnummer:</strong> <a href="tel:${selectedTask.contact}" style="color:blue; text-decoration: none;">${selectedTask.contact}</a></p>
            <p><strong>Email:</strong> ${selectedTask.email}</p>
            <p><strong>Werkzaamheden:</strong> ${selectedTask.werkzaamheden}</p>
            <p><strong>Prijs:</strong> ${selectedTask.prijs}</p>
            <p><strong>Gekozen product:</strong> ${selectedTask.product}</p>
            <button class="green-button" onclick="openAfmetingen(${taskId})">Volgende</button>
        </div>
    `;
}

function openAfmetingen(taskId) {
    document.body.innerHTML = `
        <div id="afmetingen-screen">
            <button class="green-button" onclick="openTask(${taskId})">← Terug naar opdracht</button>
            <h2>Afmetingen</h2>
            ${generateAfmetingenInputs(taskId)}
            <button class="green-button" onclick="openNotities(${taskId})">Notities</button>
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
