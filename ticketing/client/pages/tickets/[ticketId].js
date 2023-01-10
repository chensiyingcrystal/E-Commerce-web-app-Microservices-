const TicketShow = ({ ticket }) => {
    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>Price: {ticket.price}</h4>
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