// details.js
// Página de detalhes do item selecionado.

import { createElement, showLoader, showError, saveLocal, loadLocal } from "./utils.js";
import { fetchAPI } from "./api.js";

let container = document.getElementById("details-container");

// Recupera os parâmetros da URL
let params = new URLSearchParams(window.location.search);
let id = params.get("id");
let type = params.get("type"); // exemplo: 'armors', 'bosses', 'locations'

loadDetails();

/**
 * Busca detalhes do item pelo tipo e ID
 */
async function loadDetails() {
    if (!id || !type) {
        showError(container, "Dados inválidos.");
        return;
    }

    showLoader(container);

    try {
        let data = await fetchAPI(`/${type}/${id}`);

        if (!data) {
            showError(container, "Item não encontrado.");
            return;
        }

        renderDetails(data);

    } catch (error) {
        showError(container, "Erro ao carregar detalhes.");
    }
}

/**
 * Exibe os detalhes do item na tela
 */
function renderDetails(item) {
    container.innerHTML = "";

    let img = createElement("img", {
        src: item.image || "./assets/no-image.png",
        alt: item.name,
        class: "details-img"
    });

    let infoBox = createElement("div", { class: "details-info" });

    let title = createElement("h2", {
        class: "details-title",
        text: item.name
    });

    let category = createElement("p", {
        class: "details-category",
        text: item.category || "Sem categoria"
    });

    let description = createElement("p", {
        class: "details-description",
        text: item.description || "Sem descrição disponível."
    });

    // caixa de atributos adicionais
    let attributesBox = createAttributes(item);

    // botão favoritar
    let favBtn = createElement("button", {
        class: "favorite-btn",
        text: "Favoritar"
    });

    favBtn.addEventListener("click", () => addToFavorites(item));

    // monta a seção da direita
    infoBox.appendChild(title);
    infoBox.appendChild(category);
    infoBox.appendChild(description);

    if (attributesBox) infoBox.appendChild(attributesBox);

    infoBox.appendChild(favBtn);

    // monta tudo na tela
    container.appendChild(img);
    container.appendChild(infoBox);
}

/**
 * Cria uma caixa com atributos do item
 */
function createAttributes(item) {
    let keys = Object.keys(item);
    let attributes = keys.filter(k =>
        typeof item[k] === "number" ||
        (typeof item[k] === "string" && k !== "name" && k !== "description" && k !== "image" && k !== "id")
    );

    if (attributes.length === 0) return null;

    let box = createElement("div", { class: "attributes-box" });

    let title = createElement("h3", { text: "Atributos" });
    box.appendChild(title);

    for (let key of attributes) {
        let row = createElement("p", {
            text: `${formatKey(key)}: ${item[key]}`
        });
        box.appendChild(row);
    }

    return box;
}

/**
 * Formata chaves para ficarem legíveis
 */
function formatKey(key) {
    return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Salva item nos favoritos
 */
function addToFavorites(item) {
    let favs = loadLocal("favorites") || [];

    let exists = favs.some(f => f.id === item.id);

    if (!exists) {
        favs.push(item);
        saveLocal("favorites", favs);
        alert("Item adicionado aos favoritos!");
    } else {
        alert("Este item já está nos favoritos.");
    }
}
