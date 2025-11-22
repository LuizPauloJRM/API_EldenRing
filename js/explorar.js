// Array para armazenar todos os itens carregados da API , lista de itens
let todosItens = [];

// Carregar itens automaticamente ao iniciar a página
window.onload = function () {
    carregarItensNoInicio();
};

// Função para carregar itens automaticamente ao iniciar
async function carregarItensNoInicio() {
    let gradeItens = document.getElementById('itemsGrid');
    let carregandoSpinner = document.getElementById('loadingSpinner');

    // Exibir spinner de carregamento
    carregandoSpinner.style.display = 'flex';
    gradeItens.innerHTML = '';

    try {
        // Consumir a API automaticamente
        let resposta = await fetch('https://eldenring.fanapis.com/api/items?limit=20');

        // Validação: verificar se a resposta da API foi bem-sucedida
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

    // Verificar se a categoria foi selecionada
    if (!categoria) {
        gradeItens.innerHTML = '<div class="col-12 empty-state"><h5>Selecione uma categoria para começar</h5></div>';
        return;
    }

    // Exibir spinner
    carregandoSpinner.style.display = 'flex';
    gradeItens.innerHTML = '';

    try {
        // Chamar API com base na categoria selecionada feath é usado para fazer requisições HTTP de categoria
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

// Função para exibir os itens na tela
function exibirItens(itens) {
    let gradeItens = document.getElementById('itemsGrid');
    let favoritos = obterFavoritos();

    gradeItens.innerHTML = '';

    itens.forEach(item => {
        let ehFavorito = favoritos.some(fav => fav.id === item.id);

        let coluna = document.createElement('div');
        coluna.className = 'col-md-6 col-lg-3';

        coluna.innerHTML = `
            <div class="card position-relative">
                ${ehFavorito ? '<span class="favorite-badge">⭐ Favorito</span>' : ''}

                ${item.image
                ? `<img src="${item.image}" class="card-img-top" alt="${item.name}">`
                : '<div class="card-img-top" style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #adb5bd;">Sem imagem</div>'}

                <div class="card-body">
                    <h5 class="card-title">${item.name || 'Sem nome'}</h5>
                    <p class="card-text">${item.description ? item.description.substring(0, 80) + '...' : 'Sem descrição disponível'}</p>
                    
                    <span class="category-badge">${obterNomeCategoria()}</span>

                    <div class="mt-3 d-grid gap-2">

                        <button class="btn btn-primary btn-sm" 
                            onclick='verDetalhes(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                            Ver Detalhes
                        </button>

                        ${ehFavorito ?
                `<button class="btn btn-danger btn-sm" onclick='removerDosFavoritos("${item.id}")'>Remover</button>`
                :
                `<button class="btn btn-outline-warning btn-sm" onclick='adicionarAosFavoritos(${JSON.stringify(item).replace(/'/g, "&apos;")})'>Adicionar aos Favoritos</button>`
            }

                    </div>
                </div>
            </div>
        `;

        gradeItens.appendChild(coluna);
    });
}

// Função para obter o nome da categoria em português
function obterNomeCategoria() {
    let categoria = document.getElementById('categorySelect').value;

    let nomes = {
        'bosses': 'Chefe',
        'weapons': 'Arma',
        'shields': 'Escudo',
        'armors': 'Armadura',
        'items': 'Item'
    };

    return nomes[categoria] || 'Item';
}

// Filtrar itens pelo campo de busca
function filtrarItens() {
    let termoBusca = document.getElementById('searchInput').value.toLowerCase().trim();

    if (todosItens.length === 0) {
        return;
    }

    let itensFiltrados = todosItens.filter(item => {
        let nome = (item.name || '').toLowerCase();
        let descricao = (item.description || '').toLowerCase();
        return nome.includes(termoBusca) || descricao.includes(termoBusca);
    });

    exibirItens(itensFiltrados);
}

// Obter favoritos do localStorage
function obterFavoritos() {
    let favoritos = localStorage.getItem('eldenRingFavorites');
    return favoritos ? JSON.parse(favoritos) : [];
}

// Adicionar item aos favoritos
function adicionarAosFavoritos(item) {
    let favoritos = obterFavoritos();

    if (!favoritos.some(fav => fav.id === item.id)) {
        favoritos.push(item);
        localStorage.setItem('eldenRingFavorites', JSON.stringify(favoritos));
        alert(`"${item.name}" foi adicionado aos favoritos!`);
        exibirItens(todosItens);
    }
}

// Remover item dos favoritos
function removerDosFavoritos(idItem) {
    let favoritos = obterFavoritos();

    favoritos = favoritos.filter(fav => fav.id !== idItem);

    localStorage.setItem('eldenRingFavorites', JSON.stringify(favoritos));
    alert('Item removido dos favoritos!');
    exibirItens(todosItens);
}

// Visualizar detalhes do item
function verDetalhes(item) {
    localStorage.setItem('selectedItem', JSON.stringify(item));
    location.href = 'favoritos.html';
}
