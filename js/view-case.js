document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  
    // Obter ID do caso da URL
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('id');
  
    if (!caseId) {
      alert('Caso não encontrado');
      window.location.href = 'list-case.html';
      return;
    }
  
    // Elementos do modal
    const evidenceModal = document.getElementById('evidence-modal');
    const reportModal = document.getElementById('report-modal');
    const closeButtons = document.querySelectorAll('.close');
  
    // Fechar modais
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        evidenceModal.style.display = 'none';
        reportModal.style.display = 'none';
      });
    });
  
    // Carregar dados do caso
    async function loadCaseDetails() {
      try {
        const response = await fetch(`/api/cases/${caseId}`);
        const caseData = await response.json();
        
        if (!response.ok) {
          throw new Error('Caso não encontrado');
        }
  
        // Preencher os dados do caso
        document.getElementById('case-title').textContent = `${caseData.patientName} - ${caseData.incidentDescription.substring(0, 50)}${caseData.incidentDescription.length > 50 ? '...' : ''}`;
        document.getElementById('case-id').textContent = `#${caseData.caseId}`;
        document.getElementById('case-status').textContent = caseData.status;
        document.getElementById('case-status').className = `case-status status-${caseData.status.replace(' ', '-')}`;
        document.getElementById('case-description').textContent = caseData.description;
        document.getElementById('case-date').textContent = new Date(caseData.createdAt).toLocaleDateString('pt-BR');
        document.getElementById('case-expert').textContent = caseData.user?.name || 'Não informado';
        
        // Informações do paciente
        document.getElementById('patient-name').textContent = caseData.patientName;
        document.getElementById('patient-dob').textContent = new Date(caseData.patientAge).toLocaleDateString('pt-BR');
        document.getElementById('patient-gender').textContent = caseData.patientGender;
        document.getElementById('patient-id').textContent = caseData.patientID;
        document.getElementById('patient-contact').textContent = caseData.patientContact || 'Não informado';
        
        // Informações do incidente
        document.getElementById('incident-date').textContent = new Date(caseData.incidentDate).toLocaleString('pt-BR');
        document.getElementById('incident-location').textContent = caseData.incidentLocation;
        document.getElementById('incident-description').textContent = caseData.incidentDescription;
        document.getElementById('incident-weapon').textContent = caseData.incidentWeapon || 'Não informado';
  
        // Carregar evidências
        loadEvidences();
  
      } catch (error) {
        console.error('Erro ao carregar caso:', error);
        alert('Erro ao carregar detalhes do caso');
        window.location.href = 'list-case.html';
      }
    }
  
    // Carregar evidências
    async function loadEvidences() {
      try {
        const response = await fetch(`/api/cases/${caseId}/evidences`);
        const evidences = await response.json();
        
        const evidenceList = document.getElementById('evidence-list');
        const emptyMessage = document.getElementById('empty-evidence-message');
        
        if (evidences.length === 0) {
          emptyMessage.style.display = 'block';
          evidenceList.innerHTML = '';
          return;
        }
        
        emptyMessage.style.display = 'none';
        evidenceList.innerHTML = '';
        
        evidences.forEach(evidence => {
          const evidenceElement = document.createElement('div');
          evidenceElement.className = 'evidence-item';
          evidenceElement.innerHTML = `
            <div class="evidence-content">
              <h4>${new Date(evidence.collectionDate).toLocaleDateString('pt-BR')}</h4>
              <p>${evidence.description}</p>
              ${evidence.location ? `<p><strong>Local:</strong> ${evidence.location}</p>` : ''}
              ${evidence.imageUrl ? `<img src="${evidence.imageUrl}" alt="Evidência" class="evidence-image">` : ''}
            </div>
          `;
          evidenceList.appendChild(evidenceElement);
        });
      } catch (error) {
        console.error('Erro ao carregar evidências:', error);
      }
    }
  
    // Adicionar evidência
    document.getElementById('add-evidence').addEventListener('click', () => {
      evidenceModal.style.display = 'block';
    });
  
    document.getElementById('evidence-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const evidenceData = {
        caseId: caseId,
        collectionDate: document.getElementById('collection-date').value,
        collectionTime: document.getElementById('collection-time').value,
        description: document.getElementById('evidence-description-field').value,
        location: document.getElementById('evidence-lat').value && document.getElementById('evidence-long').value 
                  ? `${document.getElementById('evidence-lat').value}, ${document.getElementById('evidence-long').value}`
                  : null,
        imageUrl: document.getElementById('evidence-image-url').value || null,
        file: document.getElementById('evidence-file').files[0] || null
      };
  
      try {
        const response = await fetch('/api/evidences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(evidenceData)
        });
        
        if (response.ok) {
          alert('Evidência adicionada com sucesso!');
          evidenceModal.style.display = 'none';
          loadEvidences();
        } else {
          throw new Error('Erro ao adicionar evidência');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao adicionar evidência');
      }
    });
  
    // Gerar relatório
    document.getElementById('generate-report').addEventListener('click', () => {
      reportModal.style.display = 'block';
    });
  
    document.getElementById('report-form').addEventListener('submit', function(e) {
      e.preventDefault();
      generatePdfReport();
    });
  
    // Função para gerar PDF
    function generatePdfReport() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Título do relatório
      const reportTitle = document.getElementById('report-title').value || 'Relatório do Caso';
      doc.setFontSize(18);
      doc.text(reportTitle, 105, 20, { align: 'center' });
      
      // Informações do caso
      doc.setFontSize(12);
      doc.text(`ID do Caso: ${document.getElementById('case-id').textContent}`, 14, 40);
      doc.text(`Status: ${document.getElementById('case-status').textContent}`, 14, 50);
      doc.text(`Data de Criação: ${document.getElementById('case-date').textContent}`, 14, 60);
      
      // Adicionar mais informações conforme necessário...
      
      // Salvar PDF
      doc.save(`relatorio-${document.getElementById('case-id').textContent.replace('#', '')}.pdf`);
      reportModal.style.display = 'none';
    }
  
    // Obter localização
    document.getElementById('get-location').addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            document.getElementById('evidence-lat').value = position.coords.latitude.toFixed(6);
            document.getElementById('evidence-long').value = position.coords.longitude.toFixed(6);
          },
          (error) => {
            alert('Erro ao obter localização: ' + error.message);
          }
        );
      } else {
        alert('Geolocalização não é suportada por este navegador.');
      }
    });
  
    // Carregar os dados do caso
    loadCaseDetails();
  });