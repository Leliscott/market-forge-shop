
import React from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  return (
    <section className="py-12 bg-slate-50 dark:bg-gray-800">
      <div className="container px-4 mx-auto">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-center md:text-3xl dark:text-white">Shop By Category</h2>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map(category => (
            <Link 
              key={category.id} 
              to={`/marketplace?category=${category.id}`}
              className="flex flex-col items-center justify-center p-4 text-center transition-colors bg-white dark:bg-gray-700 border rounded-lg gap-y-2 hover:border-brand-teal dark:hover:border-brand-teal"
            >
              <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-brand-teal">
                <span className="text-lg font-medium">{category.name.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium dark:text-white">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
