// results.js
import { apiGet } from "./api.js";
import { createElement, showLoader, showError } from "./utils.js";

let container = document.getElementById("results");
let title = document.getElementById("results-title");

// Captura o termo da pesquisa
let params = new URLSearchParams(window.location.search);
let query = params.get("q");

let init = () => {
    if (!query) {
        showError(container, "Nenhum termo de busca recebido.");
        return;
    }

    title.textContent = `Resultados para: "${query}"`;
    loadWeapons(query);
};

let loadWeapons = async (term) => {
    showLoader(container);

    let url = `https://eldenring.fanapis.com/api/weapons?name=${term}`;

    try {
        let response = await apiGet(url);

        if (!response || !response.data || response.data.length === 0) {
            showError(container, "Nenhuma arma encontrada.");
            return;
        }

        renderWeapons(response.data);

    } catch (error) {
        console.error(error);
        showError(container, "Erro ao buscar armas.");
    }
};

let renderWeapons = (weapons) => {
    container.innerHTML = "";

    weapons.forEach(item => {
        let card = createElement("div", { class: "result-card" });

        let img = createElement("img", {
            src: item.image || "img/no-image.png",
            alt: item.name
        });

        let name = createElement("h3", { text: item.name });

        let category = createElement("p", {
            text: `Categoria: ${item.category || "N/D"}`
        });

        let attack = createElement("p", {
            text: `Dano: ${item.attack ? item.attack[0].amount : "N/A"}`
        });

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(category);
        card.appendChild(attack);

        container.appendChild(card);
    });
};

init();
