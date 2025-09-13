async function gerarRelatorioPersonalizado() {
  try {
    const response = await fetch("/api/alunos");
    let alunos = await response.json();

    if (alunos.length === 0) {
      return;
    }

    const campo = document.getElementById("campo").value;
    const ordem = document.getElementById("ordem").value;
    const apenasAprovados = document.getElementById("apenasAprovados").checked;

    if (apenasAprovados) {
      alunos = alunos.filter((aluno) => parseFloat(aluno.media) >= 6.0);
    }

    const alunosOrdenados = selectionSort([...alunos], campo, ordem);
    const titulo = `Alunos por ${campo.toUpperCase()} (${
      ordem === "asc" ? "Crescente" : "Decrescente"
    })${apenasAprovados ? " - Apenas Aprovados" : ""}`;

    if (alunosOrdenados.length === 0) {
      return;
    }

    exibirRelatorio(alunosOrdenados, titulo);
  } catch (error) {
    console.error("Erro ao carregar dados do servidor:", error);
  }
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
