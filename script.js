//formulario do inicio
document.addEventListener('DOMContentLoaded', () => {

  const formulario = document.querySelector('.formulario-apogonos');
  const campoMensagem = formulario.querySelector('.texto-contato');

  formulario.addEventListener('submit', (evento) => {

    evento.preventDefault();

    const dadosDoFormulario = [];
    const campos = formulario.querySelectorAll('input[name], input:not([name])[type="text"], textarea');

    campos.forEach(campo => {


      let nomeDoCampo = campo.name || campo.className;

      if (campo.className.includes('texto-contato') && !campo.name) {
        nomeDoCampo = 'Mensagem';
      }

      const dado = {
        chave: nomeDoCampo,
        valor: campo.value.trim()
      };

      dadosDoFormulario.push(dado);
    });

    const SemVazios = dadosDoFormulario.filter((dado) => {
      if (dado.valor.trim() != "") {
        return dado
      }
    })

    if (SemVazios.length != dadosDoFormulario.length) {
      alert("Atenção: Nenhum campo do formulário pode conter apenas espaços em branco. 🟥")
      return
    }

    console.log("Dados capturados:", dadosDoFormulario);

    if (campoMensagem) {
      campoMensagem.value = '';

    }

    formulario.querySelector('input[name="Nome"]').value = '';
    formulario.querySelector('input[name="Assunto"]').value = '';

    alert('Mensagem enviada com sucesso! ✅');


  });
});

//login
document.addEventListener('DOMContentLoaded', () => {
  const NOME_CORRETO = "VICTTOR HUGO";
  const SENHA_CORRETA = "1291392522005";


  const formularioLogin = document.querySelector('.form-login');

  if (!formularioLogin) {
    console.error("Formulário de login não encontrado.");
    return;
  }


  formularioLogin.addEventListener('submit', evento => {
    evento.preventDefault();

    const dadosDoLogin = {};
    const dados = new FormData(formularioLogin);

    for (let [key, value] of dados.entries()) {
      dadosDoLogin[key] = String(value).trim();
    }

    const nome = dadosDoLogin['name_user'];
    const senhaDigitada = dadosDoLogin['senha_user'];

    const nomeDigitado = nome.toUpperCase()
    if (nomeDigitado === "" || senhaDigitada === "") {
      alert("Por favor, preencha o nome de usuário e a senha. 🟥");
      return;
    }

    if (NOME_CORRETO == nomeDigitado.trim() && SENHA_CORRETA == senhaDigitada.trim()) {

      window.location.href = "pedidos.html";

    } else {
      alert("Erro de Login: Nome de usuário ou senha incorretos. ❌");
    }

    formularioLogin.reset();
  });
});

// peidos e valores finais
document.addEventListener('DOMContentLoaded', () => {

  let valorFinal = 0;
  let totalPedidos = 0;

  let contagemProdutos = {};

  const containerCarrinho = document.querySelector('.baixo');
  const botoesComprar = document.querySelectorAll('.btn-comprar');
  const spansNumeros = document.querySelectorAll('.numeros');
  const btnFinalizar = document.querySelector('.finalizar');


  function atualizarTotais() {
    spansNumeros[0].innerText = `Valor final: R$ ${valorFinal.toFixed(2)}`;
    spansNumeros[1].innerText = `Pedidos Total: ${totalPedidos}`;
  }
  atualizarTotais();

  botoesComprar.forEach(botao => {
    botao.addEventListener('click', (e) => {
      const cardProduto = e.target.closest('artcle');
      const textoPreco = cardProduto.querySelector('.card-part1 strong').innerText;
      const precoNumerico = parseFloat(textoPreco.replace('R$', '').replace(',', '.').trim());

      let titulo = cardProduto.querySelector('.card-part2 p:first-child strong').innerText;
      titulo = titulo.replace(':', '').trim();

      const descricao = cardProduto.querySelector('.card-part2 p:last-child').innerText;

      const classeCor = e.target.classList[1];

      valorFinal += precoNumerico;
      totalPedidos++;


      if (contagemProdutos[titulo]) {
        contagemProdutos[titulo]++;
      } else {
        contagemProdutos[titulo] = 1;
      }

      criarItemNoCarrinho(titulo, descricao, precoNumerico, classeCor);

      atualizarTotais();
    });
  });

  function criarItemNoCarrinho(titulo, desc, preco, cor) {
    const divPedido = document.createElement('div');
    divPedido.classList.add('card-pedido');
    divPedido.classList.add(`bg-${cor}`);

    divPedido.innerHTML = `
            <div class="descricao">
                <p><strong>${titulo}</strong></p>
                <p>${desc.substring(0, 60)}...</p> </div>
            <button class="excluir">❌</button>
        `;


    const btnExcluir = divPedido.querySelector('.excluir');
    btnExcluir.addEventListener('click', () => {

      divPedido.remove();


      valorFinal -= preco;
      totalPedidos--;

      if (contagemProdutos[titulo] > 0) {
        contagemProdutos[titulo]--;
      }

      if (valorFinal < 0) valorFinal = 0;
      if (totalPedidos < 0) totalPedidos = 0;

      atualizarTotais();
    });

    containerCarrinho.appendChild(divPedido);
    divPedido.scrollIntoView({ behavior: 'smooth' });
  }

  btnFinalizar.addEventListener('click', () => {

    if (totalPedidos === 0) {
      alert("Seu carrinho está vazio! Adicione produtos antes de finalizar. 🛒");
      return;
    }

    let mensagem = `Olá! Gostaria de finalizar meu pedido:\n`;

    mensagem += `*Resumo dos Itens:`;
    for (let [produto, quantidade] of Object.entries(contagemProdutos)) {
      if (quantidade > 0) {
        mensagem += `- ${quantidade}x ${produto}`;
      }
    }

    mensagem += `\nTotal de Produtos:* ${totalPedidos}`;
    mensagem += `\nValor Total: R$ ${valorFinal.toFixed(2)}`;

    mensagem += `\nAguardo a confirmação!!`;

    const linkWhatsApp = `https://wa.me/5511972108611?text= ${encodeURIComponent(mensagem)}`;

    window.open(linkWhatsApp, '_blank');
  });
});