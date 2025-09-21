// Array global de alunos - carregado do localStorage
let alunos = JSON.parse(localStorage.getItem('alunos')) || [];

/**
 * Adiciona um novo aluno ao sistema
 * Valida os dados e verifica duplicatas de RA
 */
function adicionarAluno() {
  // Captura dos dados do formulário
  const nome = document.getElementById('nome').value.trim();
  const ra = document.getElementById('ra').value.trim();
  const idade = parseInt(document.getElementById('idade').value);
  const sexo = document.getElementById('sexo').value;
  const media = parseFloat(document.getElementById('media').value);

  // Validação de campos obrigatórios
  if (!nome || !ra || !idade || !sexo || isNaN(media)) {
    mostrarMensagem('Preencha todos os campos!', 'erro', 'mensagemAdicionar');
    return;
  }
  
  // Validação da média
  if (media < 0 || media > 10) {
    mostrarMensagem('Média inválida! A média deve ser entre 0 e 10', 'erro', 'mensagemAdicionar');
    return;
  }
  
  // Verificação de RA duplicado usando busca sequencial
  if (buscaSequencial('ra', ra)) {
    mostrarMensagem('RA já cadastrado!', 'erro', 'mensagemAdicionar');
    return;
  }

  // Adiciona aluno ao array e salva no localStorage
  alunos.push({ nome, ra, idade, sexo, media });
  localStorage.setItem('alunos', JSON.stringify(alunos));
  
  // Feedback e limpeza
  mostrarMensagem('✅ Aluno adicionado com sucesso!', 'sucesso', 'mensagemAdicionar');
  limparFormulario();
  atualizarTabela();
}

/**
 * Limpa todos os campos do formulário de cadastro
 */
function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('ra').value = '';
  document.getElementById('idade').value = '';
  document.getElementById('sexo').value = '';
  document.getElementById('media').value = '';
}

/**
 * Algoritmo de Busca Sequencial
 * Procura um aluno pelo campo especificado
 * @param {string} campo - Campo a ser pesquisado
 * @param {string} valor - Valor a ser encontrado
 * @returns {Object|null} - Aluno encontrado ou null
 */
function buscaSequencial(campo, valor) {
  for (let i = 0; i < alunos.length; i++) {
    if (alunos[i][campo] === valor) {
      return alunos[i];
    }
  }
  return null;
}

/**
 * Atualiza a tabela de alunos na interface
 * Mostra/esconde a seção conforme necessário
 */
function atualizarTabela() {
  const tbody = document.getElementById('listaAlunos');
  const secao = document.getElementById('secaoTabela');
  
  // Esconde tabela se não há alunos
  if (alunos.length === 0) {
    secao.style.display = 'none';
    return;
  }
  
  // Mostra tabela e popula com dados
  secao.style.display = 'block';
  tbody.innerHTML = '';
  
  alunos.forEach((aluno) => {
    const resultado = aluno.media >= 6.0 ? 'Aprovado' : 'Reprovado';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.ra}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.sexo}</td>
      <td>${parseFloat(aluno.media).toFixed(1)}</td>
      <td>${resultado}</td>
      <td>
        <button onclick="editarAluno('${aluno.ra}')">Editar</button>
        <button onclick="excluirAluno('${aluno.ra}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Abre o modal de edição com os dados do aluno
 * @param {string} ra - RA do aluno a ser editado
 */
function editarAluno(ra) {
  const aluno = alunos.find(a => a.ra === ra);
  
  // Preenche campos do modal
  document.getElementById('editNome').value = aluno.nome;
  document.getElementById('editRa').value = aluno.ra;
  document.getElementById('editIdade').value = aluno.idade;
  document.getElementById('editSexo').value = aluno.sexo;
  document.getElementById('editMedia').value = aluno.media;
  
  // Exibe modal e armazena RA original
  document.getElementById('modalEdicao').style.display = 'block';
  document.getElementById('modalEdicao').dataset.ra = ra;
}

/**
 * Salva as alterações do aluno editado
 * Valida dados e verifica duplicatas de RA
 */
function salvarEdicao() {
  const raOriginal = document.getElementById('modalEdicao').dataset.ra;
  
  // Captura novos dados
  const nome = document.getElementById('editNome').value.trim();
  const novoRa = document.getElementById('editRa').value.trim();
  const idade = parseInt(document.getElementById('editIdade').value);
  const sexo = document.getElementById('editSexo').value;
  const media = parseFloat(document.getElementById('editMedia').value);

  // Validação de campos
  if (!nome || !novoRa || !idade || !sexo || isNaN(media)) {
    mostrarMensagem('Preencha todos os campos!', 'erro', 'mensagemEdicao');
    return;
  }

  // Verifica se novo RA já existe (apenas se foi alterado)
  if (novoRa !== raOriginal && buscaSequencial('ra', novoRa)) {
    mostrarMensagem('RA já cadastrado!', 'erro', 'mensagemEdicao');
    return;
  }

  // Atualiza dados do aluno
  const aluno = buscaSequencial('ra', raOriginal);
  if (aluno) {
    aluno.nome = nome;
    aluno.ra = novoRa;
    aluno.idade = idade;
    aluno.sexo = sexo;
    aluno.media = media;
    
    // Salva no localStorage e atualiza interface
    localStorage.setItem('alunos', JSON.stringify(alunos));
    fecharModal();
    atualizarTabela();
    mostrarMensagem('✅ Aluno atualizado com sucesso!', 'sucesso', 'mensagemAdicionar');
  }
}

/**
 * Remove um aluno do sistema
 * @param {string} ra - RA do aluno a ser removido
 */
function excluirAluno(ra) {
  const index = alunos.findIndex(aluno => aluno.ra === ra);
  if (index !== -1) {
    alunos.splice(index, 1);
    localStorage.setItem('alunos', JSON.stringify(alunos));
    atualizarTabela();
    mostrarMensagem('Aluno removido!', 'sucesso', 'mensagemAdicionar');
  }
}

/**
 * Fecha o modal de edição e limpa mensagens
 */
function fecharModal() {
  document.getElementById('modalEdicao').style.display = 'none';
  document.getElementById('mensagemEdicao').innerHTML = '';
}

/**
 * Exibe mensagens de feedback na interface
 * @param {string} texto - Texto da mensagem
 * @param {string} tipo - Tipo da mensagem (sucesso/erro)
 * @param {string} elementoId - ID do elemento onde exibir
 */
function mostrarMensagem(texto, tipo, elementoId) {
  const elemento = document.getElementById(elementoId);
  elemento.innerHTML = `<div class="mensagem ${tipo}">${texto}</div>`;
  setTimeout(() => elemento.innerHTML = '', 3000);
}

/**
 * Inicialização da página
 * Carrega tabela de alunos ao abrir a página
 */
window.onload = function() {
  atualizarTabela();
};