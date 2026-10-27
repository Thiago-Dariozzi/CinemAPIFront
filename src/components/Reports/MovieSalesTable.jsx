import { Table } from 'react-bootstrap';
import { formatMoney } from '../../utils/money';

const MovieSalesTable = ({ report }) => (
    <Table responsive hover variant="dark" className="report-table">
        <caption className="report-table__caption">Ventas por película (de mayor a menor recaudación)</caption>
        <thead>
            <tr>
                <th scope="col">Película</th>
                <th scope="col" className="text-end">Compras</th>
                <th scope="col" className="text-end">Entradas</th>
                <th scope="col" className="text-end">Entradas ($)</th>
                <th scope="col" className="text-end">Cargos</th>
                <th scope="col" className="text-end">Total</th>
            </tr>
        </thead>
        <tbody>
            {report.byMovie.map((movie) => (
                <tr key={movie.movieId}>
                    <th scope="row">{movie.movieTitle}</th>
                    <td className="text-end">{movie.purchases}</td>
                    <td className="text-end">{movie.ticketsSold}</td>
                    <td className="text-end">{formatMoney(movie.ticketRevenue)}</td>
                    <td className="text-end">{formatMoney(movie.feesCollected)}</td>
                    <td className="text-end">{formatMoney(movie.totalRevenue)}</td>
                </tr>
            ))}
        </tbody>
        <tfoot>
            <tr>
                <th scope="row">Total</th>
                <td className="text-end">{report.purchases}</td>
                <td className="text-end">{report.ticketsSold}</td>
                <td className="text-end">{formatMoney(report.ticketRevenue)}</td>
                <td className="text-end">{formatMoney(report.feesCollected)}</td>
                <td className="text-end">{formatMoney(report.totalRevenue)}</td>
            </tr>
        </tfoot>
    </Table>
);

export default MovieSalesTable;
