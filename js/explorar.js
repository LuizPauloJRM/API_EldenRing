

// Lista para armazenar todos os itens carregados da API
let todosItens = [];

// Carregar itens automaticamente ao iniciar a página
window.onload = function () {
    carregarItensInicial();
};

// Função para carregar itens automaticamente ao iniciar
async function carregarItensInicial() {
    let gradeItens = document.getElementById('itemsGrid');
    let carregandoSpinner = document.getElementById('loadingSpinner');

    // Exibir spinner de carregamento
    carregandoSpinner.style.display = 'flex';
    gradeItens.innerHTML = '';

    try {
        // Consumir a API do Elden Ring automaticamente
        let resposta = await fetch('https://eldenring.fanapis.com/api/items?limit=20');

        // Validação: Verificar se a resposta da API foi bem-sucedida
        if (!resposta.ok) {
            throw new Error('Erro ao carregar dados da API');
        }

        let dados = await resposta.json();
        todosItens = dados.data || [];

        // Verificar se há itens retornados
        if (todosItens.length === 0) {
            gradeItens.innerHTML = '<div class="col-12 empty-state"><h5>Nenhum item encontrado</h5></div>';
            carregandoSpinner.style.display = 'none';
            return;
        }

        // Renderizar os itens
        exibirItens(todosItens);

    } catch (erro) {
        console.error('Erro ao carregar itens:', erro);
        gradeItens.innerHTML = '<div class="col-12 empty-state"><h5 class="text-danger">Erro ao carregar dados. Tente novamente.</h5></div>';
    } finally {
        carregandoSpinner.style.display = 'none';
    }
}

// Função para navegar até a página de favoritos
function irParaFavoritos() {
    location.href = 'favorites.html';
}

// Função principal para carregar itens da API por categoria
async function carregarItens() {
    let categoria = document.getElementById('categorySelect').value;
    let gradeItens = document.getElementById('itemsGrid');
    let carregandoSpinner = document.getElementById('loadingSpinner');

    // Verificar se uma categoria foi selecionada
    if (!categoria) {
        gradeItens.innerHTML = '<div class="col-12 empty-state"><h5>Selecione uma categoria para começar</h5></div>';
        return;
    }

    carregandoSpinner.style.display = 'flex';
    gradeItens.innerHTML = '';

    try {
        // Consumir API da categoria selecionada
        let resposta = await fetch(`https://eldenring.fanapis.com/api/${categoria}?limit=100`);

        if (!resposta.ok) {
            throw new Error('Erro ao carregar dados da API');
        }

        let dados = await resposta.json();
        todosItens = dados.data || [];

        if (todosItens.length === 0) {
            gradeItens.innerHTML = '<div class="col-12 empty-state"><h5>Nenhum item encontrado nesta categoria</h5></div>';
            carregandoSpinner.style.display = 'none';
            return;
        }

        exibirItens(todosItens);

    } catch (erro) {
        console.error('Erro ao carregar itens:', erro);
        gradeItens.innerHTML = '<div class="col-12 empty-state"><h5 class="text-danger">Erro ao carregar dados. Tente novamente.</h5></div>';
    } finally {
        carregandoSpinner.style.display = 'none';
    }
}

// Função para exibir itens na tela
function exibirItens(lista) {
    let gradeItens = document.getElementById('itemsGrid');
    let favoritos = obterFavoritos();

    gradeItens.innerHTML = '';

    lista.forEach(item => {
        let ehFavorito = favoritos.some(fav => fav.id === item.id);

        let coluna = document.createElement('div');
        coluna.className = 'col-md-6 col-lg-3';

        coluna.innerHTML = `
            <div class="card position-relative">
                ${ehFavorito ? '<span class="favorite-badge">⭐ Favorito</span>' : ''}

                ${item.image
                ? `<img src="${item.image}" class="card-img-top" alt="${item.name}">`
                : `<div class="card-img-top" style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #adb5bd;">Sem imagem</div>`}

                <div class="card-body">
                    <h5 class="card-title">${item.name || 'Sem nome'}</h5>
                    <p class="card-text">${item.description ? item.description.substring(0, 80) + '...' : 'Sem descrição disponível'}</p>

                    <span class="category-badge">${obterNomeCategoria()}</span>

                    <div class="mt-3 d-grid gap-2">
                        <button class="btn btn-primary btn-sm"
                            onclick='verDetalhes(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                            Ver Detalhes
                        </button>

                        ${ehFavorito
                ? `<button class="btn btn-danger btn-sm" onclick='removerFavorito("${item.id}")'>Remover</button>`
                : `<button class="btn btn-outline-warning btn-sm" onclick='adicionarFavorito(${JSON.stringify(item).replace(/'/g, "&apos;")})'>Adicionar aos Favoritos</button>`}
                    </div>
                </div>
            </div>
        `;

        gradeItens.appendChild(coluna);
    });
}

// Função para traduzir categorias
function obterNomeCategoria() {
    let categoria = document.getElementById('categorySelect').value;

    let nomes = {
        'bosses': 'Chefe',
        'weapons': 'Armas',
        'shields': 'Escudos',
        'armors': 'Armaduras',
        'items': 'Itens'
    };

    return nomes[categoria] || 'Item';
}

// Filtrar por busca
function filtrarItens() {
    let termo = document.getElementById('searchInput').value.toLowerCase().trim();

    if (todosItens.length === 0) return;

    let filtrados = todosItens.filter(item => {
        let nome = (item.name || '').toLowerCase();
        let descricao = (item.description || '').toLowerCase();

        return nome.includes(termo) || descricao.includes(termo);
    });

    exibirItens(filtrados);
}

// Obter favoritos do localStorage
function obterFavoritos() {
    let favoritos = localStorage.getItem('eldenRingFavorites');
    return favoritos ? JSON.parse(favoritos) : [];
}

// Adicionar item aos favoritos
function adicionarFavorito(item) {
    let favoritos = obterFavoritos();

    if (!favoritos.some(fav => fav.id === item.id)) {
        favoritos.push(item);
        localStorage.setItem('eldenRingFavorites', JSON.stringify(favoritos));
        alert(`"${item.name}" foi adicionado aos favoritos!`);
        exibirItens(todosItens);
    }
}

// Remover dos favoritos
function removerFavorito(id) {
    let favoritos = obterFavoritos().filter(fav => fav.id !== id);
    localStorage.setItem('eldenRingFavorites', JSON.stringify(favoritos));
    alert('Item removido dos favoritos!');
    exibirItens(todosItens);
}

// Ver detalhes do item
function verDetalhes(item) {
    localStorage.setItem('selectedItem', JSON.stringify(item));
    location.href = 'favorites.html';
}
