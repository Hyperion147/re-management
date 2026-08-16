import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import api from '@/lib/axios';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSupportModal({ isOpen, onClose }: ContactSupportModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        setIsAuthenticated(!!user);
      } catch {
        if (!mounted) return;
        setIsAuthenticated(false);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let attachmentUrl = null;

      // 1. Upload to Supabase Storage if file exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `₹{Math.random()}.₹{fileExt}`;
        const filePath = `₹{fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('support-attachments')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload Error:', uploadError);
          // Proceed anyway or throw? We'll throw.
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('support-attachments')
          .getPublicUrl(filePath);

        attachmentUrl = publicUrl;
      }

      // 2. Ensure the user is authenticated and send via Axios so the auth token is attached.
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in before submitting a support request.');
      }

      await api.post('/support-requests', {
        subject,
        message,
        attachmentUrl,
        attachmentName: file ? file.name : null,
      });

      // 3. Reset and close
      setSubject('');
      setMessage('');
      setFile(null);
      onClose();
      alert('Support request submitted successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1">Contact Support</h2>
            <p className="text-sm text-gray-500 font-medium">Let us know what you need help with.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {(authLoading || !isAuthenticated) && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4 text-sm text-orange-700 font-medium">
                {authLoading
                  ? 'Checking login status...'
                  : 'You must be signed in to submit a support request.'}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Subject <span className="text-red-500">*</span></label>
              <input 
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Booking issue"
                disabled={isSubmitting || authLoading || !isAuthenticated}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Message <span className="text-red-500">*</span></label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={4}
                disabled={isSubmitting || authLoading || !isAuthenticated}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors resize-none placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Attach Screenshot (optional)</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <div 
                onClick={() => !isSubmitting && !authLoading && isAuthenticated && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-gray-50/50 transition-colors ₹{isSubmitting || authLoading || !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
              >
                {file ? (
                  <>
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-widest text-center truncate w-full">{file.name}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-500 transition-colors">Click to upload image</span>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isSubmitting || authLoading || !isAuthenticated}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? 'Submitting...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
