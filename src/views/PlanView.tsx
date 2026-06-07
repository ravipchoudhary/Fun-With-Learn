import React from 'react';
import { ShieldCheck, Check, Star } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface PlanViewProps {
  plans: SubscriptionPlan[];
  selectedPlan: 'Basic' | 'Standard' | 'Premium' | 'None';
  onBuyPlan: (plan: SubscriptionPlan) => void;
}

export default function PlanView({ plans, selectedPlan, onBuyPlan }: PlanViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Grid heading description */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-mono tracking-widest text-indigo-600 dark:text-indigo-400 font-bold block">Affordable Pricing</span>
        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Flexible Study Plans & Tiers
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
          Unlock unlimited live whiteboard classes, homework archives, personalized AI course planners, and 1-on-1 expert tutor assistance.
        </p>
      </div>

      {/* Pricing card grid alignment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const planTier = plan.id === 'plan_basic' ? 'Basic' : plan.id === 'plan_standard' ? 'Standard' : 'Premium';
          const isCurrentPlan = selectedPlan === planTier;
          
          return (
            <div
              key={plan.id}
              className={`border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${plan.color} ${
                plan.badge ? 'ring-2 ring-indigo-500 ring-offset-4 dark:ring-offset-slate-950 scale-102 hover:shadow-xl' : 'hover:shadow-lg'
              }`}
            >
              {/* Optional visually elegant badge header overlay */}
              {plan.badge && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Star size={10} fill="currentColor" />
                  {plan.badge}
                </span>
              )}

              {/* Price core copy segment */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans font-extrabold text-slate-900 dark:text-white text-lg sm:text-2xl">{plan.name}</h3>
                  <div className="flex items-baseline mt-2.5">
                    <span className="font-sans font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">₹{plan.price}</span>
                    <span className="text-slate-400 text-xs font-mono ml-1">/ {plan.period}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 my-4" />
                
                {/* Benefits checklist listing segment */}
                <ul className="space-y-3">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-350">
                      <span className="p-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded mt-0.5">
                        <Check size={12} />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action transaction hook trigger */}
              <div className="pt-8">
                {isCurrentPlan ? (
                  <span className="block w-full text-center py-3.5 border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-xs uppercase tracking-wider">
                    My Active plan
                  </span>
                ) : (
                  <button
                    onClick={() => onBuyPlan(plan)}
                    id={plan.paymentButtonId}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer text-center select-none ${
                      plan.badge
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/10 active:scale-98 transition-transform'
                        : 'bg-slate-900 hover:bg-slate-950 text-white dark:bg-slate-850 dark:hover:bg-slate-750 transition-colors'
                    }`}
                  >
                    Subscribe with Razorpay
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Integrity banner summary footer */}
      <div className="max-w-xl mx-auto text-center bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
        <span>Gst invoices, instant sandbox test approvals, and secure Razorpay payment integrations fully ready to test.</span>
      </div>
    </div>
  );
}
