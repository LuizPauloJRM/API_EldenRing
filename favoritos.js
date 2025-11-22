// Carregar favoritos ao iniciar a página
window.onload = function () {
    carregarFavoritos();
    verificarItemSelecionado();
};

// Função para navegar de volta para a página de exploração
function irParaExplorar() {
    location.href = 'index.html';
}

// Função para obter favoritos do localStorage
function obterFavoritos() {
    let favoritos = localStorage.getItem('eldenRingFavorites');
    return favoritos ? JSON.parse(favoritos) : [];
}

// Função para carregar e exibir todos os favoritos
function carregarFavoritos() {
    let favoritos = obterFavoritos();
    let gradeFavoritos = document.getElementById('favoritesGrid');
    let contadorFavoritos = document.getElementById('favoritesCount');

    // Atualizar contador
    contadorFavoritos.textContent = favoritos.length;

    // Limpar grade
    gradeFavoritos.innerHTML = '';

    // Verificar se há favoritos
    if (favoritos.length === 0) {
        gradeFavoritos.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <h3>Nenhum favorito ainda</h3>
                    <p>Explore o catálogo e adicione seus itens favoritos</p>
                    <button class="btn btn-primary mt-3" onclick="irParaExplorar()">Começar a Explorar</button>
                </div>
            </div>
        `;
        return;
    }

    // Exibir cada favorito na grade for each vai percorrer o array 
    favoritos.forEach((item, indice) => {
        let col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';

        col.innerHTML = `
            <div class="card">
                ${item.image ? `<img src="${item.image}" class="card-img-top" alt="${item.name}">` :
                '<div class="card-img-top" style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #adb5bd;">Sem imagem</div>'}
                
                <div class="card-body">
                    <h5 class="card-title">${item.name || 'Sem nome'}</h5>
                    <p class="card-text">${item.description ? item.description.substring(0, 80) + '...' : 'Sem descrição disponível'}</p>
                    
                    <div class="mt-3 d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick='exibirDetalhes(${indice})'>
                            Ver Detalhes
                        </button>
                        <button class="btn btn-danger btn-sm" onclick='removerFavorito("${item.id}")'>
                            Remover
                        </button>
                    </div>
                </div>
            </div>
        `;

        gradeFavoritos.appendChild(col);
    });
}

// Função para remover um item dos favoritos
function removerFavorito(idItem) {
    let favoritos = obterFavoritos();
    let itemParaRemover = favoritos.find(fav => fav.id === idItem);

    if (confirm(`Tem certeza que deseja remover "${itemParaRemover.name}" dos favoritos?`)) {
        favoritos = favoritos.filter(fav => fav.id !== idItem);
        localStorage.setItem('eldenRingFavorites', JSON.stringify(favoritos));

        carregarFavoritos();
        alert(' Item removido dos favoritos!');
    }
}

// Função para limpar todos os favoritos
function limparFavoritos() {
    let favoritos = obterFavoritos();

    if (favoritos.length === 0) {
        alert(' Não há favoritos para limpar!');
        return;
    }

    if (confirm(`Tem certeza que deseja remover todos os ${favoritos.length} favoritos?`)) {
        localStorage.removeItem('eldenRingFavorites');
        carregarFavoritos();
        alert(' Todos os favoritos foram removidos!');
    }
}

// Função para exibir detalhes completos em um modal
function exibirDetalhes(indice) {
    let favoritos = obterFavoritos();
    let item = favoritos[indice];

    let modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    let modalTitulo = document.getElementById('modalTitle');
    let modalCorpo = document.getElementById('modalBody');

    modalTitulo.textContent = item.name || 'Sem nome';

    let conteudo = '';

    if (item.image) {
        conteudo += `<img src="${item.image}" class="img-fluid mb-3" alt="${item.name}">`;
    }

    conteudo += `<p><strong>Descrição:</strong> ${item.description || 'Sem descrição disponível'}</p>`;
    conteudo += `<p><strong>Categoria:</strong> ${obterNomeCategoria(item.category)}</p>`;

    if (item.stats) {
        conteudo += '<h5>Estatísticas:</h5><ul>';
        for (let stat in item.stats) {
            conteudo += `<li><strong>${stat}:</strong> ${item.stats[stat]}</li>`;
        }
        conteudo += '</ul>';
    }

    modalCorpo.innerHTML = conteudo;
    modal.show();
}

// Função para obter o nome da categoria em português
function obterNomeCategoria(categoria) {
    let nomes = {
        'bosses': 'Chefe',
        'weapons': 'Arma',
        'shields': 'Escudo',
        'armors': 'Armadura',
        'items': 'Item'
    };
    return nomes[categoria] || 'Item';
}

// Funções adicionais usadas no fim do código
// Função para exibir itens em uma grade (caso venha de outra página)
function exibirItens(itens) {
    let gradeItens = document.getElementById('itemsGrid');
    gradeItens.innerHTML = '';

    if (itens.length === 0) {
        gradeItens.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <h5>Nenhum item encontrado para a categoria selecionada.</h5>
                </div>
            </div>
        `;
        return;
    }

    itens.forEach(item => {
        let col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';

        col.innerHTML = `
            <div class="card">
                ${item.image ? `<img src="${item.image}" class="card-img-top" alt="${item.name}">` :
                '<div class="card-img-top" style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #adb5bd;">Sem imagem</div>'}
                
                <div class="card-body">
                    <h5 class="card-title">${item.name || 'Sem nome'}</h5>
                    <p class="card-text">${item.description ? item.description.substring(0, 80) + '...' : 'Sem descrição disponível'}</p>
                    
                    <span class="category-badge">${obterNomeCategoria()}</span>

                    <div class="mt-3 d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick='verDetalhes(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                            Ver Detalhes
                        </button>
                        <button class="btn btn-outline-warning btn-sm" onclick='adicionarFavorito(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                            Adicionar aos Favoritos
                        </button>
                    </div>
                </div>
            </div>
        `;

        gradeItens.appendChild(col);
    });
}
