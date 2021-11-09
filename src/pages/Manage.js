import React from "react";
import { makeStyles, Typography, Button, Grid } from "@material-ui/core"; //put anything you want to import from material-ui in between the brackets i.e. {makeStyles, Typography, Grid}
import Popup from "../components/popup";
import LoginCard from "../components/loginCard";
import MyDrawer from "../components/drawer";
import axios from "axios";
import {findUser} from "../data/database"
import { useAuth0 } from "@auth0/auth0-react";
import { drawerSelection } from "../data/Redux/Actions/index";
import { useSelector } from "react-redux";

/*

    Our Palette colors are stored in the material-ui theme object
    #132232 ->  theme.palette.primary.main
    #203647 ->  theme.palette.secondary.main
    #007CC7 ->  theme.palette.info.main

    #EEFBFB ->  theme.palette.text.primary
    #4DA8DA ->  theme.palette.text.secondary

    Material-ui default theme object: https://mui.com/customization/default-theme/#main-content
*/

//This function is where you create your CSS styles for the page
const useStyles = makeStyles((theme) => {
  return {
    background: {
      backgroundColor: theme.palette.primary.main,
    },
    title:{
      height:"10vh", 
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      flexWrap: "nowrap",
      paddingTop: "10vh",
      alignItems: "center",
    }
  };
});

//this function is what creates the page that will be loaded by App.js
export default function Manage() {
  //variables needed in the return statement are created here
  const [filelist, setfilelist] = React.useState([]);
  const drawerSelection = useSelector((state) => state.drawer);
  let files 
  const { user } = useAuth0();
  const classes = useStyles();

  React.useEffect(()=>{
    axios(findUser(user.email))
      .then((res) => {
        const dbUser = res.data[0]; //get the user object from the Database
        files = dbUser.files
        for(let i = 0; i < files.length; i++){
            setfilelist(filelist => [...filelist, files[i].fileInfo.filename]);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    },[]);

  React.useEffect(()=>{
    console.log(drawerSelection)
  },[drawerSelection]);

  //The return statement returns JSX code (it is just HTML in javascript basically)
  //This is what will be returned when we call the function in App.js
  return (
    <div className={classes.background}>
      <div className={classes.title}> 
      <Typography variant= "h2" color="textPrimary"> Manage </Typography>
      </div>
      {/*BOTTOM PAGE */}
      <div className={classes.background}>
        {/* LIST DRAWER */}
        <Grid container>
          <Grid className={classes.drawer} item xs={12} md={3} lg={2}>
            <MyDrawer itemNames={filelist} />
            {console.log(filelist)}
          </Grid>
          {/* CHART */}
          <Grid className={classes.grid} item xs={12} md={9} lg={10}>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
