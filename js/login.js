// Evento de envio do formulário
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede envio automático do formulário

    if (validarLogin()) {
        const cargo = document.getElementById("cargo").value;
        const matricula = document.getElementById("matricula").value;
        const senha = document.getElementById("senha").value;

        try {
            const resposta = await fetch('https://SEU_BACKEND_URL/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cargo, matricula, senha })
            });

            if (resposta.ok) {
                const dados = await resposta.json();
                // Ex: armazenar token/localStorage se for o caso
                // localStorage.setItem('token', dados.token);
                window.location.href = "list-case.html"; // Página após login
            } else {
                const erro = await resposta.json();
                mostrarErro(erro.mensagem || "Falha no login. Verifique suas credenciais.");
            }
        } catch (erro) {
            mostrarErro("Erro de conexão com o servidor.");
        }
    }
});

// Função de validação dos campos
function validarLogin() {
    const cargo = document.getElementById("cargo").value;
    const matricula = document.getElementById("matricula").value;
    const senha = document.getElementById("senha").value;

    if (cargo === '') {
        mostrarErro("Por favor, selecione seu cargo na lista");
        return false;
    }

    if (matricula.trim() === '') {
        mostrarErro("Digite sua matrícula para continuar");
        return false;
    }

    if (senha.trim() === '') {
        mostrarErro("Digite sua senha");
        return false;
    }

    return true;
}

// Exibe mensagens de erro
function mostrarErro(mensagem) {
    const erro = document.getElementById("mensagemErro");
    erro.textContent = mensagem;
    erro.style.color = "red";
    erro.style.display = "block";
}

// Registro do Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha ao registrar o Service Worker:', error);
            });
    });
}

