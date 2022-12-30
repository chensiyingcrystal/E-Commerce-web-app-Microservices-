import buildClient from '../api/build-client';

const landing = ({ currentUser }) => {
    //making request from the browser
    //axios.get('/api/users/currentuser');
    return currentUser ? (<h1>You are signed in</h1>)
        : (
        <h1>You are not singed in</h1>
        );
};
//when appcomponent has get initialprops, this function will not be called
landing.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return data;
};


export default landing;
