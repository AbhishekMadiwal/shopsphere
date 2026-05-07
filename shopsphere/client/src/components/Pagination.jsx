import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(1, currentPage - delta);
  const right = Math.min(totalPages, currentPage + delta);

  for (let i = left; i <= right; i++) pages.push(i);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center flex-wrap gap-1 mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link d-flex align-items-center gap-1" onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeft size={16} /> Prev
          </button>
        </li>
        {left > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(1)}>1</button>
            </li>
            {left > 2 && <li className="page-item disabled"><span className="page-link">…</span></li>}
          </>
        )}
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>{p}</button>
          </li>
        ))}
        {right < totalPages && (
          <>
            {right < totalPages - 1 && <li className="page-item disabled"><span className="page-link">…</span></li>}
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
            </li>
          </>
        )}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link d-flex align-items-center gap-1" onClick={() => onPageChange(currentPage + 1)}>
            Next <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
