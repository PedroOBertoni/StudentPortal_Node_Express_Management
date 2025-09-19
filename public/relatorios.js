function gerarRelatorioPersonalizado() {
  // Buscar alunos do array global (definido em script.js)
  if (typeof alunos === 'undefined' || alunos.length === 0) {
    alert('Nenhum aluno cadastrado!');
    return;
  }

  const campo = document.getElementById("campo").value;
  const ordem = document.getElementById("ordem").value;
  const apenasAprovados = document.getElementById("apenasAprovados").checked;

  let alunosFiltrados = [...alunos];
  
  if (apenasAprovados) {
    alunosFiltrados = alunosFiltrados.filter((aluno) => parseFloat(aluno.media) >= 6.0);
  }

  if (alunosFiltrados.length === 0) {
    alert('Nenhum aluno encontrado com os filtros aplicados!');
    return;
  }

  // Aplicar Selection Sort
  const alunosOrdenados = selectionSort(alunosFiltrados, campo, ordem);
  const titulo = `Alunos por ${campo.toUpperCase()} (${
    ordem === "asc" ? "Crescente" : "Decrescente"
  })${apenasAprovados ? " - Apenas Aprovados" : ""}`;

  exibirRelatorio(alunosOrdenados, titulo);
}

function selectionSort(arr, campo, ordem) {
  for (let i = 0; i < arr.length - 1; i++) {
    let selectedIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      let comparacao;

      if (campo === "nome") {
        comparacao = arr[j][campo].localeCompare(arr[selectedIndex][campo]);
      } else {
        comparacao =
          parseFloat(arr[j][campo]) - parseFloat(arr[selectedIndex][campo]);
      }

      if (
        (ordem === "asc" && comparacao < 0) ||
        (ordem === "desc" && comparacao > 0)
      ) {
        selectedIndex = j;
      }
    }
    [arr[i], arr[selectedIndex]] = [arr[selectedIndex], arr[i]];
  }
  return arr;
}

function exibirRelatorio(alunos, titulo) {
  const secao = document.getElementById("secaoRelatorio");
  const tituloElement = document.getElementById("tituloRelatorio");
  const tbody = document.getElementById("dadosRelatorio");

  tituloElement.textContent = titulo;
  tbody.innerHTML = "";

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

  secao.style.display = "block";
}
