import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';
import { Category } from '../../types/productTypes';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface BreadcrumbsProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const buildBreadcrumbs = () => {
    const breadcrumbs = [];
    breadcrumbs.push({
      id: '',
      name: 'All products',
      path: '/catalog',
      isCurrent: !selectedCategory,
    });

    if (selectedCategory) {
      let currentCategory = categories.find((category) => category.id === selectedCategory);
      const categoryChain = [];

      while (currentCategory) {
        categoryChain.unshift(currentCategory);
        currentCategory = categories.find(
          (category) => category.id === currentCategory?.parent?.id
        );
      }

      categoryChain.forEach((category, index) => {
        breadcrumbs.push({
          id: category.id,
          name: category.name?.en || category.id,
          path: `/catalog/${category.name?.en?.toLowerCase().replace(/\s+/g, '-') || ''}`,
          isCurrent: index === categoryChain.length - 1,
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.breadcrumbList}>
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {index > 0 && <ChevronRightIcon className={styles.separator} />}
            {crumb.isCurrent ? (
              <span className={styles.currentCrumb} aria-current="page">
                {crumb.name}
              </span>
            ) : index === 0 ? (
              <span className={styles.homeIconContainer} onClick={() => onCategorySelect('')}>
                <HomeIcon className={styles.homeIcon} />
              </span>
            ) : (
              <Link
                to={crumb.path}
                className={styles.breadcrumbLink}
                onClick={(e) => {
                  e.preventDefault();
                  onCategorySelect(crumb.id);
                }}
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
