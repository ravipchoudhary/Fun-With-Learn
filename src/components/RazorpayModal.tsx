import React, { useState } from 'react';
import { CreditCard, Smartphone, ShieldCheck, X } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface RazorpayModalProps {
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSuccess: (planName: 'Basic' | 'Standard' | 'Premium') => void;
}

export default function RazorpayModal({ plan, onClose, onSuccess }: RazorpayModalProps) {
  if (!plan) return null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'net'>('card');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [upiId, setUpiId] = useState('student@okaxis');

  const gstAmount = Math.round(plan.price * 0.18);
  const totalAmount = plan.price + gstAmount;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate standard Razorpay processing timeout
    setTimeout(() => {
      setIsProcessing(false);
      const planTier = plan.id === 'plan_basic' ? 'Basic' : plan.id === 'plan_standard' ? 'Standard' : 'Premium';
      onSuccess(planTier);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden transform animate-in fade-in zoom-in duration-200"
        id="razorpay-dialog"
      >
        {/* Header styling resembling original Razorpay widget */}
        <div className="bg-slate-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-lg font-extrabold text-sm tracking-widest text-white">
              RZP
            </div>
            <div>
              <h3 className="font-sans font-bold text-base">Fun With Learn</h3>
              <p className="text-xs text-slate-400">Secured by Razorpay Checkout</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Plan Summary details */}
        <div className="p-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase font-mono tracking-wider text-slate-400">Selected Course Tier</p>
              <h4 className="font-semibold text-slate-900 dark:text-white text-base">{plan.name}</h4>
              <p className="text-xs text-slate-50 relative mt-1 block dark:text-slate-300">Renewable every {plan.period}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-sans block text-slate-500 dark:text-slate-400">₹{plan.price}</span>
              <span className="text-xs text-slate-400 block">+ GST (18%): ₹{gstAmount}</span>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white block mt-0.5">₹{totalAmount}</span>
            </div>
          </div>

          <form onSubmit={handlePay} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="98765 43210" 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email ID</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com" 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Selector list for payment option */}
            <div className="mt-4">
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Select Payment Mode
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CreditCard size={14} />
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'upi' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Smartphone size={14} />
                  UPI / GPay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('net')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'net' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🏦 NetBanking
                </button>
              </div>
            </div>

            {/* Dynamic input area based on option selection */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 transition-all">
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Expiry</label>
                      <input 
                        type="text" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-xs focus:outline-none text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">CVV</label>
                      <input 
                        type="password" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-xs focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">UPI ID (VPA)</label>
                  <input 
                    type="text" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-xs focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Enter GPay, PhonePe, or Paytm UPI ID to send mock request.</p>
                </div>
              )}

              {paymentMethod === 'net' && (
                <div className="grid grid-cols-2 gap-1 px-1 py-1">
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                    <label key={bank} className="flex items-center gap-2 text-xs py-1 cursor-pointer text-slate-700 dark:text-slate-300">
                      <input type="radio" name="bank" defaultChecked={bank === 'State Bank of India'} className="accent-indigo-500" />
                      {bank}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Safety lock disclaimer */}
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs py-1">
              <ShieldCheck size={16} />
              <span>This is a secure academic test sandbox. No real Indian rupees are billed.</span>
            </div>

            {/* Action buttons */}
            <button
              type="submit"
              disabled={isProcessing}
              id={`pay-${plan.id}`}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 active:scale-98 transition-all py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Checkout...</span>
                </>
              ) : (
                <span>Pay ₹{totalAmount}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
