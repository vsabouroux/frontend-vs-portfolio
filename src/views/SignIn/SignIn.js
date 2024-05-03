import React, { useState } from "react";
import axios from "axios";
import * as PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, APP_ROUTES } from "../../utils/constants";
import { useUser } from "../../lib/customHooks";
import { storeInLocalStorage } from "../../lib/common";
import styles from "./SignIn.scss";
// import Footer from "../../components/Footer/Footer";
// import Header from "../../components/Header/Header";

//La fonction signIn vérifie d'abord si l'utilisateur existe déjà. 
//Si l'utilisateur existe (pour l'instant un seuil UI qui est le propriétaire de l'app) ds BDD on effectue la connexion.
function SignIn({ setUser }) {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  if (user || authenticated) {
    navigate(APP_ROUTES.DASHBOARD);
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, message: '' });
  const signIn = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'post',
        url: API_ROUTES.SIGN_IN,
        data: {
          email,
          password,
        },
      });
      if (!response?.data?.token) {
        setNotification({ error: true, message: 'Une erreur est survenue' });
        console.log('Something went wrong during signing in: ', response);
      } else {
        storeInLocalStorage(response.data.token, response.data.userId);
        setUser(response.data);
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      setNotification({ error: true, message: err.message });
      console.log('Some error occured during signing in: ', err);
    } finally {
      setIsLoading(false);
    }
  };
// Un seul UI autorisé pour cette application pour l'instant. Par la suite les clients pourraient déposer des documents, photos
  // const signUp = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios({
  //       method: 'POST',
  //       url: API_ROUTES.SIGN_UP,
  //       data: {
  //         email,
  //         password,
  //       },
  //     });
  //     if (!response?.data) {
  //       console.log('Something went wrong during signing up: ', response);
  //       return;
  //     }
  //     setNotification({ error: false, message: 'Votre compte a bien été créé, vous pouvez vous connecter' });
  //   } catch (err) {
  //     setNotification({ error: true, message: err.message });
  //     console.log('Some error occured during signing up: ', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const errorClass = notification.error ? styles.Error : null;
  return (
    <div className= "container">
      <div className={`${styles.Notification} ${errorClass}`}>
        {notification.message.length > 0 && <p>{notification.message}</p>}
      </div>
      <div className={styles.Form}>
        <label htmlFor={email}>
          <p>Adresse email</p>
          <input
            className=""
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
          />
        </label>
        <label htmlFor="password">
          <p>Mot de passe</p>
          <input
            // className="border-2 outline-none p-2 rounded-md"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
          />
        </label>
        <div className="submit">
          <button
            type="submit"
            // className="
            // flex justify-center
            // p-2 rounded-md w-1/2 self-center
            // bg-gray-800  text-white hover:bg-gray-800"
            onClick={signIn}
          >
            {isLoading ? <div className="button" /> : null}
            <span className="seconnecter">
              Se connecter
            </span>
          </button>
          {/* <span>OU</span>
          <button
            type="submit"
            className="
            flex justify-center
            p-2 rounded-md w-1/2 self-center
            bg-gray-800  text-white hover:bg-gray-800"
            onClick={signUp}
          >
            {
                isLoading
                  ? <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" /> : null
              }
            <span>
              {'S\'inscrire'}
            </span>
          </button> */}
        </div>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  setUser: PropTypes.func.isRequired,
};
export default SignIn;
