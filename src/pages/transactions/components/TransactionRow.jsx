import './TransactionRow.css'
import { DB } from '../../../utils/DB';
import { useMediaResolution } from '../../../contexts/MediaResolution';

function TableRow({ data }) {
    const { isMobile } = useMediaResolution();

    let amount = `${data.amount > 0 ? '+' : '-'}$${parseFloat(Math.abs(data.amount)).toFixed(2)}`;

    return isMobile ?
    (
        <tr>
            <td>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <div className='image-name-container'>
                                <img src={DB.imageUrl(data.image)} alt="" />
                                <b><p>{data.name}</p></b>
                            </div>
                        </td>
                        <td>{data.category}</td>
                    </tr>
                    <tr>
                        <td>{data.date}</td>
                        <td className={`amount ${data.amount > 0 ? 'plus' : ''}`}>{amount}</td>
                    </tr>
                </tbody>
            </table>
            </td>
        </tr>        
    ) :
    (
        <tr>
            <td>
                <div className='image-name-container'>
                    <img src={DB.imageUrl(data.image)} alt="" />
                    <b><p>{data.name}</p></b>
                </div>
            </td>
            <td>{data.category}</td>
            <td>{data.date}</td>
            <td className={`amount ${data.amount > 0 ? 'plus' : ''}`}>{amount}</td>
        </tr>        
    )
}

export default TableRow;
