/**
 * Gera relatório personalizado com base nos filtros selecionados
 * Aplica ordenação usando Selection Sort
 */
function gerarRelatorioPersonalizado() {
  // Carrega alunos do localStorage
  const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
  
  if (alunos.length === 0) {
    mostrarMensagem('Nenhum aluno cadastrado!', 'erro', 'mensagemRelatorio');
    return;
  }

  // Captura parâmetros do relatório
  const campo = document.getElementById("campo").value;
  const ordem = document.getElementById("ordem").value;
  const apenasAprovados = document.getElementById("apenasAprovados").checked;

  // Aplica filtro de aprovados se selecionado
  let alunosFiltrados = [...alunos];
  if (apenasAprovados) {
    alunosFiltrados = alunosFiltrados.filter((aluno) => parseFloat(aluno.media) >= 6.0);
  }

  if (alunosFiltrados.length === 0) {
    mostrarMensagem('Nenhum aluno encontrado com os filtros aplicados!', 'erro', 'mensagemRelatorio');
    return;
  }

  // Aplica ordenação e gera relatório
  const alunosOrdenados = selectionSort(alunosFiltrados, campo, ordem);
  const titulo = `Alunos por ${campo.toUpperCase()} (${
    ordem === "asc" ? "Crescente" : "Decrescente"
  })${apenasAprovados ? " - Apenas Aprovados" : ""}`;

  exibirRelatorio(alunosOrdenados, titulo);
  mostrarMensagem('', '', 'mensagemRelatorio');
}

/**
 * Exibe mensagens de feedback na interface
 * @param {string} texto - Texto da mensagem
 * @param {string} tipo - Tipo da mensagem (sucesso/erro)
 * @param {string} elementoId - ID do elemento onde exibir
 */
function mostrarMensagem(texto, tipo, elementoId) {
  const elemento = document.getElementById(elementoId);
  if (texto) {
    elemento.innerHTML = `<div class="mensagem ${tipo}">${texto}</div>`;
    setTimeout(() => elemento.innerHTML = '', 3000);
  } else {
    elemento.innerHTML = '';
  }
}

/**
 * Algoritmo Selection Sort
 * Ordena array de alunos por campo especificado
 * @param {Array} arr - Array de alunos
 * @param {string} campo - Campo para ordenação
 * @param {string} ordem - Ordem (asc/desc)
 * @returns {Array} - Array ordenado
 */
function selectionSort(arr, campo, ordem) {
  for (let i = 0; i < arr.length - 1; i++) {
    let selectedIndex = i;
    
    for (let j = i + 1; j < arr.length; j++) {
      let comparacao;

      // Comparação por tipo de campo
      if (campo === "nome") {
        comparacao = arr[j][campo].localeCompare(arr[selectedIndex][campo]);
      } else {
        comparacao = parseFloat(arr[j][campo]) - parseFloat(arr[selectedIndex][campo]);
      }

      // Determina se deve trocar baseado na ordem
      if (
        (ordem === "asc" && comparacao < 0) ||
        (ordem === "desc" && comparacao > 0)
      ) {
        selectedIndex = j;
      }
    }
    
    // Troca elementos
    [arr[i], arr[selectedIndex]] = [arr[selectedIndex], arr[i]];
  }
  return arr;
}

/**
 * Exibe o relatório na interface
 * @param {Array} alunos - Array de alunos ordenados
 * @param {string} titulo - Título do relatório
 */
function exibirRelatorio(alunos, titulo) {
  const secao = document.getElementById("secaoRelatorio");
  const tituloElement = document.getElementById("tituloRelatorio");
  const tbody = document.getElementById("dadosRelatorio");

  // Define título e limpa tabela
  tituloElement.textContent = titulo;
  tbody.innerHTML = "";

  // Popula tabela com dados dos alunos
  alunos.forEach((aluno) => {
    const resultado = parseFloat(aluno.media) >= 6.0 ? "Aprovado" : "Reprovado";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.ra}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.sexo}</td>
      <td>${parseFloat(aluno.media).toFixed(1)}</td>
      <td>${resultado}</td>
    `;
    tbody.appendChild(tr);
  });

  // Exibe seção do relatório
  secao.style.display = "block";
}
