/* =========================================================
   API.JS  
   Arquivo responsável por TODAS as requisições
   à API Elden Ring (Fanapis).
   Doc oficial: https://docs.eldenring.fanapis.com/docs
========================================================= */

let BASE_URL = "https://eldenring.fanapis.com/api";


/* =========================================================
   Função genérica para requisições
========================================================= */
let apiFetch = async function (endpoint) {
    try {
        let response = await fetch(`${BASE_URL}/${endpoint}`);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro na API:", error);
        return null;
    }
};


/* =========================================================
   ARMADURAS (Armors)
========================================================= */
let getArmors = async function () {
    let result = await apiFetch("armors?limit=100");
    return result?.data || [];
};

let getArmorByName = async function (name) {
    let result = await apiFetch(`armors?name=${encodeURIComponent(name)}`);
    return result?.data || [];
};


/* =========================================================
   BOSS
========================================================= */
let getBosses = async function () {
    let result = await apiFetch("bosses?limit=100");
    return result?.data || [];
};

let getBossByName = async function (name) {
    let result = await apiFetch(`bosses?name=${encodeURIComponent(name)}`);
    return result?.data || [];
};


/* =========================================================
   LOCAIS (Locations)
========================================================= */
let getLocations = async function () {
    let result = await apiFetch("locations?limit=100");
    return result?.data || [];
};

let getLocationByName = async function (name) {
    let result = await apiFetch(`locations?name=${encodeURIComponent(name)}`);
    return result?.data || [];
};


/* =========================================================
   ITENS (Items)
========================================================= */
let getItems = async function () {
    let result = await apiFetch("items?limit=200");
    return result?.data || [];
};

let getItemByName = async function (name) {
    let result = await apiFetch(`items?name=${encodeURIComponent(name)}`);
    return result?.data || [];
};


/* =========================================================
   CRIATURAS (Creatures)
========================================================= */
let getCreatures = async function () {
    let result = await apiFetch("creatures?limit=200");
    return result?.data || [];
};

let getCreatureByName = async function (name) {
    let result = await apiFetch(`creatures?name=${encodeURIComponent(name)}`);
    return result?.data || [];
};


/* =========================================================
   CLASSES (Classes)
========================================================= */
let getClasses = async function () {
    let result = await apiFetch("classes?limit=50");
    return result?.data || [];
};

let getClassByName = async function (name) {
    let result = await apiFetch(`classes?name=${encodeURIComponent(name)}`);
    return result?.data || [];
};


/* =========================================================
   BUSCA GERAL — usada na página results.html
========================================================= */
let searchAllCategories = async function (query) {
    query = encodeURIComponent(query);

    let armorsP = apiFetch(`armors?name=${query}`);
    let bossesP = apiFetch(`bosses?name=${query}`);
    let itemsP = apiFetch(`items?name=${query}`);
    let creaturesP = apiFetch(`creatures?name=${query}`);
    let locationsP = apiFetch(`locations?name=${query}`);

    let results = await Promise.all([
        armorsP,
        bossesP,
        itemsP,
        creaturesP,
        locationsP
    ]);

    let final = {
        armors: results[0]?.data || [],
        bosses: results[1]?.data || [],
        items: results[2]?.data || [],
        creatures: results[3]?.data || [],
        locations: results[4]?.data || []
    };

    return final;
};


/* =========================================================
   EXPORTAÇÃO GLOBAL
========================================================= */
// As funções ficam automaticamente disponíveis em qualquer página
// que importar este arquivo.
