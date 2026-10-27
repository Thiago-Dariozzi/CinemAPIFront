import TicketDashboard from '../components/Tickets/TicketDashboard';
import { useSession } from '../hooks/useSession';

const UserTickets = () => {
    const session = useSession();
    return <TicketDashboard scopeUserId={session.userId} />;
};

export default UserTickets;
