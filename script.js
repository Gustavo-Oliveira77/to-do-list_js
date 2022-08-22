"use strict";
//criando uma variavel banco uma array vazia
let banco = [];

//abaixo tem duas funçoes a getBanco vai pegar no localStorage
//o item todoList e o ?? é pra caso não tenha nada dentro pegar [array] vazio
//o JSON.parse vai ler oq estiver no localStorage e traduzir em um objeto javascript
const getBanco = () => JSON.parse(localStorage.getItem("todoList")) ?? [];

// o setBanco vai definir no localstorage o item todoList
//em forma de string json os valores dos banco
const setBanco = (banco) =>
  localStorage.setItem("todoList", JSON.stringify(banco));

//essa função vai ser para criar itens html atravez do js
//foi definida uma função com 3 parametros (tarefa,status,indice)
//tambem foi criado uma variavel 'item' que é a responsavel pela criação de uma label no html
//logo apos esse label criada vai receber uma classe com nome de todoList que vai herdar as caracteristicas
//...ja definidas no css, tambem é criada toda uma estrutura html atraves do innerHTML que recebe os parametros ...
//...para mudar seus valores de acordo com os eventos feitos pelo usuario
// e por fim sera adicionado um novo item ao final de cada tarefa atraves do appendChild(item)
const criarItem = (tarefa, status, indice) => {
  const item = document.createElement("label");
  item.classList.add("todo__item");
  item.innerHTML = `
        <input type="checkbox" ${status} data-indice=${indice}>
        <div>${tarefa}</div>
        <input type="button" value="X" data-indice=${indice}>
    `;
  document.getElementById("todoList").appendChild(item);
};

// A função limparTarefas vai pegar o elemento pai 'todoList'
// e o while para fazer uma verificação para enquanto existir um elemento filho
//remove o ultimo filho(lastChild) do elemento pai
//isso é feito para n ocorrer repetiçoes de tarefas...
const limparTarefas = () => {
  const todoList = document.getElementById("todoList");
  while (todoList.firstChild) {
    todoList.removeChild(todoList.lastChild);
  }
};

// essa função ira atualizar a tela sempre que for acionada
//primeiro vai chamar a função limparTarefas(), depois é criada...
//... uma variavel 'banco' para pegar os elementos do banco 'getBanco'.
//depois disso, no banco.forEach vai pegar os itens do banco e os indices...
//... e vai mandar para o 'criarItem' a tarefa, o seu status de checked ou n e o indice do item
//esse indice serve para conseguirmos diferenciar um item do outro
const atualizarTela = () => {
  limparTarefas();
  const banco = getBanco();
  banco.forEach((item, indice) => criarItem(item.tarefa, item.status, indice));
};

//aqui é onde será criada a função para inserir um item no banco
//foi criada uma função que tem como parametro o evento acionado no addEventListener no final do codigo
//foi criada duas variaveis uma chamada tecla que vai pegar a chave do evento de click
//a outra texto que vai pegar onde ocorreu esse evento
//logo embaixo tem um if() que vai verificar se a tecla enter foi acionada se sim ele vai ...
// chamar a função que pegar o banco e vai inserir o objeto com o valor digitado  atraves do push()
//logo depois vai chamar a função de definir no banco e a função de atualizar tela
//e por fim vai mudar o campo de texto para  ""(vazio)
const inserirItem = (evento) => {
  const tecla = evento.key;
  const texto = evento.target.value;
  if (tecla === "Enter") {
    const banco = getBanco();
    banco.push({ tarefa: texto, status: "" });
    setBanco(banco);
    atualizarTela();
    evento.target.value = "";
  }
};

//essa função vai remover o item apartir do indice desse elemento
//foi criada uma variavel 'banco' para pegar os elementos do banco 'getBanco'.
//apartir desse banco vamos remover o elemento atraves do splice()
//o (indice,1) é para ser removido o proprio indice que for pego
//logo depois vai definir no banco atraves da função setBacndo e vai atualizar a tela acionando a função de atualizarTela
const removerItem = (indice) => {
  const banco = getBanco();
  banco.splice(indice, 1);
  setBanco(banco);
  atualizarTela();
};

// basicamente essa função vai pegar o indice do item e vai mudar o status dele para checked se tiver vazio ...
//... ou o contrario se ja tiver marcada, tudo isso atraves do evento do input checkbox que o usuario acionar ou não
// e depois vai definir no banco e chamar a função de atualizarTela
const atualizarItem = (indice) => {
  const banco = getBanco();
  banco[indice].status = banco[indice].status === "" ? "checked" : "";
  setBanco(banco);
  atualizarTela();
};

//aqui temos os cliques que irao remover ou adicionar eventos e funçoes
//primeiro temos uma função que recebe o evento do addEventListener como parametro
//logo depois criei ma variavel que 'elemento' que faz referencia o evento acionado no addEventListener
// depois tenho uma estruruta condicional para verificar o tipo de elemento se é button ou checkbox
//se for button vai ser removido o indice que for acionado
//caso seja o checkbox vai apenas chamar a função atualizar item com o valor indice (indice)
const clickItem = (evento) => {
  const elemento = evento.target;

  if (elemento.type === "button") {
    const indice = elemento.dataset.indice;
    removerItem(indice);
  } else if (elemento.type === "checkbox") {
    const indice = elemento.dataset.indice;
    atualizarItem(indice);
  }
};
// aqui esta os meus eventos adicionados aos id newItem e todoList
document.getElementById("newItem").addEventListener("keypress", inserirItem);
document.getElementById("todoList").addEventListener("click", clickItem);

atualizarTela();
