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

            <!-- Handtekening functie -->
            <canvas id="signature-pad-${task.id}" width="300" height="100" style="border:1px solid #000;"></canvas>
            <br>
            <button onclick="clearSignature(${task.id})">Handtekening Wissen</button>
            <button onclick="saveSignature(${task.id})">Opslaan Handtekening</button>
            <br>
            <img id="saved-signature-${task.id}" src="" style="max-width: 300px; display: none;">
        `;
        taskList.appendChild(li);

        // Setup handtekeningfunctie met touch-ondersteuning
        setupSignaturePad(task.id);
    });
});

function updateStatus(taskId) {
    alert("Status bijgewerkt voor opdracht " + taskId);
}

// Handtekeningfunctie met touch-ondersteuning
function setupSignaturePad(taskId) {
    const canvas = document.getElementById("signature-pad-" + taskId);
    const ctx = canvas.getContext("2d");
    let drawing = false;

    function startDrawing(event) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        event.preventDefault();
    }

    function draw(event) {
        if (!drawing) return;
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.stroke();
        event.preventDefault();
    }

    function stopDrawing() {
        drawing = false;
    }

    // Desktop events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    // Touchscreen events
    canvas.addEventListener("touchstart", function(event) {
        const touch = event.touches[0];
        startDrawing({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
    });

    canvas.addEventListener("touchmove", function(event) {
        const touch = event.touches[0];
        draw({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
    });

    canvas.addEventListener("touchend", stopDrawing);
}

function clearSignature(taskId) {
    const canvas = document.getElementById("signature-pad-" + taskId);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature(taskId) {
    const canvas = document.getElementById("signature-pad-" + taskId);
    const savedImage = document.getElementById("saved-signature-" + taskId);
    savedImage.src = canvas.toDataURL("image/png");
    savedImage.style.display = "block";
}
