import React from 'react';
import {Route} from 'react-router-dom';
import {Main, signUp, Forgot, Profile, setProject} from './../pages/index'

const App = () => {
    return(
        <div>
            <Route exact path="/" component={Main} />
            <Route path="/Join" component={signUp} />
            <Route path="/Forgot" component={Forgot} />
            <Route path = '/profile' component = {Profile}/>
            <Route path = "/setProject" component = {setProject}/>
        </div>
    )
};
export default App;