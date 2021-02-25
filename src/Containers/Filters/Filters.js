import React, { Component} from 'react';
import classes from './Filters.module.css';

class Filters extends Component {
    render(){
        return(
            <div className={classes.appform}>

            <div className={classes.appformgroup}>
              <input className={classes.appformcontrol} placeholder="NAME" value="Krisantus Wanandi"/>
            </div>

            <div className={classes.appformgroup}>
              <input className={classes.appformcontrol} placeholder="EMAIL"/>
            </div>
            
            
            <div className={classes.appformgroup}>
              <input className={classes.appformcontrol} placeholder="CONTACT NO"/>
            </div>
            
            
            {/* <div className={classes.app-form-group message}>
              <input className={classes.app-form-control} placeholder="MESSAGE"/>
            </div>
            
            <div className={classes.app-form-group buttons}>
              <button className={classes.app-form-button}>CANCEL</button>
              <button className={classes.app-form-button}>SEND</button>
            </div> */}
          
          </div>

        )
    }


}

export default Filters;