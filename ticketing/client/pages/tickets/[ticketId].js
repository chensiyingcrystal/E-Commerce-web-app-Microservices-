import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => {
            //navigate to order show page
            Router.push(
                '/orders/[orderId]',  //generic url(same to directory path)
                `/orders/${order.id}` //real url
            )

        }
    });

    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>Price: {ticket.price}</h4>
            {errors}
            <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
        </div> 
    );
};

TicketShow.getInitialProps = async (context, client) => {
    //extract id from url
    const { ticketId } = context.query;
    //make request to ticket service
    const { data } = await client.get(`/api/tickets/${ticketId}`);

    return { ticket: data };
}

export default TicketShow;