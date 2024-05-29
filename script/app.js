const btnCadastrar = document.querySelector("#cadastrar")


class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor, id){
        this.id = id
        this.ano = ano,
        this.mes = mes,
        this.dia = dia, 
        this.tipo = tipo, 
        this.descricao = descricao,
        this.valor = new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(valor)
    }

    validarDados() {
        for (let i in this){
            if(this[i] === undefined || this[i] === "" || this[i] === null) {
                return false
            }
        }

        return true
    }
}

class Bd {
    constructor () {
        let id = localStorage.getItem('id')

        if ( id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')

        return (parseInt(proximoId) + 1)
    }

    gravar(despesa) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(despesa))
        localStorage.setItem('id', id)
    }

    recuperarTodosOsRegistros() {
        let despesas = []

        let id = localStorage.getItem("id")

        for(let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa !== null && despesa !== undefined && despesa !== "" && despesa.ano !== "" && despesa.ano !== undefined && despesa.ano !== null ){
                despesa.id = i
                despesas.unshift(despesa)
            }
        }

        return(despesas)
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosOsRegistros()
        
        if(despesa.ano !== ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        if(despesa.mes !== ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        
        if(despesa.dia !== ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if(despesa.tipo !== ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if(despesa.descricao !== ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if(despesa.valor !== ""){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
        
    }
}

let bd = new Bd

function cadastrarDespesa() {
    let ano = document.querySelector("#ano"),
        mes = document.querySelector("#mes"),
        dia = document.querySelector("#dia"),
        tipo = document.querySelector("#tipo"),
        descricao = document.querySelector("#descricao"),
        valor = document.querySelector("#valor");

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    if (despesa.validarDados()){
        bd.gravar(despesa)

        document.getElementById("modal-titulo").innerHTML = 'registro inserido com sucesso'
        document.getElementById("modal-titulo-div").className = "modal-header text-success"
        document.getElementById("modal-conteudo").innerHTML = 'Despesa cadastrada com sucessso'
        document.getElementById("modal-btn").innerHTML = "Voltar"
        document.getElementById("modal-btn").className = "btn btn-success"
        $("#modal").modal("show")

        let entrada = document.querySelectorAll(".entrada")
        for (let i = 0; i < entrada.length; i++){
            entrada[i].value = ""
        }

    } else {

        document.getElementById("modal-titulo").innerHTML = 'Erro na inclusão do registro'
        document.getElementById("modal-titulo-div").className = "modal-header text-danger"
        document.getElementById("modal-conteudo").innerHTML = "Erro na gravação, verifique se todos os campos foram preenchidos corretamente!"
        document.getElementById("modal-btn").innerHTML = "Voltar e corrigir"
        document.getElementById("modal-btn").className = "btn btn-danger"
        $("#modal").modal("show")

    }
}

/* redenriza a lista de despesa */
function carregaListaDespesa(despesa) {

    /* verifica se há linhas na tabela e apaga-as */
    let listaDespesas = document.getElementById("listaDespesas")
    while (listaDespesas.rows.length > 0) {
        listaDespesas.deleteRow(0);
    }
    
    let despesas = []

    /* verificando se o usuario está pesquisando algo e exibe o resultado filtrado se estiver */
    if(despesa){
        despesas = bd.pesquisar(despesa)
    } 
    if(!despesa) {
        despesas = bd.recuperarTodosOsRegistros()
    }

    /* redenriza os resultados */
    despesas.forEach((item) => {
        let linha = listaDespesas.insertRow()
        
        

         for(i = 0; i <= 3; i++) {
             let dadosDespesa = [`${item.dia} / ${item.mes} / ${item.ano}`, item.tipo, item.descricao, `R$ ${item.valor}`]

             linha.insertCell(i).innerHTML = dadosDespesa[i];
             
            }

            /* botão de excluir */
            let btn = document.createElement("button")
            btn.className = "btn btn-danger"
            btn.innerHTML = '<i class="fas fa-times"></i>'
            btn.id = item.id
            btn.onclick = function() {
                bd.remover(this.id)
                carregaListaDespesa()
            }
            linha.insertCell(4).append(btn)
    })
}


function pesquisarDespesa() {
    let ano = document.querySelector("#ano"),
        mes = document.querySelector("#mes"),
        dia = document.querySelector("#dia"),
        tipo = document.querySelector("#tipo"),
        descricao = document.querySelector("#descricao"),
        valor = document.querySelector("#valor"),
        despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

        carregaListaDespesa(despesa)
}

btnCadastrar.addEventListener("click", cadastrarDespesa)

