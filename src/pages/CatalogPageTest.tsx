import { Link, useLoaderData } from 'react-router-dom';

const CatalogPageTest = () => {
  const products = useLoaderData();
  console.log('Products data:', products);

  return (
    <>
      <h1>Catalog — page under development</h1>
      <ul>
        {products.map((product) => {
          const { id, name, description, masterVariant } = product;
          const imageUrl = masterVariant.images?.[0]?.url;
          const priceInfo = masterVariant.prices?.[0]?.value;

          return (
            <li key={id}>
              <Link to={`/catalog/${name.en}`}>
                <h2>{name.ru || name.en}</h2>
                {imageUrl && (
                  <img src={imageUrl} alt={name.ru || name.en} style={{ maxWidth: '200px' }} />
                )}
                <p>{description.ru || description.en}</p>
                <p>
                  Price: {priceInfo && priceInfo.centAmount / 100} {priceInfo.currencyCode}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default CatalogPageTest;
