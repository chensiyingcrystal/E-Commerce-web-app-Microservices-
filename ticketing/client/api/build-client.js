import axios from 'axios';

const buildClient = ({ req }) => {
    if (typeof window === 'undefined') {
        //we are on the server!
        //requests should be made to http://ingress-nginx-controller.xxxx

        return axios.create({
            //form: 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local', 
            headers: req.headers
                //Host: req.headers //'ticketing.dev'
        });
 

    } else {
        //we are on the browser!
        //request can be made with a base url of ''
        //browser automatically handle the header for use
        return axios.create({
            baseURL: '/',
        });
        
    }
    return null;

};

export default buildClient;