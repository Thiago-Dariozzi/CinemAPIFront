import { ProgressBar, Table } from 'react-bootstrap';
import { formatTime } from '../../utils/dates';

const FULL_THRESHOLD = 80;
const LOW_THRESHOLD = 30;

const variantFor = (percentage) => {
    if (percentage >= FULL_THRESHOLD) return "success";
    if (percentage >= LOW_THRESHOLD) return "warning";
    return "danger";
};

const formatPercentage = (value) => `${value.toLocaleString('es-AR', { maximumFractionDigits: 1 })} %`;

const OccupancyTable = ({ report }) => (
    <Table responsive hover variant="dark" className="report-table">
        <caption className="report-table__caption">Ocupación por función</caption>
        <thead>
            <tr>
                <th scope="col">Hora</th>
                <th scope="col">Película</th>
                <th scope="col">Sala</th>
                <th scope="col" className="text-end">Vendidas</th>
                <th scope="col" className="report-table__bar-col">Ocupación</th>
            </tr>
        </thead>
        <tbody>
            {report.showtimes.map((showtime) => (
                <tr key={showtime.showtimeId}>
                    <td>{formatTime(showtime.startTime)}</td>
                    <th scope="row">{showtime.movieTitle}</th>
                    <td>{showtime.screenName}</td>
                    <td className="text-end">{showtime.soldSeats} / {showtime.totalSeats}</td>
                    <td>
                        <div className="occupancy-cell">
                            <ProgressBar
                                now={Math.min(showtime.occupancyPercentage, 100)}
                                variant={variantFor(showtime.occupancyPercentage)}
                                className="occupancy-cell__bar"
                                aria-hidden="true"
                            />
                            <span className="occupancy-cell__value">{formatPercentage(showtime.occupancyPercentage)}</span>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
        <tfoot>
            <tr>
                <th scope="row" colSpan={3}>Total del día</th>
                <td className="text-end">{report.soldSeats} / {report.totalSeats}</td>
                <td>{formatPercentage(report.occupancyPercentage)}</td>
            </tr>
        </tfoot>
    </Table>
);

export default OccupancyTable;
