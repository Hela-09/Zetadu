import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, CheckCircle, AlertCircle, Clock, CreditCard } from 'lucide-react';
import { LogOut } from 'lucide-react';

export default function PaymentGate() {
  const { user, userProfile, refreshProfile, signOut } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Determine current state based on userProfile
  const paymentStatus = userProfile?.paymentStatus || 'none';
  const subStatus = userProfile?.subscriptionStatus || 'none';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitPayment = async () => {
    if (!file || !user) return;
    setIsUploading(true);
    setError(null);
    try {
      let receiptUrl = '';
      // We use base64 string and compress if it's an image
      const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          if (!file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
            return;
          }
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = event => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
          };
        });
      };
      
      receiptUrl = await compressImage(file);


      await updateDoc(doc(db, 'users', user.uid), {
        paymentStatus: 'pending',
        receiptUrl: receiptUrl,
        paymentSubmittedAt: Date.now()
      });
      
      setUploadSuccess(true);
      await refreshProfile();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to upload receipt. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white flex-1">Zetadu Premium</h2>
          <button onClick={signOut} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors" title="Sign out">
            <LogOut size={20} />
          </button>
        </div>

        {paymentStatus === 'pending' || uploadSuccess ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Clock size={40} />
            </div>
            <h3 className="text-xl font-semibold">Payment Pending Approval</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Your payment receipt has been submitted and is currently being reviewed by our administrators.
            </p>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              This process is manual. Please check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {subStatus === 'expired' ? 'Subscription Expired' : 'Activate Your Subscription'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                To access full features, please make a payment of <span className="font-bold text-slate-800 dark:text-slate-200">₦500</span> for 3 months access.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Payment Details</h4>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Amount</span>
                <span className="font-bold text-lg">₦500</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium">3 Months</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-slate-500">Account Name</span>
                  <span className="font-bold">Emmanuel Omojola</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-slate-500">Account Number</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-lg tracking-wide">8100272572</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Accepted Banks</span>
                  <span className="font-medium">OPay, PalmPay, Moniepoint</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">I Have Paid</h4>
              <p className="text-xs text-slate-500">Please upload your payment receipt as proof of payment.</p>
              
              <label className="block">
                <span className="sr-only">Choose receipt</span>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    dark:file:bg-blue-900/30 dark:file:text-blue-400
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50
                    cursor-pointer"
                />
              </label>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleSubmitPayment}
                disabled={!file || isUploading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Submit Receipt
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
