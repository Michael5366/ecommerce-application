import { getCustomerData } from "../../services/ClientInfApi/GetClientInf";
import { useEffect, useState } from "react";

export default function ProfilePageCustomer() {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCustomerData();
        setCustomer(data);
        console.log(data)
        console.log("ProfileFunction is acting");
      } catch (error) {
        console.error("Error with getting data:", error);
      }
    }
    fetchData();
      }, []);
  if (!customer) return <div>Загрузка...</div>;
  return (
    <div>
      <div className="client-block">
        <div className="personal-information-block">
            <div className="personal-part">
              <p>Name</p>
              <p>Name-value</p>
            </div>
                        <div className="personal-part">
              <p>Second Name</p>
              <p>Second Name-value</p>
            </div>
                        <div className="personal-part">
              <p>Day of birth</p>
              <p>Day of birth-value</p>
            </div>
        </div>
        <div className="adress-block">
          <AddingAdressValue/>
        </div>
      </div>
    </div>
  );
}

export function AddingAdressValue () {
  return (
    <div className="adress-part">
      <div className="street">Street</div>
      <div className="city">City</div>
      <div className="postal-code">Postal Code</div>
      <div className="country">Country</div>
    </div>
  )
}

