document.addEventListener("DOMContentLoaded", () => {
    const divisionSelect = document.getElementById("division");
    const searchInput = document.getElementById("search");
    const timetableBody = document.getElementById("timetable");
    const countdown = document.getElementById("countdown");

    function fetchTimetable() {
        const division = divisionSelect.value;
        fetch(`api.php?division=${division}`)
            .then(response => response.json())
            .then(data => {
                displayTimetable(data);
                updateCountdown(data);
            });
    }

    function displayTimetable(data) {
        timetableBody.innerHTML = "";
        data.forEach((row) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.day}</td>
                <td>${row.date}</td>
                <td style="color: red">${row.sehri}</td>
                <td style="color: green">${row.iftar}</td>
            `;
            timetableBody.appendChild(tr);
        });
    }

    function updateCountdown(data) {
        const today = new Date().toISOString().split('T')[0];
        const todayData = data.find(d => d.date === today);
        if (!todayData) return countdown.innerHTML = "আজকের তথ্য নেই";

        const now = new Date();
        const sehriTime = new Date(`${today} ${todayData.sehri}`);
        const iftarTime = new Date(`${today} ${todayData.iftar}`);

        const timeDiff = now < sehriTime ? sehriTime - now : iftarTime - now;
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);

        countdown.innerHTML = `পরবর্তী সময়: ${hours} ঘন্টা ${minutes} মিনিট ${seconds} সেকেন্ড`;
    }

    divisionSelect.addEventListener("change", fetchTimetable);
    searchInput.addEventListener("input", () => {
        const filter = searchInput.value;
        const rows = timetableBody.getElementsByTagName("tr");
        for (let row of rows) {
            row.style.display = row.innerHTML.includes(filter) ? "" : "none";
        }
    });

    fetchTimetable();
    setInterval(fetchTimetable, 60000);
});