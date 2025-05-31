import { getCustomerData } from '../../services/ClientInfApi/GetClientInf';
import { useEffect, useState } from 'react';
import { CustomerData } from '../../services/ClientInfApi/GetClientInf';
import EditPasswordModal from './EditPasswordModal';
import EditDataChangedModal from './EditDataClient';
import { EditAdressModal } from './EditAdressModal';
import { ModalPersonalData } from './EditPersonalDataModal';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import styles from './ModalPersonalData.module.css';

export default function ProfilePageCustomer() {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdressModal, setShowAdressModal] = useState(false);
  const [showDataChangeModal, setShowDataChangeModal] = useState(false);
  const [showDataPersonalChangeModal, setDataPersonalChangeModal] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCustomerData();
        setCustomer(data);
        console.log(data);
        console.log('ProfileFunction is acting');
      } catch (error) {
        console.error('Error with getting data:', error);
      }
    }
    fetchData();
  }, []);
  const handleDataChangeModalClose = async () => {
    setShowDataChangeModal(false);
    try {
      const freshData = await getCustomerData();
      setCustomer(freshData);
    } catch (error) {
      console.error('Ошибка при обновлении данных после редактирования:', error);
      Toastify({
        text: 'The information has not been updated',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
          background: '#FF6B6B',
          color: '#fff',
        },
      }).showToast();
    }
  };
  const handleDataChangeAdressModalClose = async () => {
    setShowAdressModal(false);
    try {
      const freshData = await getCustomerData();
      setCustomer(freshData);
    } catch (error) {
      console.error('Ошибка при обновлении данных после редактирования:', error);
      Toastify({
        text: 'The information in the page has not been updated',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
          background: '#FF6B6B',
          color: '#fff',
        },
      }).showToast();
    }
  };
  const handleDataChangePersonalModalClose = async () => {
    setDataPersonalChangeModal(false);
    try {
      const freshData = await getCustomerData();
      setCustomer(freshData);
    } catch (error) {
      console.error('Ошибка при обновлении данных после редактирования:', error);
      Toastify({
        text: 'The information in the page has not been updated',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
          background: '#FF6B6B',
          color: '#fff',
        },
      }).showToast();
    }
  };

  if (!customer) return <div>You are not logged in! Please log in!</div>;
  const {
    id,
    version,
    email,
    firstName,
    lastName,
    dateOfBirth,
    shippingAddressIds,
    billingAddressIds,
    addresses,
  } = customer;
  sessionStorage.setItem('ct_customer_email', email);
  const enrichedAddresses = addresses.map((address) => ({
    ...address,
    isShipping: shippingAddressIds.includes(address.id),
    isBilling: billingAddressIds.includes(address.id),
  }));

  console.log(enrichedAddresses);

  return (
    <div className={styles.generalBlockClient}>
      <h2 className={styles.titleStage}>Profil page</h2>
      <div className="client-block">
        <div className={styles.frostedContainer}>
          <div className={styles.personalPart}>
            <p>Name</p>
            <p> {firstName} </p>
          </div>
          <div className={styles.personalPart}>
            <p>Second Name</p>
            <p> {lastName} </p>
          </div>
          <div className={styles.personalPart}>
            <p>Day of birth</p>
            <p> {dateOfBirth} </p>
          </div>
          <div className={styles.personalPart}>
            <p>Email</p>
            <p> {email} </p>
          </div>
        </div>

        <button type="button" className={styles.button} onClick={() => setShowPasswordModal(true)}>
          Edit password
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => setDataPersonalChangeModal(true)}
        >
          Edit only personal data
        </button>
      </div>
      <div className={styles.frostedContainer}>
        {enrichedAddresses.map((address) => (
          <div
            key={address.id}
            style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}
          >
            <p>
              <strong>Adress:</strong> {address.streetName}, {address.city}, {address.postalCode},{' '}
              {address.country}
            </p>
            <p>
              {address.isShipping && (
                <span style={{ color: 'green', marginRight: 10 }}>Shipping</span>
              )}
              {address.isBilling && <span style={{ color: 'green' }}> Billing</span>}
              {!address.isShipping && !address.isBilling && (
                <span style={{ color: 'gray' }}>Only adress</span>
              )}
            </p>
          </div>
        ))}
        <button type="button" className={styles.button} onClick={() => setShowAdressModal(true)}>
          Edit adresses
        </button>
      </div>
      <button type="button" className={styles.button} onClick={() => setShowDataChangeModal(true)}>
        Edit profile
      </button>
      <EditPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        id={id}
        version={version}
      />
      <EditDataChangedModal
        isOpen={showDataChangeModal}
        onClose={handleDataChangeModalClose}
        id={id}
        version={version}
        addresses={addresses}
        email={email}
        firstName={firstName}
        lastName={lastName}
        dateOfBirth={dateOfBirth}
        shippingAddressIds={shippingAddressIds}
        billingAddressIds={billingAddressIds}
      />
      <EditAdressModal
        isOpen={showAdressModal}
        id={id}
        version={version}
        addresses={addresses}
        onClose={handleDataChangeAdressModalClose}
        email={email}
        shippingAddressIds={shippingAddressIds}
        billingAddressIds={billingAddressIds}
      />
      <ModalPersonalData
        isOpen={showDataPersonalChangeModal}
        id={id}
        version={version}
        onClose={handleDataChangePersonalModalClose}
        firstName={firstName}
        lastName={lastName}
        dateOfBirth={dateOfBirth}
        email={email}
      />
    </div>
  );
}
