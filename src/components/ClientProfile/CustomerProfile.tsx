import { getCustomerData } from '../../services/ClientInfApi/GetClientInf';
import { useEffect, useState } from 'react';
import { CustomerData } from '../../services/ClientInfApi/GetClientInf';
import EditPasswordModal from './EditPasswordModal';
import EditDataChangedModal from './EditDataClient';
import { EditAdressModal } from './EditAdressModal';

export default function ProfilePageCustomer() {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdressModal, setShowAdressModal] = useState(false);
  const [showDataChangeModal, setShowDataChangeModal] = useState(false);

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
    }
  };
    const handleDataChangeAdressModalClose = async () => {
    setShowAdressModal(false);
    try {
      const freshData = await getCustomerData();
      setCustomer(freshData);
    } catch (error) {
      console.error('Ошибка при обновлении данных после редактирования:', error);
    }
  };

  if (!customer) return <div>Загрузка...</div>;
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
  const enrichedAddresses = addresses.map((address) => ({
    ...address,
    isShipping: shippingAddressIds.includes(address.id),
    isBilling: billingAddressIds.includes(address.id),
  }));

  console.log(enrichedAddresses);


  return (
    <div>
      <div className="client-block">
        <div className="personal-information-block">
          <div className="personal-part">
            <p>Name</p>
            <p> {firstName} </p>
          </div>
          <div className="personal-part">
            <p>Second Name</p>
            <p> {lastName} </p>
          </div>
          <div className="personal-part">
            <p>Day of birth</p>
            <p> {dateOfBirth} </p>
          </div>
        </div>

        <button type="button" onClick={() => setShowPasswordModal(true)}>
          Edit password
        </button>
      </div>
      <div className="adress-block">
        {enrichedAddresses.map((address) => (
          <div
            key={address.id}
            style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}
          >
            <p>
              <strong>Адрес:</strong> {address.streetName}, {address.city}, {address.postalCode},{' '}
              {address.country}
            </p>
            <p>
              {address.isShipping && (
                <span style={{ color: 'green', marginRight: 10 }}>Shipping</span>
              )}
              {address.isBilling && <span style={{ color: 'blue' }}> Billing</span>}
              {!address.isShipping && !address.isBilling && (
                <span style={{ color: 'gray' }}>Без меток</span>
              )}
            </p>
          </div>
        ))}
        <button type="button" onClick={() => setShowAdressModal(true)}>
          Edit adresses
        </button>
      </div>
      <button type="button" onClick={() => setShowDataChangeModal(true)}>
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
    </div>
  );
}
