/**
 * BRACKETFLOW - CORE ENGINE
 * Gerenciamento avançado de chaves e fluxo de competidores
 */

// Objeto global para manter o estado do torneio se necessário futuramente
const TournamentState = {
    totalParticipants: 8,
    isFinished: false,
    winner: null
};

/**
 * Função: updateBracket
 * Descrição: Sincroniza os inputs da sidebar com a primeira rodada (Quartas)
 */
function updateBracket(index, value) {
    // Localiza o nó da chave correspondente ao index do slot (t0, t1, t2...)
    const targetNode = document.getElementById(`t${index}`);
    
    if (targetNode) {
        // Sanitização simples: Converte para maiúsculas e remove espaços extras
        const formattedName = value.trim().toUpperCase();
        
        // Se o input estiver vazio, exibe o placeholder de espera
        if (formattedName === "") {
            targetNode.innerText = "---";
            targetNode.classList.remove("has-content");
        } else {
            targetNode.innerText = formattedName;
            targetNode.classList.add("has-content");
        }
    }
}

/**
 * Função: advance
 * Descrição: Promove um competidor para o próximo nível da chave ao ser clicado
 */
function advance(clickedElement, nextSlotId) {
    // 1. Captura o nome do competidor no elemento clicado
    const teamName = clickedElement.innerText;

    // 2. Validações de segurança: não avança se o slot estiver vazio ou for placeholder
    if (teamName === "---" || teamName === "?" || teamName === "" || teamName === "VENCEDOR") {
        console.warn("Ação bloqueada: Slot vazio ou inválido.");
        return;
    }

    // 3. Localiza o destino na próxima rodada
    const nextLevelSlot = document.getElementById(nextSlotId);

    if (nextLevelSlot) {
        // Executa a promoção do nome
        nextLevelSlot.innerText = teamName;
        nextLevelSlot.classList.add("has-content");

        // --- GESTÃO DE ESTILOS E VENCEDORES ---

        // Localiza o container da partida atual (pai dos dois competidores)
        const matchContainer = clickedElement.parentElement;
        
        // Remove a classe de vencedor de todos os competidores desta partida específica
        const opponents = matchContainer.querySelectorAll('.team-node');
        opponents.forEach(node => {
            node.classList.remove('winner-active');
        });

        // Adiciona o destaque visual ao competidor que foi clicado
        clickedElement.classList.add('winner-active');

        // --- LÓGICA DE FINALIZAÇÃO ---

        // Se o destino for o box final do campeão
        if (nextSlotId === 'champion-result') {
            handleTournamentVictory(teamName, nextLevelSlot);
        }
    }
}

/**
 * Função: handleTournamentVictory
 * Descrição: Aciona eventos visuais quando um campeão é definido
 */
function handleTournamentVictory(name, winnerElement) {
    TournamentState.isFinished = true;
    TournamentState.winner = name;

    // Estilização forçada do Campeão (Inversão de cores para destaque)
    winnerElement.style.backgroundColor = "#ffffff";
    winnerElement.style.color = "#000000";
    winnerElement.style.borderColor = "#ffffff";
    winnerElement.style.boxShadow = "0 0 50px rgba(255, 255, 255, 0.2)";
    winnerElement.style.transform = "scale(1.1)";

    // Log de console para debug de fluxo
    console.log(`%c 🏆 TORNEIO FINALIZADO: ${name} é o campeão! `, "background: #000; color: #fff; font-size: 16px; font-weight: bold;");
    
    // Aqui você pode inserir chamadas para APIs de salvamento ou disparar confetes (canvas-confetti)
}

/**
 * Inicialização e Listeners Adicionais
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("BracketFlow Engine: Operacional.");
    
    // Limpa os inputs ao recarregar a página (opcional, para testes limpos)
    const allInputs = document.querySelectorAll('.slot-input');
    allInputs.forEach(input => input.value = "");
});
