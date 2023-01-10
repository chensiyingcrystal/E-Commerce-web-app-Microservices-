import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {

    return (
        <div>
            <Header currentUser={currentUser}/>
            <Component currentUser={currentUser} {...pageProps} /> 
        </div>
        );
};

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