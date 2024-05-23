import spinner from '../images/color-spray.gif'; // Ajusta la ruta según sea necesario

const SpraySpinner = () => {
  return (
    <div style={styles.spinnerContainer}>
      <img src={spinner} alt="Loading..." style={styles.spinner} />
    </div>
  );
};

const styles = {
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  spinner: {
    width: '4rem', // Ajusta el tamaño según sea necesario
    height: '4rem',
  },
};

export default SpraySpinner;