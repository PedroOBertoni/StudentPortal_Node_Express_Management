let alunos = [];

function adicionarAluno() {
  const nome = document.getElementById('nome').value.trim();
  const ra = document.getElementById('ra').value.trim();
  const idade = parseInt(document.getElementById('idade').value);
  const sexo = document.getElementById('sexo').value;
  const media = parseFloat(document.getElementById('media').value);

  if (!nome || !ra || !idade || !sexo || isNaN(media)) {
    mostrarMensagem('Preencha todos os campos!', 'erro', 'mensagemAdicionar');
    return;
  }
  if (media < 0 || media > 10) {
    mostrarMensagem('Média inválida! A média deve ser entre 0 e 10', 'erro', 'mensagemAdicionar');
    return;
  }
  if (buscaSequencial('ra', ra)) {
    mostrarMensagem('RA já cadastrado!', 'erro', 'mensagemAdicionar');
    return;
  }

  alunos.push({ nome, ra, idade, sexo, media });
  mostrarMensagem('✅ Aluno adicionado com sucesso!', 'sucesso', 'mensagemAdicionar');
  limparFormulario();
  atualizarTabela();
}

function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('ra').value = '';
  document.getElementById('idade').value = '';
  document.getElementById('sexo').value = '';
  document.getElementById('media').value = '';
}

// Busca Sequencial - algoritmo implementado
function buscaSequencial(campo, valor) {
  for (let i = 0; i < alunos.length; i++) {
    if (alunos[i][campo] === valor) {
      return alunos[i];
    }
  }
  return null;
}

function atualizarTabela() {
  const tbody = document.getElementById('listaAlunos');
  const secao = document.getElementById('secaoTabela');
  
  if (alunos.length === 0) {
    secao.style.display = 'none';
    return;
  }
  
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

function editarAluno(ra) {
  const aluno = alunos.find(a => a.ra === ra);
  document.getElementById('editNome').value = aluno.nome;
  document.getElementById('editRa').value = aluno.ra;
  document.getElementById('editIdade').value = aluno.idade;
  document.getElementById('editSexo').value = aluno.sexo;
  document.getElementById('editMedia').value = aluno.media;
  
  document.getElementById('modalEdicao').style.display = 'block';
  document.getElementById('modalEdicao').dataset.ra = ra;
}

function salvarEdicao() {
  const ra = document.getElementById('modalEdicao').dataset.ra;
  const nome = document.getElementById('editNome').value.trim();
  const idade = parseInt(document.getElementById('editIdade').value);
  const sexo = document.getElementById('editSexo').value;
  const media = parseFloat(document.getElementById('editMedia').value);

  if (!nome || !idade || !sexo || isNaN(media)) {
    mostrarMensagem('Preencha todos os campos!', 'erro', 'mensagemEdicao');
    return;
  }

  const aluno = buscaSequencial('ra', ra);
  if (aluno) {
    aluno.nome = nome;
    aluno.idade = idade;
    aluno.sexo = sexo;
    aluno.media = media;
    
    fecharModal();
    atualizarTabela();
    mostrarMensagem('✅ Aluno atualizado com sucesso!', 'sucesso', 'mensagemAdicionar');
  }
}

function excluirAluno(ra) {
  if (confirm('Deseja excluir este aluno?')) {
    const index = alunos.findIndex(aluno => aluno.ra === ra);
    if (index !== -1) {
      alunos.splice(index, 1);
      atualizarTabela();
      mostrarMensagem('Aluno removido!', 'sucesso', 'mensagemAdicionar');
    }
  }
}

function fecharModal() {
  document.getElementById('modalEdicao').style.display = 'none';
  document.getElementById('mensagemEdicao').innerHTML = '';
}

function mostrarMensagem(texto, tipo, elementoId) {
  const elemento = document.getElementById(elementoId);
  elemento.innerHTML = `<div class="mensagem ${tipo}">${texto}</div>`;
  setTimeout(() => elemento.innerHTML = '', 3000);
}

// Inicializar tabela vazia
window.onload = function() {
  atualizarTabela();
};