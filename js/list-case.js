// Menu toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Variáveis globais
let allCases = [];
let currentPage = 1;
const casesPerPage = 10;

// Elementos do DOM
const casesListContainer = document.getElementById('cases-list');
const filterStatus = document.getElementById('filter-status');
const filterDate = document.getElementById('filter-date');
const searchInput = document.getElementById('search-case');
const searchButton = document.getElementById('search-button');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');

// Função para carregar os casos do backend
async function loadCases() {
  try {
    casesListContainer.innerHTML = `
      <div class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> Carregando casos...
      </div>
    `;

    const response = await fetch('/api/cases');
    allCases = await response.json();
    
    renderCases();
    setupPagination();
  } catch (error) {
    console.error('Erro ao carregar casos:', error);
    casesListContainer.innerHTML = `
      <div class="error-message">
        <h3>Erro ao carregar casos</h3>
        <p>Não foi possível carregar a lista de casos. Tente novamente mais tarde.</p>
        <button class="btn btn-retry" id="retry-button">Tentar novamente</button>
      </div>
    `;

    document.getElementById('retry-button').addEventListener('click', loadCases);
  }
}

// Função para renderizar os casos com base nos filtros
function renderCases() {
  const statusValue = filterStatus.value;
  const dateValue = filterDate.value;
  const searchValue = searchInput.value.toLowerCase();

  // Aplicar filtros
  let filteredCases = allCases.filter(caseItem => {
    // Filtro por status
    if (statusValue !== 'all' && caseItem.status !== statusValue) {
      return false;
    }

    // Filtro de busca
    if (searchValue && 
        !caseItem.caseId.toLowerCase().includes(searchValue) && 
        !caseItem.patientName.toLowerCase().includes(searchValue) &&
        !caseItem.description.toLowerCase().includes(searchValue)) {
      return false;
    }

    return true;
  });

  // Ordenação por data
  filteredCases.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateValue === 'recentes' ? dateB - dateA : dateA - dateB;
  });

  // Paginação
  const startIndex = (currentPage - 1) * casesPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + casesPerPage);

  // Renderizar casos
  if (filteredCases.length === 0) {
    casesListContainer.innerHTML = `
      <div class="empty-message">
        <h3>Nenhum caso encontrado</h3>
        <p>Não há casos correspondentes aos critérios de busca.</p>
      </div>
    `;
    return;
  }

  casesListContainer.innerHTML = '';
  paginatedCases.forEach(caseItem => {
    const caseElement = document.createElement('div');
    caseElement.className = 'case-list-item';
    
    // Formata a data para exibição
    const formattedDate = new Date(caseItem.createdAt).toLocaleDateString('pt-BR');
    
    // Determina a classe CSS do status
    let statusClass = 'status-em-andamento';
    if (caseItem.status === 'aberto') statusClass = 'status-aberto';
    else if (caseItem.status === 'pendente') statusClass = 'status-pendente';
    else if (caseItem.status === 'concluído') statusClass = 'status-concluido';
    
    caseElement.innerHTML = `
      <div class="case-list-content" onclick="window.location='view-case.html?id=${caseItem._id}'">
        <div class="case-list-main">
          <span class="case-id">#${caseItem.caseId}</span>
          <h3 class="case-title">${caseItem.patientName} - ${caseItem.incidentDescription.substring(0, 50)}${caseItem.incidentDescription.length > 50 ? '...' : ''}</h3>
          <span class="case-status ${statusClass}">${caseItem.status}</span>
        </div>
        <div class="case-list-details">
          <p class="case-description">${caseItem.description.substring(0, 100)}${caseItem.description.length > 100 ? '...' : ''}</p>
          <div class="case-meta">
            <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
            <span><i class="fas fa-user-md"></i> ${caseItem.user?.name || 'Responsável não definido'}</span>
          </div>
        </div>
      </div>
    `;
    
    casesListContainer.appendChild(caseElement);
  });
}

// Configuração da paginação
function setupPagination() {
  const statusValue = filterStatus.value;
  const searchValue = searchInput.value.toLowerCase();
  
  const filteredCases = allCases.filter(caseItem => {
    if (statusValue !== 'all' && caseItem.status !== statusValue) {
      return false;
    }
    if (searchValue && 
        !caseItem.caseId.toLowerCase().includes(searchValue) && 
        !caseItem.patientName.toLowerCase().includes(searchValue) &&
        !caseItem.description.toLowerCase().includes(searchValue)) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages || totalPages === 0;
  
  currentPageSpan.textContent = currentPage;
}

// Event Listeners
filterStatus.addEventListener('change', () => {
  currentPage = 1;
  renderCases();
  setupPagination();
});

filterDate.addEventListener('change', () => {
  currentPage = 1;
  renderCases();
  setupPagination();
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    currentPage = 1;
    renderCases();
    setupPagination();
  }
});

searchButton.addEventListener('click', () => {
  currentPage = 1;
  renderCases();
  setupPagination();
});

prevPageButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderCases();
    setupPagination();
  }
});

nextPageButton.addEventListener('click', () => {
  const statusValue = filterStatus.value;
  const searchValue = searchInput.value.toLowerCase();
  
  const filteredCases = allCases.filter(caseItem => {
    if (statusValue !== 'all' && caseItem.status !== statusValue) {
      return false;
    }
    if (searchValue && 
        !caseItem.caseId.toLowerCase().includes(searchValue) && 
        !caseItem.patientName.toLowerCase().includes(searchValue) &&
        !caseItem.description.toLowerCase().includes(searchValue)) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  
  if (currentPage < totalPages) {
    currentPage++;
    renderCases();
    setupPagination();
  }
});

// Inicialização
document.addEventListener('DOMContentLoaded', loadCases);
