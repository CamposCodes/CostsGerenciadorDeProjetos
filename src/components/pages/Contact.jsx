import {FaFacebook, FaInstagram, FaLinkedin, FaTwitter} from "react-icons/fa";
import styles from "./Contact.module.css";
import  Container  from "../layout/Container/Container";

function Contact (){
    return (
        <div className={styles.contact_container}>
            <p>Nossas redes</p>
            <ul className={styles.contact_list}>
                <li>
                    <FaFacebook/>
                </li>
                <li>
                    <FaInstagram/>
                </li>
                <li>
                    <FaLinkedin/>
                </li>
                <li>
                    <FaTwitter/>
                </li>
            </ul>
        </div>
    )
}

export default Contact ;