const btnCadastrar = document.querySelector("#cadastrar")

class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano,
        this.mes = mes,
        this.dia = dia, 
        this.tipo = tipo, 
        this.descricao = descricao,
        this.valor = valor;
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
        $("#sucessoGravacao").modal("show")
    } else {
        $("#erroGravacao").modal("show")
    }
}



btnCadastrar.addEventListener("click", cadastrarDespesa)
