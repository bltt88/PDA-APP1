document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("task-list");

    // Voorbeeld opdrachten (kan later uit een database komen)
    const tasks = [
        { id: 1, klant: "Jansen BV", adres: "Fazantstraat 22, Borne", status: "Open" },
        { id: 2, klant: "Bakkerij De Groot", adres: "Hooi-esch 26, Delden", status: "Onderweg" },
        { id: 3, klant: "Tech Solutions", adres: "Spanbeddestraat 41, Haaksbergen", status: "Afgerond" }
    ];

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h2>${task.klant}</h2>
            <p><strong>Adres:</strong> ${task.adres}</p>
            <p><strong>Status:</strong> ${task.status}</p>
            <button onclick="updateStatus(${task.id})">Wijzig Status</button>
            <br><br>
            <input type="file" accept="image/*" id="upload-${task.id}" onchange="previewImage(event, ${task.id})">
            <br>
            <img id="preview-${task.id}" src="" style="max-width: 100px; display: none;">
        `;
        taskList.appendChild(li);
    });
});

function updateStatus(taskId) {
    alert("Status bijgewerkt voor opdracht " + taskId);
}

function previewImage(event, taskId) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const img = document.getElementById("preview-" + taskId);
        img.src = reader.result;
        img.style.display = "block";
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}
