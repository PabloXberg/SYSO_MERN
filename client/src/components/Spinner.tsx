import Spinner from 'react-bootstrap/Spinner';
import '../index.css'

function SpinnerShare() {
  return (
    <div className="spinner-container">
      <Spinner animation="border" className="custom-spinner"  variant="danger"/>
    </div>
  );
}

export default SpinnerShare;