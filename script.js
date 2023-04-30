// Get DOM elements
const wrapper = document.querySelector(".wrapper"); // Get wrapper element
const searchInput = wrapper.querySelector("input"); // Get input element within wrapper element
const volume = wrapper.querySelector(".word i"); // Get volume icon element
const infoText = wrapper.querySelector(".info-text"); // Get info text element
const synonyms = wrapper.querySelector(".synonyms .list"); // Get synonyms list element
const removeIcon = wrapper.querySelector(".search span"); // Get remove icon element
let audio; // Audio object for pronunciation

// Process the result data from the API
function data(result, word){
    if(result.title){ // If the API returns an error message
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }else{ // If the API returns data
        wrapper.classList.add("active"); // Show the word card
        let definitions = result[0].meanings[0].definitions[0];
        let phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
        // Fill in the word card with data
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
        audio = new Audio(result[0].phonetics[0].audio); // Create Audio object for pronunciation

        // If there are synonyms, show them in the word card
        if(definitions.synonyms[0] == undefined){
            synonyms.parentElement.style.display = "none";
        }else{
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                // The last tag should not have a comma
                tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }
    }
}

// Search for a word using the API
function search(word){
    fetchApi(word);
    searchInput.value = word;
}

// Call the API and handle the result
function fetchApi(word){
    wrapper.classList.remove("active"); // Hide the word card
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url)
        .then(response => response.json())
        .then(result => data(result, word))
        .catch(() =>{
            // If there is an error, show a message
            infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
        });
}

// Listen for Enter key press on search input
searchInput.addEventListener("keyup", e =>{
    let word = e.target.value.replace(/\s+/g, ' '); // Remove extra spaces
    if(e.key == "Enter" && word){ // If Enter key is pressed and there is a word to search
        fetchApi(word);
    }
});

// Listen for click on volume icon to play pronunciation audio
volume.addEventListener("click", ()=>{
    volume.style.color = "#4D59FB";
    audio.play();
    setTimeout(() =>{
        volume.style.color = "#999";
    }, 800); // Change volume icon color
});

// Listen for click on remove icon to clear the search input and reset the word card
removeIcon.addEventListener("click", ()=>{
    searchInput.value = ""; // Clear the search input
    searchInput.focus(); // Focus on the search input
    wrapper.classList.remove("active"); // Hide the word card
    infoText.style.color = "#9A9A9A"; // Set the color of the info text to gray
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc."; // Set the text of the info text to a default message
    });