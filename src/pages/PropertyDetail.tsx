import { useParams, useNavigate } from 'react-router-dom';
import { properties } from '@/data/properties';
import { useBookings } from '@/context/BookingContext';
import { useWaitlist } from '@/context/WaitlistContext';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { format, differenceInDays, addDays, isBefore, isSameDay } from 'date-fns';
import { ArrowLeft, Users, Bed, Wifi, ChefHat, Waves, Eye, Clock, Zap, Bell, CheckCircle2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import heroImg from '@/assets/hero-staycation.jpg';
import unitImg from '@/assets/unit-preview.jpg';
import { cn } from '@/lib/utils';
import { getDynamicPrice, isGapFillerDate } from '@/lib/pricing';

const amenityIcons: Record<string, React.ReactNode> = {
  'King Bed': <Bed className="h-4 w-4" />,
  'WiFi': <Wifi className="h-4 w-4" />,
  'Kitchen': <ChefHat className="h-4 w-4" />,
  'Pool Access': <Waves className="h-4 w-4" />,
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking, getBookingsForProperty, bookings } = useBookings();
  const { addToWaitlist } = useWaitlist();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guests, setGuests] = useState(1);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  const property = properties.find(p => p.id === id);

  const bookedDates = useMemo(() => {
    if (!property) return [];
    const propertyBookings = getBookingsForProperty(property.id);
    const dates: Date[] = [];
    propertyBookings.forEach(b => {
      let current = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      while (isBefore(current, end) || isSameDay(current, end)) {
        dates.push(new Date(current));
        current = addDays(current, 1);
      }
    });
    return dates;
  }, [property, getBookingsForProperty]);

  const nights = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;

  const pricing = useMemo(() => {
    if (!dateRange?.from || !property) return null;
    const isGap = isGapFillerDate(dateRange.from, bookings, property.id);
    return getDynamicPrice(property.pricePerNight, dateRange.from, isGap);
  }, [dateRange?.from, property, bookings]);

  const effectivePrice = pricing?.price ?? (property?.pricePerNight ?? 0);
  const total = nights * effectivePrice;

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Property not found.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange?.from || !dateRange?.to) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (nights < 1) {
      toast.error('Minimum 1 night stay required');
      return;
    }

    setSubmitting(true);
    const success = addBooking({
      propertyId: property.id,
      guestName,
      guestEmail,
      guestPhone,
      checkIn: dateRange.from.toISOString(),
      checkOut: dateRange.to.toISOString(),
      guests,
      status: 'confirmed',
      totalPrice: total,
    });

    if (success) {
      toast.success('Booking confirmed!', { description: `${property.name} · ${nights} night${nights > 1 ? 's' : ''}` });
      navigate('/');
    } else {
      toast.error('These dates are no longer available.');
      setShowWaitlist(true);
    }
    setSubmitting(false);
  };

  const handleJoinWaitlist = () => {
    if (!dateRange?.from || !dateRange?.to || !guestName || !guestEmail) {
      toast.error('Please fill in your details and select dates');
      return;
    }
    addToWaitlist({
      propertyId: property.id,
      guestName,
      guestEmail,
      guestPhone,
      desiredCheckIn: dateRange.from.toISOString(),
      desiredCheckOut: dateRange.to.toISOString(),
    });
    toast.success('Added to waitlist!', { description: "We'll notify you if these dates open up." });
    setShowWaitlist(false);
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[40vh] min-h-[280px]">
        <img src={property.imageIndex % 2 === 0 ? heroImg : unitImg} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-card/80 backdrop-blur p-2 rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-12">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h1 className="font-display text-3xl font-bold mb-1">{property.name}</h1>
              <p className="text-muted-foreground mb-4">MOA Complex · {property.floor}</p>
              <p className="text-foreground/80 mb-6">{property.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {property.amenities.map(a => (
                  <Badge key={a} variant="outline" className="gap-1.5 py-1.5">
                    {amenityIcons[a] || <Eye className="h-4 w-4" />}
                    {a}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Max {property.maxGuests} guests</span>
                <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> 1 King + Sofa Bed</span>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h2 className="font-display text-xl font-semibold mb-4">Select Dates</h2>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={[{ before: new Date() }, ...bookedDates.map(d => d)]}
                className={cn("p-3 pointer-events-auto w-full")}
              />
              {bookedDates.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">Grayed out dates are already booked.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl p-6 border shadow-sm sticky top-20">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-8 relative px-2">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-muted -z-10 -translate-y-1/2"></div>
                <div className="absolute left-0 top-1/2 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                
                {[1, 2, 3].map((s) => (
                  <div key={s} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-500 bg-card border-2", step >= s ? "border-primary text-primary" : "border-muted text-muted-foreground", step === s && "bg-primary text-primary-foreground")}>
                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-xl font-bold mb-4 font-display">Select Dates & Guests</h3>
                  <p className="text-2xl font-bold mb-1">
                    ₱{property.pricePerNight.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ night</span>
                  </p>

                  {pricing && pricing.discount > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                        {pricing.label === 'Gap Filler Deal' ? <Zap className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {pricing.discount}% OFF
                      </Badge>
                      <span className="text-sm font-medium text-destructive">{pricing.label}</span>
                    </div>
                  )}

                  {nights > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3 my-4 space-y-1 text-sm border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Selected Dates</span>
                        <span className="font-medium">{format(dateRange!.from!, 'MMM d')} → {format(dateRange!.to!, 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between pt-2 mt-2 border-t">
                        <span className="text-muted-foreground">
                          {pricing && pricing.discount > 0 ? (
                            <>
                              <span className="line-through opacity-70">₱{property.pricePerNight.toLocaleString()}</span>
                              {' '}₱{effectivePrice.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
                            </>
                          ) : (
                            <>₱{property.pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</>
                          )}
                        </span>
                        <span className="font-semibold text-primary">₱{total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="guests" className={cn(guests < 1 || guests > property.maxGuests ? "text-destructive" : "")}>Number of Guests</Label>
                      <Input id="guests" type="number" min={1} max={property.maxGuests} value={guests} onChange={e => setGuests(Number(e.target.value))} className={cn(guests < 1 || guests > property.maxGuests ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary", "transition-all duration-200 mt-1")} />
                      {guests > property.maxGuests && <p className="text-xs text-destructive mt-1">Maximum {property.maxGuests} guests allowed.</p>}
                    </div>
                    
                    <Button type="button" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300" size="lg" disabled={nights < 1 || guests > property.maxGuests || guests < 1} onClick={() => setStep(2)}>
                      {nights < 1 ? 'Select Dates to Continue' : 'Continue to Details'}
                    </Button>

                    {showWaitlist && (
                      <Button type="button" variant="outline" className="w-full gap-2 transition-all duration-300" onClick={handleJoinWaitlist}>
                        <Bell className="h-4 w-4" /> Join Waitlist for Dates
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <button type="button" onClick={() => setStep(1)} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"><ArrowLeft className="h-4 w-4"/></button>
                    <h3 className="text-xl font-bold font-display">Guest Details</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className={cn(!guestName && "text-muted-foreground")}>Full Name <span className="text-destructive">*</span></Label>
                      <Input id="name" required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Juan Dela Cruz" className="mt-1 focus-visible:ring-primary transition-all duration-200" />
                    </div>
                    <div>
                      <Label htmlFor="email" className={cn(!guestEmail && "text-muted-foreground")}>Email <span className="text-destructive">*</span></Label>
                      <Input id="email" type="email" required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="juan@email.com" className="mt-1 focus-visible:ring-primary transition-all duration-200" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className={cn(!guestPhone && "text-muted-foreground")}>Phone <span className="text-destructive">*</span></Label>
                      <Input id="phone" type="tel" required value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+63 9XX XXX XXXX" className="mt-1 focus-visible:ring-primary transition-all duration-200" />
                    </div>
                    
                    <Button type="button" className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20" size="lg" disabled={!guestName || !guestEmail || !guestPhone} onClick={() => setStep(3)}>
                      Review Booking
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <button type="button" onClick={() => setStep(2)} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"><ArrowLeft className="h-4 w-4"/></button>
                    <h3 className="text-xl font-bold font-display">Confirm & Pay</h3>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-5 border border-border/50 space-y-4 mb-6 text-sm">
                    <div className="flex justify-between border-b border-border/50 pb-3">
                      <span className="text-muted-foreground">Dates</span>
                      <span className="font-medium text-right">{format(dateRange!.from!, 'MMM d')} → {format(dateRange!.to!, 'MMM d, yyyy')}<br/><span className="text-xs text-muted-foreground font-normal">{nights} night{nights > 1 ? 's' : ''}</span></span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-3">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="font-medium text-right">{guests} Guest{guests > 1 ? 's' : ''}<br/><span className="text-xs text-muted-foreground font-normal">{guestName}</span></span>
                    </div>
                    <div className="flex justify-between pt-1 items-center">
                      <span className="text-foreground font-medium">Total (PHP)</span>
                      <span className="font-bold text-xl text-primary">₱{total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/20" size="lg" disabled={submitting}>
                      {submitting ? 'Processing...' : 'Confirm Reservation'}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
