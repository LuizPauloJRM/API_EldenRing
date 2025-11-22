// utils.js
// Arquivo com funções utilitárias reutilizáveis em várias páginas.

/**
 * Função genérica para criar elementos HTML.
 * Ajuda a evitar código repetido.
 * 
 * @param {string} tag - Tag HTML a ser criada (ex: 'div', 'img')
 * @param {object} attributes - Objeto com atributos para aplicar no elemento
 * @returns {HTMLElement}
 */
export function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);

    for (const key in attributes) {
        if (key === "text") {
            element.textContent = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }

    return element;
}

/**
 * Exibe um loader genérico enquanto a API carrega dados.
 */
export function showLoader(container) {
    container.innerHTML = `
        <div class="loader">Carregando...</div>
    `;
}

/**
 * Remove o loader de qualquer container.
 */
export function hideLoader(container) {
    container.innerHTML = "";
}

/**
 * Exibe mensagens de erro padronizadas na tela.
 *
 * @param {HTMLElement} container
 * @param {string} message
 */
export function showError(container, message = "Ocorreu um erro, tente novamente.") {
    container.innerHTML = `
        <div class="error-box">
            <p>${message}</p>
        </div>
    `;
}

/**
 * Salva dados no localStorage como JSON.
 */
export function saveLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Lê dados do localStorage e já converte de volta para objeto.
 */
export function loadLocal(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

/**
 * Valida campos de formulário.
 *
 * @param {string} value - Valor do input
 * @param {number} min - Tamanho mínimo
 * @returns {boolean}
 */
export function validateMinLength(value, min) {
    return value.trim().length >= min;
}

/**
 * Valida se o valor não está vazio.
 */
export function validateRequired(value) {
    return value.trim() !== "";
}

/**
 * Valida números (por exemplo, IDs ou buscas numéricas)
 */
export function validateNumber(value) {
    return !isNaN(value) && value.trim() !== "";
}
