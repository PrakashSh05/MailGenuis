import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import SearchBar from '../components/features/history/SearchBar';
import FilterPanel from '../components/features/history/FilterPanel';
import EmailCard from '../components/features/history/EmailCard';
import Pagination from '../components/features/history/Pagination';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Toast from '../components/ui/Toast';
import emailService from '../services/emailService';
import { Mail, SearchX } from 'lucide-react';
import CopyButton from '../components/ui/CopyButton';
import DownloadButton from '../components/ui/DownloadButton';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Pagination & Filters
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  // Modals
  const [viewEmail, setViewEmail] = useState(null);
  const [deleteEmail, setDeleteEmail] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 12,
        search: search || undefined,
        tone: activeFilter && activeFilter !== 'FAVORITES' ? activeFilter : undefined,
        isFavorite: activeFilter === 'FAVORITES' ? true : undefined
      };

      const response = await emailService.getEmailHistory(params);
      setEmails(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setToast({ message: 'Failed to load history.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Reset page when search or filters change
  const handleSearch = (val) => {
    setSearch(val);
    setPage(0);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(0);
  };

  const handleToggleFavorite = async (id, currentStatus) => {
    try {
      await emailService.toggleFavorite(id);
      setEmails(emails.map(e => e.id === id ? { ...e, isFavorite: !currentStatus } : e));
      if (viewEmail && viewEmail.id === id) {
        setViewEmail({ ...viewEmail, isFavorite: !currentStatus });
      }
    } catch (err) {
      setToast({ message: 'Failed to update favorite status.', type: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEmail) return;
    setIsDeleting(true);
    try {
      await emailService.deleteEmail(deleteEmail.id);
      setToast({ message: 'Email deleted successfully.', type: 'success' });
      setDeleteEmail(null);
      if (viewEmail && viewEmail.id === deleteEmail.id) {
        setViewEmail(null);
      }
      fetchHistory(); // Refresh list
    } catch (err) {
      setToast({ message: 'Failed to delete email.', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRegenerate = (emailData) => {
    // We could pass state to generator, but for simplicity we'll just navigate
    // A robust app would use Context or state management to prepopulate the form.
    navigate('/generate', { state: { emailData } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 flex flex-col h-full min-h-[calc(100vh-8rem)]">
      <PageHeader 
        title="Email History" 
        description="Browse, search, and manage your previously generated emails."
      />

      <div className="bg-warm-primary dark:bg-warm-primary rounded-xl shadow-sm border border-editorial-border dark:border-editorial-border p-4 sm:p-6 flex-1 flex flex-col">
        <div className="mb-6 space-y-4">
          <SearchBar onSearch={handleSearch} />
          <FilterPanel activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-editorial-border dark:border-editorial-border rounded-xl p-5">
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-8 w-full mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty States */}
        {!loading && emails.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-12">
            <EmptyState
              icon={search || activeFilter ? SearchX : Mail}
              title={search || activeFilter ? "No matches found" : "Your history is empty"}
              description={search || activeFilter ? "Try adjusting your search terms or filters." : "Start generating emails to see them appear here."}
              action={(!search && !activeFilter) ? { label: 'Generate Email', onClick: () => navigate('/generate') } : null}
            />
          </div>
        )}

        {/* Email Grid */}
        {!loading && emails.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 items-stretch">
            {emails.map(email => (
              <EmailCard
                key={email.id}
                email={email}
                onView={setViewEmail}
                onDelete={setDeleteEmail}
                onToggleFavorite={handleToggleFavorite}
                onRegenerate={handleRegenerate}
              />
            ))}
          </div>
        )}

        {/* Pagination aligned to bottom */}
        <div className="mt-auto">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </div>
      </div>

      {/* View Email Modal */}
      <Modal
        isOpen={!!viewEmail}
        onClose={() => setViewEmail(null)}
        title="Email Details"
      >
        {viewEmail && (
          <div className="p-4 sm:p-6">
            <h3 className="text-xl font-bold text-editorial-primary dark:text-editorial-primary mb-4">
              {viewEmail.subject}
            </h3>
            <div className="whitespace-pre-wrap text-editorial-secondary dark:text-editorial-secondary font-serif mb-6 leading-relaxed bg-warm-secondary dark:bg-warm-secondary p-4 rounded-lg border border-slate-100 dark:border-editorial-border">
              {viewEmail.body}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-editorial-border pt-4">
              <CopyButton text={`${viewEmail.subject}\n\n${viewEmail.body}`} />
              <DownloadButton text={`${viewEmail.subject}\n\n${viewEmail.body}`} subject={viewEmail.subject} />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteEmail}
        onClose={() => setDeleteEmail(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Email"
        message="Are you sure you want to delete this email? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
