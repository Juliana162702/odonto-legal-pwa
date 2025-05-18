document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Gerar ID do caso
    function generateCaseId() {
        const prefix = 'CASO-';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return prefix + randomNum;
    }

    // Preencher ID do caso automaticamente
    document.getElementById('case-id').value = generateCaseId();

    // Form submission
    const caseForm = document.getElementById('case-form');
    caseForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(caseForm);
        
        // Obtendo os dados do formulário
        const caseData = {
            caseId: formData.get('caseId'),
            description: formData.get('description'),
            patientName: formData.get('patientName'),
            patientDOB: formData.get('patientDOB'), // A data de nascimento (formato YYYY-MM-DD)
            patientGender: formData.get('patientGender'),
            patientID: formData.get('patientID'),
            patientContact: formData.get('patientContact'),
            incidentDate: formData.get('incidentDate'),
            incidentLocation: formData.get('incidentLocation'),
            incidentDescription: formData.get('incidentDescription'),
            incidentWeapon: formData.get('incidentWeapon'),
            user: formData.get('user') // caso esteja usando autenticação, você pode capturar o ID do usuário
        };
        
        // Verifica se o token está presente
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Você precisa estar logado para cadastrar um caso.");
            return; // Impede a requisição sem token
        }

        try {
            // Verifica se está em ambiente local ou de produção
            const hostname = window.location.hostname;
            const baseUrl = (hostname === 'localhost' || hostname === '127.0.0.1')
              ? 'http://localhost:3000'
              : 'https://seu-backend.com'; // ou sua URL real, se for o caso
            
            // Envia o POST com os dados corretos
            const response = await fetch(`${baseUrl}/api/cases`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Adiciona o token de autenticação
                },
                body: JSON.stringify(caseData)
            });
        
            if (response.ok) {
                alert('Caso cadastrado com sucesso!');
                window.location.href = 'list-case.html'; // Redireciona após sucesso
            } else {
                throw new Error('Erro ao cadastrar caso');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar caso. Por favor, tente novamente.');
        }
    });
});
