import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Ticket, 
  User, 
  CreditCard, 
  Sparkles, 
  AlertCircle, 
  Tag, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, TicketTier, Booking, SelectedAddOn, AttendeeInfo } from '../types';
import { api } from '../services/api';
import { TicketPass } from './TicketPass';

interface BookingModalProps {
  event: EventItem;
  initialTierId?: string;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  event,
  initialTierId,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTierId, setSelectedTierId] = useState<string>(
    initialTierId || (event.ticketTiers.length > 0 ? event.ticketTiers[0].id : '')
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});

  // Attendee Form State
  const [attendee, setAttendee] = useState<AttendeeInfo>({
    fullName: '',
    email: '',
    phone: '',
    companyOrOrg: '',
    specialRequests: '',
    dietaryPreference: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Promo Code & Payment State
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState<boolean>(false);

  // Payment method simulation
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'bank_transfer'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Loading & Result state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTierId) {
      setSelectedTierId(initialTierId);
    }
  }, [initialTierId]);

  if (!isOpen) return null;

  const currentTier = event.ticketTiers.find((t) => t.id === selectedTierId) || event.ticketTiers[0];
  const ticketSubtotal = (currentTier?.price || 0) * quantity;

  // Addons subtotal
  let addOnsSubtotal = 0;
  if (event.addOns) {
    event.addOns.forEach((addon) => {
      const qty = selectedAddOns[addon.id] || 0;
      addOnsSubtotal += addon.price * qty;
    });
  }

  const rawSubtotal = ticketSubtotal + addOnsSubtotal;
  const discountedSubtotal = Math.max(0, rawSubtotal - promoDiscount);
  const serviceFee = discountedSubtotal > 0 ? Math.round(discountedSubtotal * 0.05 * 100) / 100 : 0;
  const grandTotal = Math.round((discountedSubtotal + serviceFee) * 100) / 100;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsValidatingPromo(true);
    setPromoMessage(null);

    try {
      const result = await api.validatePromoCode(promoInput, rawSubtotal);
      if (result.valid) {
        setAppliedPromo(promoInput.toUpperCase().trim());
        setPromoDiscount(result.discountAmount);
        setPromoMessage({ text: result.message, isError: false });
      } else {
        setAppliedPromo(null);
        setPromoDiscount(0);
        setPromoMessage({ text: result.message, isError: true });
      }
    } catch (err: any) {
      setPromoMessage({ text: 'Unable to validate code', isError: true });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoInput('');
    setPromoMessage(null);
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!attendee.fullName.trim()) errors.fullName = 'Full name is required';
    if (!attendee.email.trim() || !/\S+@\S+\.\S+/.test(attendee.email)) {
      errors.email = 'Valid email is required for ticket delivery';
    }
    if (!attendee.phone.trim()) errors.phone = 'Phone number is required for SMS updates';
    if (!agreeTerms) errors.terms = 'Please accept the event terms & conditions';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setApiError(null);

    const processedAddOns: SelectedAddOn[] = [];
    if (event.addOns) {
      event.addOns.forEach((addon) => {
        const qty = selectedAddOns[addon.id] || 0;
        if (qty > 0) {
          processedAddOns.push({
            addOnId: addon.id,
            name: addon.name,
            price: addon.price,
            quantity: qty,
          });
        }
      });
    }

    try {
      const res = await api.createBooking({
        eventId: event.id,
        tierId: currentTier.id,
        quantity,
        attendee,
        selectedAddOns: processedAddOns,
        promoCode: appliedPromo || undefined,
        paymentMethod,
      });

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
        setStep(4);
        onBookingSuccess(res.booking);

        // Fire celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      } else {
        setApiError(res.error || 'Booking failed. Please try again.');
      }
    } catch (err: any) {
      setApiError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {step === 4 ? 'Booking Confirmed!' : `Book Tickets • ${event.title}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                {event.location.venueName}, {event.location.city}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Step Indicator (Only for steps 1-3) */}
        {step < 4 && (
          <div className="px-6 pt-3 pb-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span className={step >= 1 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>
                1. Select Tickets
              </span>
              <span className={step >= 2 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>
                2. Attendee Info
              </span>
              <span className={step >= 3 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>
                3. Payment
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100">
          
          {/* STEP 1: Select Tier, Quantity, Addons */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-2.5">
                  Choose Ticket Tier
                </label>
                <div className="space-y-3">
                  {event.ticketTiers.map((tier) => {
                    const isSelected = tier.id === selectedTierId;
                    const isSoldOut = tier.availableSeats <= 0;

                    return (
                      <div
                        key={tier.id}
                        onClick={() => !isSoldOut && setSelectedTierId(tier.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                            : isSoldOut
                            ? 'border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {tier.name}
                              </span>
                              {tier.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                  {tier.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{tier.description}</p>
                            
                            {/* Perks bullets */}
                            <ul className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                              {tier.perks.map((perk, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>{perk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-lg font-black text-slate-900 dark:text-white">
                              {tier.price === 0 ? 'Free' : `$${tier.price}`}
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {isSoldOut ? 'Sold out' : `${tier.availableSeats} seats left`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">Number of Tickets</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Max 10 passes per registration</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 font-bold flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="font-mono text-base font-bold w-6 text-center text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentTier?.availableSeats || 10, quantity + 1, 10))}
                    disabled={quantity >= (currentTier?.availableSeats || 10) || quantity >= 10}
                    className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 font-bold flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add-ons upgrades (if available) */}
              {event.addOns && event.addOns.length > 0 && (
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-2.5">
                    Optional Add-Ons & Experiences
                  </label>
                  <div className="space-y-2.5">
                    {event.addOns.map((addon) => {
                      const count = selectedAddOns[addon.id] || 0;
                      return (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-xs"
                        >
                          <div className="pr-4">
                            <p className="font-bold text-slate-900 dark:text-white">{addon.name}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-[11px]">{addon.description}</p>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400 mt-1 inline-block">
                              +${addon.price} each
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAddOns((prev) => ({
                                  ...prev,
                                  [addon.id]: Math.max(0, count - 1),
                                }))
                              }
                              className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-bold">{count}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAddOns((prev) => ({
                                  ...prev,
                                  [addon.id]: count + 1,
                                }))
                              }
                              className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Attendee Form */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
                <p className="font-bold text-xs">Primary Contact & Pass Holder</p>
                <p className="text-[11px] opacity-90">Digital tickets and admission barcodes will be emailed directly to this address.</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={attendee.fullName}
                  onChange={(e) => setAttendee({ ...attendee, fullName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                    formErrors.fullName ? 'border-rose-500 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                  }`}
                />
                {formErrors.fullName && <p className="text-rose-500 text-[11px] mt-1">{formErrors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={attendee.email}
                  onChange={(e) => setAttendee({ ...attendee, email: e.target.value })}
                  placeholder="e.g. alex.morgan@example.com"
                  className={`w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                    formErrors.email ? 'border-rose-500 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                  }`}
                />
                {formErrors.email && <p className="text-rose-500 text-[11px] mt-1">{formErrors.email}</p>}
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={attendee.phone}
                    onChange={(e) => setAttendee({ ...attendee, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                      formErrors.phone ? 'border-rose-500 focus:ring-rose-400' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                    }`}
                  />
                  {formErrors.phone && <p className="text-rose-500 text-[11px] mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    value={attendee.companyOrOrg || ''}
                    onChange={(e) => setAttendee({ ...attendee, companyOrOrg: e.target.value })}
                    placeholder="e.g. Acme Tech"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Dietary / Special Requests */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Special Requests / Dietary Needs (Optional)
                </label>
                <textarea
                  rows={2}
                  value={attendee.specialRequests || ''}
                  onChange={(e) => setAttendee({ ...attendee, specialRequests: e.target.value })}
                  placeholder="e.g. Wheelchair access needed, Vegetarian meal, etc."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    I agree to the Event Terms of Service, Privacy Policy, and understand tickets are issued under organizer guidelines.
                  </span>
                </label>
                {formErrors.terms && <p className="text-rose-500 text-[11px] mt-1">{formErrors.terms}</p>}
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Promo Validation */}
          {step === 3 && (
            <div className="space-y-5 text-xs">
              
              {/* Promo Code Input */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" /> Have a Promo Code?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="e.g. EARLYBIRD20, STUDENT50"
                    disabled={appliedPromo !== null}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 uppercase font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="px-3.5 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-semibold hover:bg-rose-200 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={isValidatingPromo || !promoInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {isValidatingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                    </button>
                  )}
                </div>
                {promoMessage && (
                  <p className={`text-[11px] font-medium ${promoMessage.isError ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'wallet', label: 'Apple / G-Pay', icon: Sparkles },
                    { id: 'bank_transfer', label: 'NetBanking / UPI', icon: ShieldCheck },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          paymentMethod === pm.id
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-850'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px]">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Details Mock Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">CVC Code</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Breakdown Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{currentTier.name} (x{quantity})</span>
                  <span className="font-semibold">${ticketSubtotal.toFixed(2)}</span>
                </div>
                {addOnsSubtotal > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Add-On Experiences</span>
                    <span className="font-semibold">+${addOnsSubtotal.toFixed(2)}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Promo Discount ({appliedPromo})</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Platform & Processing Fee (5%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {apiError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Success Confirmation & Pass */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Booking Successful!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Your registration is confirmed. We have sent your digital passes to <strong>{confirmedBooking.attendee.email}</strong>.
                </p>
              </div>

              {/* Printable Ticket Pass */}
              <TicketPass booking={confirmedBooking} onClose={onClose} />
            </div>
          )}

        </div>

        {/* Modal Footer Controls (Step 1-3) */}
        {step < 4 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div className="text-xs">
                <span className="text-slate-500 dark:text-slate-400">Total: </span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Continue to Attendee Info</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) {
                    setStep(3);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Proceed to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ${grandTotal.toFixed(2)} & Confirm</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
