import React, { useContext } from "react";
import { GraphQLClient} from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import {ME_QUERY} from "../../graphql/queries";
import {BASE_URL} from "../../Client"

import Context from '../../context';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try{
      const idToken = googleUser.getAuthResponse().id_token;
      console.log(googleUser)
      console.log({idToken});
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken}
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me});
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn()})
    } catch (err) {
      onFailure(err);
    }
  }

  const onFailure = err => {
    console.error("error loggin in ", err);
    dispatch({ type: "IS_LOGGED_IN", payload: false})
  }

  return ( 
    <div className={classes.root}>
      <Typography
       component ='h1'
       variant = 'h3'
       gutterBottom
       noWrap
       style = {{color: "rbg(66, 133, 244)"}}
       >
        Welcome
      </Typography>
      <GoogleLogin 
      clientId='973900030390-cbcmm65kkng5qhiru3mnchqee4o066kk.apps.googleusercontent.com'
      onSuccess={onSuccess}
      onFailure= {onFailure}
      isSignedIn = {true}
      buttonText = 'Login with Google'
      theme = 'dark' />
    </div> );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
