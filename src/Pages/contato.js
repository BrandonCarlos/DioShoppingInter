import { useState, useEffect } from 'react';
import { Grid, Button, TextField } from '@material-ui/core/';

const Contatos = () => {

    const url = 'http://localhost:5000/message'
    const [message, setMessage] = useState([]);//setando um state para a váriavel Message, só mudamos com o setMessage
    const [author, setAuthor] = useState('');//armazenando mais valores, começando vázio ''
    const [content, setContent] = useState('');//estamos criando estes ESTADOS para setar os valores no banco de dados
    const [validator, setValidator] = useState(false);//para validar o formulário previnindo campos vázios
    const [render, setRender] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(async () => {//Consumindo a API com o useEffect, permiti trabalhar com funções assyncronas
        const response = await fetch(url)//utilizando async e await para esperar o requerimento do valor da API
        const data = await response.json();//convertendo para JSON para conseguimos consumir estes dados
        setMessage(data);
    }, [render])//se o RENDER for TRUE recarrega a página, e consulta a API

    const sendMessage = () => {
        setValidator(false);//ou seja cliquei novamente no botão, Validator fica FALSE significa que não irá mostrar a DIV dps disso vai ocorrer a validação caso precise
        //será mostrado a div falando "preencha todos os campos"
        if (author.length <= 0 || content.length <= 0) {
            return setValidator(!validator)//Se author e content estiverem vázios, coloca o validator como true, e então o Validator que tem a DIV irá ser mostrado
        } 
        const bodyForm = {//para convertermos para STRING abaixo, com o STRINGIFY
            email: author,
            message: content,
        }

        fetch(url, {
            method: "POST",//para enviarmos os dados Autor e message
            headers: {
                "Content-Type": "application/json"//vamos enviar em formato JSON para nosso BACK=END
            },
            body: JSON.stringify(bodyForm)//no body(FRONT-END) vamos capturar tanto o "email", quanto a "mensasgem"
            //estamos quase enviando a mensagem no formato de JSON, pois fizemos a conversão com o STRINGIFY enviando o author e o content 
            //nosso BACK-END não aceita OBJETO aceita JSON
            //e quanto dizermos a inserção da nova mensagem, dai será mostrado no console.log() pois está assim no BACK-end dizendo que irá mostrar ao efetuar a inserção
        })
        // Vamos validar se receber um resposta logo dps de fazer a requisição no FETCH
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {//ou seja se no nosso JSON tiver "ID" significa que temos dados retornados então...
                    setRender(true);//muda o estado do RENDER, e consulta a API
                    //ou seja fizemos a requisição na API, tem o "ID"? sim, então consulta a API novamente e irá recarregar a página já com 
                    //o nova "postagem" essa postagem é o HTML e CSS e JS abaixo no return, portanto faz o recarregamento novamente a página com novos dados no caso o novo dado inserido
                    setSuccess(true);//alert de sucesso, estado muda pra TRUE e é exibido a mensagem de SUCESSO
                    setTimeout(() => {//quando cadastramos email e message, aparece a mensagem de sucesso
                        setSuccess(false);//e depois de 5 segundos a mensagem some 
                    }, 5000)
                }
            })

        //assim que fazer a inserção dos dados no back-end limpar os campos
        setAuthor('');
        setContent('');

        console.log(content)
    }

    return (
        //Abaixo estamos digitando e armazenando os valores nos devidos ESTADOS
        <>
            <Grid container direction="row" xs={12}>
                <TextField id="name" label="Name" value={author} onChange={(event) => { setAuthor(event.target.value) }} fullWidth />
                <TextField id="message" label="Message" value={content} onChange={(event) => { setContent(event.target.value) }} fullWidth />
            </Grid>

            {validator && //se o "Validator" for TRUE mostra a div falando "Por favor preencha todos os campos!"
                <div className="alert alert-warning alert-dismissible fade show mt-2" role="alert">
                    <strong>Por favor preencha todos os campos!</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }

            {success &&
                <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                    <strong>Mensagem foi enviada</strong>
                </div>
            }

            <Button onClick={sendMessage} className="mt-2" variant="contained" color="primary">
                Sent
            </Button>

            {message.map((content) => {
                return (
                    //depois do MAP o primeiro elemento precisa receber uma KEY
                    <div className="card mt-2" key={content.id}>
                        <div className="card-body">
                            <h5 className="card-title">{content.email}</h5>
                            <p className="card-text">{content.message}</p>
                            <p className="card-text"><small className="text-muted">{content.created_at}</small></p>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default Contatos;
