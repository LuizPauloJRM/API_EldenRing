//Captura de elementos 
//botão pesquisar, campo de pesquisa e área de conteúdo , capturar botao , o evento de click vai startar a pesquisa 
let botaoPesquisar = document.querySelector('button[type="button"]');

//campo de pesquisa pegar o input da area de texto , esse valor capturado ajuda a criar meu endpoint para fazer a requisição , aparecer o objeto pesquisado
let campoPesquisa = document.querySelector('input[name="campo-pesquisa"]');

//área de conteúdo onde os resultados serão exibidos
let conteudo = document.getElementById('conteudo');

// imagem do item
let imagemItem = document.getElementById('imagem-item');

//criei uma funcao para capturar a base da API 
//essa funcao recebe um valor que é o valor do campo de pesquisa
let fetchApiBase = async (value) => {

    //endpoint base da API + valor do campo de pesquisa
    const url = `https://eldenring.fanapis.com/api/armors?name=${value}`;

    // Console so para testar essa caputura
    console.log("URL consultada:", url);

    try {

        // Fazendo o fetch
        let resposta = await fetch(url);
        let dados = await resposta.json();

        // Mostrando os dados pré-formatados
        conteudo.textContent = JSON.stringify(dados, null, 2);

        // Se encontrou um armor, troca a imagem
        if (dados.data && dados.data.length > 0) {
            imagemItem.src = dados.data[0].image;
        }

    } catch (erro) {
        console.log("Erro ao consultar a API:", erro);
    }
};

//teste com o valor "Strike" que é um nome de armor na API
//mantive exatamente como pediu
fetchApiBase("Strike");

//essa funcao vai ser chamada quando o botao de pesquisa for clicado
// Quero pegar os inimigos , itens , locais  e criar uma função para cada um desses endpoints

//adiciona um evento de clique ao botão de pesquisa
//essa pesquisa direciona o valor do campo de pesquisa para a função fetchApiBase
//exemplo para pegar armors https://docs.eldenring.fanapis.com/docs/armors
botaoPesquisar.addEventListener('click', () => {

    let valorDigitado = campoPesquisa.value.trim();

    // validação simples (evita pesquisa vazia)
    if (valorDigitado === "") {
        alert("Digite algo para pesquisar");
        return;
    }

    fetchApiBase(valorDigitado);
});
