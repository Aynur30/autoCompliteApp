const searchInput = document.querySelector('.input');
const autoCompleteList = document.querySelector('.element-list');
const results = document.querySelector('.results');
let timeoutId;
let repos;

const searchRepo = async (repoName) => {
    
        const url = `https://api.github.com/search/repositories?q=${repoName}`;
        const response = await fetch(url);
        const data = await response.json();
        repos = data.items;

};

const handleInput = () => {
    const repoName = searchInput.value.trim();
    if (repoName === "") autoCompleteListClear();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        if (repoName) {
            searchRepo(repoName)
            .then(() => {
                autoCompleteListGenerate();
            });
        }
    }, 300);
};

searchInput.addEventListener('input', handleInput);
document.addEventListener("click", anyClick);

function autoCompleteListClear() {
    while (autoCompleteList.firstChild) {
        autoCompleteList.removeChild(autoCompleteList.firstChild);
    }
}

function autoCompleteListGenerate() {
    autoCompleteListClear();
    const repoName = searchInput.value.trim();
    if (repoName) {
        for (let i = 0; (i < 5); i++) {
            if (repos[i]) {
                let but = document.createElement('button');
                but.innerText = repos[i].name;
                but.classList.add("auto-complete-button");
                but.setAttribute("repName", repos[i].name);
                but.setAttribute("repOwner", repos[i].owner.login);
                but.setAttribute("stars", repos[i].stargazers_count);
                autoCompleteList.appendChild(but);
            }
        }
    }
}

function anyClick(event) {
    let target = event.target;

    if  (!target.classList.contains("auto-complete-button") &&
        (!target.classList.contains("rep-name"))) {
            autoCompleteListClear();
    }

    if (target.classList.contains("rep-name")) {
        const repoName = searchInput.value.trim();
        if (repoName && repos) autoCompleteListGenerate();
    }

    if (target.classList.contains("auto-complete-button")) {
        addRepoToSelected(target);
    }

    if (target.classList.contains("closeButton")) {
        deleteSelectedRepo(target);
    }
}

function addRepoToSelected(button) {
    let rep = document.createElement('div');
    rep.innerText =    `Name: ${button.getAttribute("repName")}
                        Owner: ${button.getAttribute("repOwner")}
                        Stars: ${button.getAttribute("stars")}`;
    rep.classList.add("selected");
    let closeButton = document.createElement('button');
    closeButton.classList.add("closeButton");
    closeButton.textContent = "X";
    rep.appendChild(closeButton);
    results.appendChild(rep);
    searchInput.value = "";
    autoCompleteListClear();
}

function deleteSelectedRepo(target) {
    target.parentNode.remove();
}