import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {

    return (
        <div>
            <Header currentUser={currentUser}/>
            <div className='container'>
            <Component currentUser={currentUser} {...pageProps} /> 
            </div>
        </div>
        );
};
//app component is the place where components are gathered and each component is going to follow its template
//each time the component is called to render, it will first call the App's getinitialPops function
//if the app's getinitialPops function is called, the landing page's getinitialPops function will not be called. Thus, we need to call that manually
//landing page's getinitialPops function need to get all tickets data so that user not registered can also see the home page with full list of tickets
AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
    //manually call the getInitialProps of the landing page
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }

    return {
        pageProps, //pass the pageProp to the landing page component
        currentUser: data.currentUser
    }



};

export default AppComponent;