// Pagination.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center mt-4 mb-8">
            <button
                onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
                className={`mx-1 px-3 py-1 border rounded ${currentPage > 1 ? 'bg-orange-500 text-stone-200' : 'bg-white text-orange-600'}`}
            >
                Prev
            </button>
            {Array(totalPages).fill(null).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onPageChange(index + 1)}
                    className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-orange-500 text-stone-200' : 'bg-white text-orange-600'}`}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
                className={`mx-1 px-3 py-1 border rounded ${currentPage < totalPages ? 'bg-orange-500 text-stone-200' : 'bg-white text-orange-600'}`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;