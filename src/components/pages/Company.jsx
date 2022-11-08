import styles from "./Company.module.css";
import LinkButton from "../layout/LinkButton/LinkButton";
import company from "../../img/company.png"

function Company(){
    return(
        <section className={styles.sec_info}>
            <div className={styles.media}>
                <h1>Bem-vindo ao <span>Costs</span></h1>
                <img src={company} alt="Company"/>
                <p>
                    Mais do que um reflexo 
                    do compromisso com nossos 
                    clientes, nossas conquistas 
                    constroem uma base de solidez 
                    e credibilidade junto ao mercado.
                </p>
            </div>
            <h3>Descubra o que você pode fazer aqui !</h3>
            <div className={styles.links}>
                <LinkButton to="/newproject" text="Criar um projeto" />
                <LinkButton to="/projects" text="Ver seus projetos" />
                <LinkButton to="/contact" text="Entrar em contato" />
            </div>
        </section>
    );
}


export default Company;



