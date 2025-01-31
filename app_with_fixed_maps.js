document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("task-list");

    // Voorbeeld opdrachten (kan later uit een database komen)
    const tasks = [
        { id: 1, klant: "Jansen BV", adres: "Fazantstraat 22, Borne, Nederland", contact: "Jan de Vries", prijs: "€250", artikel: "TAPIJT SILVERTON TAUPE", werkzaamheden: "Leggen van tapijt", afmetingen: "400cm x 300cm" },
        { id: 2, klant: "Bakkerij De Groot", adres: "Hooi-esch 26, Delden, Nederland", contact: "Petra Bakker", prijs: "€180", artikel: "Vloercoating", werkzaamheden: "Aanbrengen van coating", afmetingen: "500cm x 400cm" },
        { id: 3, klant: "Tech Solutions", adres: "Spanbeddestraat 41, Haaksbergen, Nederland", contact: "Mark Jansen", prijs: "€320", artikel: "Laminaat Eiken", werkzaamheden: "Leggen van laminaat", afmetingen: "600cm x 350cm" }
    ];

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h2>${task.klant}</h2>
            <p><strong>Adres:</strong> ${task.adres}</p>
            <button onclick="openTask(${task.id})">Bekijk Opdracht</button>
        `;
        taskList.appendChild(li);
    });
});

function openTask(taskId) {
    const selectedTask = getTaskById(taskId);
    if (!selectedTask) return;

    document.body.innerHTML = `
        <button onclick="location.reload()">← Terug</button>
        <h2>Opdracht details</h2>
        <p><strong>Ordernummer:</strong> ${taskId}</p>
        <p><strong>Adres:</strong> ${selectedTask.adres}</p>
        <button onclick="navigateTo('${selectedTask.adres}')">📍 Navigeren naar Adres</button>
        <p><strong>Contactpersoon:</strong> ${selectedTask.contact}</p>
        <p><strong>Prijs:</strong> ${selectedTask.prijs}</p>
        <p><strong>Artikel:</strong> ${selectedTask.artikel}</p>
        <p><strong>Werkzaamheden:</strong> ${selectedTask.werkzaamheden}</p>
        <p><strong>Afmetingen:</strong> ${selectedTask.afmetingen}</p>
        
        <!-- Handtekening functie -->
        <h3>Handtekening klant</h3>
        <canvas id="signature-pad" width="300" height="100" style="border:1px solid #000;"></canvas>
        <br>
        <button onclick="clearSignature()">Handtekening Wissen</button>
        <button onclick="saveSignature()">Opslaan Handtekening</button>
        <br>
        <img id="saved-signature" src="" style="max-width: 300px; display: none;">

        <br><br>
        <button onclick="generatePDF(${taskId})">Opdracht Afronden & PDF Versturen</button>
    `;

    setupSignaturePad();
}

function navigateTo(address) {
    const encodedAddress = encodeURIComponent(address.trim());
    const googleMapsURL = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsURL, "_blank");
}

function getTaskById(taskId) {
    const tasks = [
        { id: 1, klant: "Jansen BV", adres: "Fazantstraat 22, Borne, Nederland", contact: "Jan de Vries", prijs: "€250", artikel: "TAPIJT SILVERTON TAUPE", werkzaamheden: "Leggen van tapijt", afmetingen: "400cm x 300cm" },
        { id: 2, klant: "Bakkerij De Groot", adres: "Hooi-esch 26, Delden, Nederland", contact: "Petra Bakker", prijs: "€180", artikel: "Vloercoating", werkzaamheden: "Aanbrengen van coating", afmetingen: "500cm x 400cm" },
        { id: 3, klant: "Tech Solutions", adres: "Spanbeddestraat 41, Haaksbergen, Nederland", contact: "Mark Jansen", prijs: "€320", artikel: "Laminaat Eiken", werkzaamheden: "Leggen van laminaat", afmetingen: "600cm x 350cm" }
    ];
    return tasks.find(task => task.id === taskId);
}

// Handtekeningfunctie met touch-ondersteuning
function setupSignaturePad() {
    const canvas = document.getElementById("signature-pad");
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

function clearSignature() {
    const canvas = document.getElementById("signature-pad");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
    const canvas = document.getElementById("signature-pad");
    const savedImage = document.getElementById("saved-signature");
    savedImage.src = canvas.toDataURL("image/png");
    savedImage.style.display = "block";
}

function generatePDF(taskId) {
    const task = getTaskById(taskId);
    if (!task) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Opdrachtbevestiging", 20, 20);
    doc.text(`Ordernummer: ${taskId}`, 20, 30);
    doc.text(`Klant: ${task.klant}`, 20, 40);
    doc.text(`Adres: ${task.adres}`, 20, 50);
    doc.text(`Contactpersoon: ${task.contact}`, 20, 60);
    doc.text(`Prijs: ${task.prijs}`, 20, 70);
    doc.text(`Artikel: ${task.artikel}`, 20, 80);
    doc.text(`Werkzaamheden: ${task.werkzaamheden}`, 20, 90);
    doc.text(`Afmetingen: ${task.afmetingen}`, 20, 100);

    const signatureImage = document.getElementById("saved-signature").src;
    if (signatureImage) {
        doc.addImage(signatureImage, "PNG", 20, 110, 100, 50);
    }

    doc.save(`Opdracht_${taskId}.pdf`);
    alert("PDF gegenereerd en gedownload!");
}
