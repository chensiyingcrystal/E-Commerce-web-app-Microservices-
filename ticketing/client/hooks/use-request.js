import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);
//default props: empty object
//need to pass: payment(passing in token)
    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, 
                {...body, ...props}); //... are called spread attributes which, as the name represents, it allows an expression to be expanded.
            
            if (onSuccess) {
                onSuccess(response.data);
            }
            
            return response.data;
        } catch (err) {
            setErrors(
                <div className='alert alert-danger'>
                    <h4>Oooops....</h4>
                    <ul className='my-0'>
                        {err.response.data.errors?.map(err => (
                            <li key={err.mesasge}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );

        }

    };

    return { doRequest, errors };

};


export default useRequest;