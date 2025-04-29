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
        const caseData = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/api/cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(caseData)
            });
            
            if (response.ok) {
                alert('Caso cadastrado com sucesso!');
                window.location.href = 'list-case.html';
            } else {
                throw new Error('Erro ao cadastrar caso');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar caso. Por favor, tente novamente.');
        }
    });
});