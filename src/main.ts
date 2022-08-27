import { Cell } from "./cell";

const main = document.getElementById("main");
const settingsMenu = document.getElementById("settings-menu");
const settingsBtn = document.getElementById("settings-btn");

settingsBtn!.addEventListener('click', e => {
    toggleSettingsMenu();
});

const closeSettings = document.getElementById("close-settings");


closeSettings!.addEventListener('click', e => {
    toggleSettingsMenu();
});

function toggleSettingsMenu() {
    if (settingsMenu!.style.width == "0px") {
        settingsMenu!.style.width = "500px";
        main!.style.marginLeft = "750px";
    } else {
        settingsMenu!.style.width = "0";
        main!.style.marginLeft = "5em";
    }
}



function clickHandle(text : string, code : string, pseudo : string) {
    const tabcontent = document.getElementById("tabcontent");
    const tabcontentInfoText = document.getElementById("tabcontent-info-text");
    const tabcontentCodeText = document.getElementById("tabcontent-code-text");
    const tabcontentPseudoText = document.getElementById("tabcontent-pseudo-text");

    loadFile("../info_data/" + text + ".txt").then(function(result) {
        tabcontentInfoText!.innerHTML = result;
    });

    loadFile("../info_data/" + code + ".txt").then(function(result) {
        tabcontentCodeText!.innerHTML = result;
    });

    loadFile("../info_data/" + pseudo + ".txt").then(function(result) {
        tabcontentPseudoText!.innerHTML = result;
    });


}

clickHandle('depth_first_search_info', 'depth_first_search_code', 'depth_first_search_pseudo');


function loadFile(url : string) {
    return fetch(url)
    .then( r => r.text() )
    .then( t => {
        return t;
    });
}
