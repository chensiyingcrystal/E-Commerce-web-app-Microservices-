import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    });
//only rendered once(with [] )
    useEffect(() => {
        const findTimeLeft = () => {
            // //calculate number of seconds left
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        //invoke the function right away at the first second
        findTimeLeft();
        //call the function once every second
        const timeId = setInterval(findTimeLeft, 1000);
        setInterval(findTimeLeft, 1000);

        //called when we navigate away from this component or get re-rendered
        return () => {
            clearInterval(timeId); //clear interval so it will not be called forever
        };
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order Expired...</div>;
    }

    return (
        <div>
            Time left to pay: { timeLeft } seconds...
            <StripeCheckout
                token={({id}) => doRequest({ token: id })}
                stripeKey="pk_test_51MOMFMIkbcyVWFajaom5rHoyJGMCrKs2ORyzjw2zQkg8A2zoxKem4Rn7Jsg94AEAAVjgzg1gvsTDjqHZSCoMCdz200dobj1bHW"
                amount = {order.ticket.price * 100}
                email = {currentUser.email}
            />
            {errors}
        </div>
    );

}

OrderShow.getInitialProps = async(context, client) => {
    const {orderId} = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;