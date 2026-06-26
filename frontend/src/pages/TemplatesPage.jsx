import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import SearchBar from '../components/features/history/SearchBar';
import FilterPanel from '../components/features/history/FilterPanel';
import Pagination from '../components/features/history/Pagination';
import PromptCard from '../components/features/templates/PromptCard';
import TemplateCard from '../components/features/templates/TemplateCard';
import TemplateModal from '../components/features/templates/TemplateModal';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Toast from '../components/ui/Toast';
import templateService from '../services/templateService';
import { Plus, BookOpen, Layers, SearchX } from 'lucide-react';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'custom'
  const [toast, setToast] = useState(null);

  // Prompt Library State
  const [libraryData, setLibraryData] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(true);

  // Custom Templates State
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  // Modals
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  
  const [deletingTemplate, setDeletingTemplate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [previewPrompt, setPreviewPrompt] = useState(null);

  // Fetch Library
  useEffect(() => {
    if (activeTab === 'library' && libraryData.length === 0) {
      const fetchLibrary = async () => {
        try {
          setLibraryLoading(true);
          const res = await templateService.getLibrary();
          setLibraryData(res.data.categories || []);
        } catch (err) {
          setToast({ message: 'Failed to load prompt library.', type: 'error' });
        } finally {
          setLibraryLoading(false);
        }
      };
      fetchLibrary();
    }
  }, [activeTab, libraryData.length]);

  // Fetch Custom Templates
  const fetchTemplates = useCallback(async () => {
    if (activeTab !== 'custom') return;
    try {
      setTemplatesLoading(true);
      const params = {
        page,
        size: 12,
        search: search || undefined,
        tone: activeFilter || undefined
      };
      const res = await templateService.getTemplates(params);
      setTemplates(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setToast({ message: 'Failed to load custom templates.', type: 'error' });
    } finally {
      setTemplatesLoading(false);
    }
  }, [activeTab, page, search, activeFilter]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Handlers
  const handleSearch = (val) => {
    setSearch(val);
    setPage(0);
  };

  const handleFilterChange = (filter) => {
    if (filter === 'FAVORITES') return; // User templates don't have favorites
    setActiveFilter(filter);
    setPage(0);
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (data) => {
    setIsSavingTemplate(true);
    try {
      if (editingTemplate) {
        await templateService.updateTemplate(editingTemplate.id, data);
        setToast({ message: 'Template updated successfully.', type: 'success' });
      } else {
        await templateService.createTemplate(data);
        setToast({ message: 'Template created successfully.', type: 'success' });
      }
      setIsTemplateModalOpen(false);
      fetchTemplates(); // Refresh
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || 'Failed to save template. Please check for duplicate names.', 
        type: 'error' 
      });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTemplate) return;
    setIsDeleting(true);
    try {
      await templateService.deleteTemplate(deletingTemplate.id);
      setToast({ message: 'Template deleted successfully.', type: 'success' });
      setDeletingTemplate(null);
      fetchTemplates();
    } catch (err) {
      setToast({ message: 'Failed to delete template.', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUsePrompt = (prompt) => {
    navigate('/generate', {
      state: {
        emailData: {
          purpose: prompt.description,
          tone: prompt.defaultTone,
          length: prompt.defaultLength,
          language: 'ENGLISH'
        }
      }
    });
  };

  const handleUseTemplate = (template) => {
    navigate('/generate', {
      state: {
        emailData: {
          purpose: template.body,
          tone: template.tone,
          length: template.length,
          language: template.language
        }
      }
    });
  };

  return (
    <div className="w-full space-y-6 flex flex-col flex-1">
      <PageHeader 
        title="Templates & Library" 
        description="Browse predefined system prompts or manage your own custom reusable structures."
        actions={
          activeTab === 'custom' && (
            <Button onClick={handleCreateNew} icon={Plus}>
              New Template
            </Button>
          )
        }
      />

      <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-glass border border-black/10 dark:border-white/10 p-4 sm:p-6 flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {/* HUD Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-50 z-0"></div>
        <div className="relative z-10 flex flex-col h-full">
        {/* Tabs */}
        <div className="border-b border-editorial-border dark:border-editorial-border mb-6 shrink-0">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('library')}
              className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'library'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-editorial-secondary hover:text-editorial-primary hover:border-editorial-border dark:text-editorial-secondary dark:hover:text-editorial-secondary dark:hover:border-editorial-border'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Prompt Library
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'custom'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-editorial-secondary hover:text-editorial-primary hover:border-editorial-border dark:text-editorial-secondary dark:hover:text-editorial-secondary dark:hover:border-editorial-border'
              }`}
            >
              <Layers className="h-5 w-5 mr-2" />
              My Templates
            </button>
          </nav>
        </div>

        <div className="flex-1 flex flex-col min-h-0 mb-4">
          {/* Tab Content: Prompt Library */}
          {activeTab === 'library' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {libraryLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border border-editorial-border dark:border-editorial-border rounded-xl p-5"><Skeleton className="h-24 w-full" /></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {libraryData.map(category => (
                    <div key={category.category}>
                      <h3 className="text-lg font-bold text-editorial-primary dark:text-editorial-primary mb-4 border-b border-slate-100 dark:border-editorial-border pb-2">
                        {category.category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {category.items.map(item => (
                          <PromptCard 
                            key={item.id} 
                            prompt={item} 
                            onPreview={setPreviewPrompt} 
                            onUse={handleUsePrompt} 
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: My Templates */}
          {activeTab === 'custom' && (
            <div className="flex-1 flex flex-col h-full">
              <div className="mb-6 space-y-4 shrink-0">
                <SearchBar onSearch={handleSearch} placeholder="Search your templates..." />
                <FilterPanel activeFilter={activeFilter} onFilterChange={handleFilterChange} showFavorites={false} />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                {templatesLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="border border-editorial-border dark:border-editorial-border rounded-xl p-5"><Skeleton className="h-32 w-full" /></div>
                    ))}
                  </div>
                )}

                {!templatesLoading && templates.length === 0 && (
                  <div className="flex-1 flex items-center justify-center py-12">
                    <EmptyState
                      icon={search || activeFilter ? SearchX : Layers}
                      title={search || activeFilter ? "No matches found" : "No custom templates yet"}
                      description={search || activeFilter ? "Try adjusting your search terms or filters." : "Create a reusable template for your frequent email structures."}
                      action={(!search && !activeFilter) ? { label: 'Create Template', onClick: handleCreateNew } : null}
                    />
                  </div>
                )}

                {!templatesLoading && templates.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 items-stretch">
                    {templates.map(template => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onEdit={handleEdit}
                        onDelete={setDeletingTemplate}
                        onUse={handleUseTemplate}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto relative z-10 pt-4 border-t border-black/10 dark:border-white/10 shrink-0">
                <Pagination 
                  currentPage={page} 
                  totalPages={totalPages} 
                  onPageChange={setPage} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Library Prompt Preview Modal */}
      <Modal
        isOpen={!!previewPrompt}
        onClose={() => setPreviewPrompt(null)}
        title="Prompt Preview"
      >
        {previewPrompt && (
          <div className="p-4 sm:p-6 space-y-4">
            <h3 className="text-xl font-bold text-editorial-primary dark:text-editorial-primary">
              {previewPrompt.title}
            </h3>
            <p className="text-sm text-editorial-secondary dark:text-editorial-secondary font-serif leading-relaxed bg-warm-secondary dark:bg-warm-secondary p-4 rounded-lg border border-slate-100 dark:border-editorial-border">
              {previewPrompt.description}
            </p>
            <div className="flex justify-end pt-4">
              <Button onClick={() => handleUsePrompt(previewPrompt)} icon={BookOpen}>
                Use This Prompt
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* User Template Create/Edit Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        template={editingTemplate}
        onSave={handleSaveTemplate}
        isLoading={isSavingTemplate}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingTemplate}
        onClose={() => setDeletingTemplate(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Template"
        message="Are you sure you want to delete this template? This cannot be undone."
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
