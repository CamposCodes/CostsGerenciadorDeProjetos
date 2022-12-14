import styles from "./Project.module.css";

import Loading from "../layout/Loading/Loading";
import Container from "../layout/Container/Container";
import ProjectForm from "../project/ProjectForm/ProjectForm";
import ServiceForm from "../service/ServiceForm/ServiceForm";
import Message from "../layout/Message/Message";
import ServiceCard from "../service/ServiceCard/ServiceCard";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { parse, v4 as uuidv4 } from "uuid";

function Project(){

    const {id} = useParams();
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setshowProjectForm] = useState(false)
    const [showServiceForm, setshowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(()=>{
        setTimeout(()=>{
            fetch(`http://localhost:8000/projects/${id}`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                },
            })
            .then((resp)=>resp.json())
            .then((data)=>{
                setProject(data)
                setServices(data.services)
            })
            .catch((err)=>console.log(err))
        },2000)
    },[id])

    function toggleProjectForm(){
        setshowProjectForm(!showProjectForm)
    }
    function toggleServiceForm(){
        setshowServiceForm(!showServiceForm)
    }

    function removeService(id, cost) {
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        );

        const projectUpdated = project;

        projectUpdated.services = servicesUpdated;
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

        fetch(`http://localhost:8000/projects/${projectUpdated.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectUpdated),
        })
        .then((resp) => resp.json())
        .then((data) => {
          setProject(projectUpdated);
          setServices(servicesUpdated);
          setMessage("Servi??o removido com sucesso!");
          setType("sucess");
          console.log(data);
        });
    }

    function createService(project){
        setMessage('')

        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()
    
        const lastServiceCost = lastService.cost
    
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
    
        // maximum value validation
        if (newCost > parseFloat(project.budget)) {
          setMessage('Or??amento ultrapassado, verifique o valor do servi??o!')
          setType('error')
          project.services.pop()
          return false
        }

        //add service cost to project total cost
        project.cost = newCost

        //update project
        fetch(`http://localhost:8000/projects/${project.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then((resp)=>resp.json())
        .then((data)=>{
            setshowServiceForm(false)
            console.log(data)
        })
        .catch((err)=>console.log(err))

    }

    function editPost(project){
        //budget validation
        setMessage('')

        if(project.budget < project.cost){
            setMessage('O or??amento n??o pode ser menor que o custo do projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:8000/projects/${project.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then(resp=>resp.json())
        .then((data)=>{
            setProject(data)
            setshowProjectForm(false)
            setMessage('Projeto atualizado!')
            setType('sucess')
        })
        .catch(err=>console.log(err))
    }

    return (
      <>
        {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message}/>}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? "Editar projeto" : "Fechar"}
                        </button>
                        {!showProjectForm ? (
                        <div className={styles.project_info}>
                            <p>
                                <span>Categoria: </span> {project.category.name}
                            </p>
                            <p>
                                <span>Total do or??amento: </span> R${project.budget}
                            </p>
                            <p>
                                <span>Total utilizado: </span> R${project.cost}
                            </p>
                        </div>
                        ) : (
                    <div className={styles.project_info}>
                        <ProjectForm
                        handleSubmit={editPost}
                        btnText="Concluir Edi????o"
                        projectData={project}
                        />
                    </div>
                )}
                </div>
                <div className={styles.service_form_container}>
                    <h2>Adicione um servi??o:</h2> 
                    <button className={styles.btn} onClick={toggleServiceForm}>
                        {!showServiceForm ? 'Adicionar um servi??o' : 'Fechar'}
                    </button> 
                    <div className={styles.project_info}>
                        {showServiceForm && (
                            <ServiceForm
                            handleSubmit={createService}
                            btnText="Adicionar Servi??o"
                            projectData={project}
                            />
                        )}
                    </div>      
                </div>
                <h2>Servi??os</h2>
                <Container customClass="start">
                    {services.length > 0 && 
                        services.map((services)=>(
                            <ServiceCard 
                            id={services.id}
                            name={services.name}
                            cost={services.cost}
                            description={services.description}
                            key={services.id}
                            handleRemove={removeService}
                            />
                        ))
                    }
                    {services.length == 0 && <p>N??o h?? servi??os cadastrados</p>}
                </Container>
            </Container>
          </div>
        ) : (
          <Loading />
        )}
      </>
    );
}

export default Project;