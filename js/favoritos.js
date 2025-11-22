// Carregar favoritos ao iniciar a página
window.onload = function () {
    loadFavorites();
    checkSelectedItem();
};

// Função para navegar de volta para a página de exploração
function goToExplore() {
    location.href = 'index.html';
}

// Função para obter favoritos do localStorage
function getFavorites() {
    let favorites = localStorage.getItem('eldenRingFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Função para carregar e exibir todos os favoritos
function loadFavorites() {
    let favorites = getFavorites();
    let favoritesGrid = document.getElementById('favoritesGrid');
    let favoritesCount = document.getElementById('favoritesCount');

    // Atualizar contador
    favoritesCount.textContent = favorites.length;

    // Limpar grade
    favoritesGrid.innerHTML = '';

    // Verificar se há favoritos
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <h3>Nenhum favorito ainda</h3>
                    <p>Explore o catálogo e adicione seus itens favoritos</p>
                    <button class="btn btn-primary mt-3" onclick="goToExplore()">Começar a Explorar</button>
                </div>
            </div>
        `;
        return;
    }

    // Exibir cada favorito
    favorites.forEach((item, index) => {
        let col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';

        col.innerHTML = `
            <div class="card">
                ${item.image
                ? `<img src="${item.image}" class="card-img-top" alt="${item.name}">`
                : '<div class="card-img-top" style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #adb5bd;">Sem imagem</div>'
            }
                <div class="card-body">
                    <h5 class="card-title">${item.name || 'Sem nome'}</h5>
                    <p class="card-text">${item.description ? item.description.substring(0, 80) + '...' : 'Sem descrição disponível'}</p>
                    <div class="mt-3 d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick='showDetails(${index})'>Ver Detalhes</button>
                        <button class="btn btn-danger btn-sm" onclick='removeFromFavorites("${item.id}")'>Remover</button>
                    </div>
                </div>
            </div>
        `;

        favoritesGrid.appendChild(col);
    });
}

// Função para remover um item dos favoritos
function removeFromFavorites(itemId) {
    let favorites = getFavorites();

    let itemToRemove = favorites.find(fav => fav.id === itemId);

    if (confirm(`Tem certeza que deseja remover "${itemToRemove.name}" dos favoritos?`)) {
        favorites = favorites.filter(fav => fav.id !== itemId);
        localStorage.setItem('eldenRingFavorites', JSON.stringify(favorites));
        loadFavorites();
        alert('✅ Item removido dos favoritos!');
    }
}

// Função para limpar todos os favoritos
function clearAllFavorites() {
    let favorites = getFavorites();

    if (favorites.length === 0) {
        alert('⚠️ Não há favoritos para limpar!');
        return;
    }

    if (confirm(`Tem certeza que deseja remover todos os ${favorites.length} favoritos?`)) {
        localStorage.removeItem('eldenRingFavorites');
        loadFavorites();
        alert('✅ Todos os favoritos foram removidos!');
    }
}

// Função para exibir detalhes completos em um modal
function showDetails(index) {
    let favorites = getFavorites();
    let item = favorites[index];

    let modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    let modalTitle = document.getElementById('modalTitle');
    let modalBody = document.getElementById('modalBody');

    modalTitle.textContent = item.name || 'Sem nome';

    let content = "";

    if (item.image) {
        content += `<img src="${item.image}" class="img-fluid mb-3" alt="${item.name}">`;
    }

    content += `<p><strong>Descrição:</strong> ${item.description || 'Sem descrição disponível'}</p>`;
    content += `<p><strong>Categoria:</strong> ${getCategoryName(item.category)}</p>`;

    if (item.stats) {
        content += `<h5>Estatísticas:</h5><ul>`;
        for (let stat in item.stats) {
            content += `<li><strong>${stat}:</strong> ${item.stats[stat]}</li>`;
        }
        content += `</ul>`;
    }

    modalBody.innerHTML = content;
    modal.show();
}

// Função para obter o nome da categoria em português
function getCategoryName(category) {
    let names = {
        'bosses': 'Chefe',
        'weapons': 'Arma',
        'shields': 'Escudo',
        'armors': 'Armadura',
        'items': 'Item'
    };
    return names[category] || 'Item';
}
