document.addEventListener("DOMContentLoaded", function() {
    
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const errorMessage = document.getElementById("errorMessage");

    // ottaa tehtävät local storagesta
    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(task => addTaskToDOM(task.text, task.completed));
    }

    // Lisää tehtävän listaan ja tallentaa local Storageen
    function addTask() {
        const taskText = taskInput.value.trim();
        
        // tarkistaa syötteen pituuden
        if (taskText.length < 3 || taskText.length > 50) { 
            errorMessage.textContent = "Syötteen tulee olla 3-50 merkkiä pitkä";  
            taskInput.style.border = "2px solid red";  
            return;  
        }

        // tarkistaa onko täski jo listalla
        const tasks = Array.from(taskList.getElementsByTagName("li")).map(li => li.firstChild.textContent.trim());
        if (tasks.includes(taskText)) {
            errorMessage.textContent = "Tehtävä on jo listalla";  
            taskInput.style.border = "2px solid red";  
            return;
        }

        // tyhjennetään virheilmoitus ja syötteen korostus
        errorMessage.textContent = ""; 
        taskInput.style.border = "";  

        // lisätään tehtävä DOMiin ja tallennetaan local storageen
        addTaskToDOM(taskText, false);
        saveTasks();
        taskInput.value = "";  
    }

    // lisää tehtävän DOMiin
    function addTaskToDOM(taskText, completed) {
        const listItem = document.createElement("li");
        listItem.textContent = taskText;
        if (completed) listItem.classList.add("completed");

        const buttonContainer = document.createElement("div");

        // luodaan ja lisätään "valmis" nappi
        const checkButton = document.createElement("button");
        checkButton.textContent = "✓";
        checkButton.addEventListener("click", function() {
            listItem.classList.toggle("completed"); // merkitään tehtävä valmiiksi
        });

        // luodaan ja lisätään "poista" nappi
        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.addEventListener("click", function() {
            taskList.removeChild(listItem);
        });

        // lisätään napit containeriin ja container listaan
        buttonContainer.appendChild(checkButton);
        buttonContainer.appendChild(removeButton);
        listItem.appendChild(buttonContainer);
        taskList.appendChild(listItem);
    }

    // tallentaa tehtävät local storageen
    function saveTasks() {
        const tasks = Array.from(taskList.getElementsByTagName("li")).map(li => ({
            text: li.firstChild.textContent.trim(),
            completed: li.classList.contains("completed")
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // lisätään tapahtumankuuntelija "lisää" napille
    addTaskButton.addEventListener("click", addTask);

    // ladataan tehtävät sivun latautuessa
    loadTasks();
});