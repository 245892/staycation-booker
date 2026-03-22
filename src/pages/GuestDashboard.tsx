import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookings } from '@/context/BookingContext';
import { useReviews } from '@/context/ReviewContext';
import { properties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { differenceInDays, format, isToday, isPast } from 'date-fns';
import {
  ArrowLeft, Copy, MapPin, Clock, CalendarIcon,
  CloudSun, Sun, CloudRain, ChevronDown, MessageCircle,
  Car, Utensils, Sparkles, Moon, AlertCircle, Download,
  Star, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import heroImg from '@/assets/hero-staycation.jpg';
import unitImg from '@/assets/unit-preview.jpg';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function GuestDashboard() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings } = useBookings();
  const { reviews, addReview } = useReviews();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const booking = bookings.find(b => b.id === bookingId);
  const property = properties.find(p => p.id === booking?.propertyId);

  if (!booking || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-slate-500 font-medium">Booking not found.</p>
        <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const daysUntilTrip = differenceInDays(checkInDate, new Date());

  // Logic: if today is check-in day or we are currently checked in (using date-fns, which relies on app's current config/tz)
  const isCheckInDay = isToday(checkInDate) || (isPast(checkInDate) && !isPast(checkOutDate));
  
  // Set precise local 11:00 AM checkout time strictly tracking user's computer time for review testing
  const actualCheckoutTime = new Date(checkOutDate);
  actualCheckoutTime.setHours(11, 0, 0, 0);
  const isPastCheckout = new Date() > actualCheckoutTime;
  const hasReviewed = reviews.some(r => r.bookingId === booking?.id);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.id.toUpperCase());
    toast.success('Confirmation code copied!');
  };

  const handleDigitalKey = () => {
    toast.success('Digital Key Activated', { description: `Room ${property.floor.split(' ')[0]} unlocked.` });
  };

  const addOnItems = [
    { title: 'Airport Transfer', price: '₱1,500', icon: Car },
    { title: 'In-room Dining', price: 'Menu', icon: Utensils },
    { title: 'Spa Treatment', price: '₱2,000', icon: Sparkles },
    { title: 'Late Check-out', price: '₱1,000', icon: Moon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">

      {/* Dynamic Stay Countdown Hero */}
      <div className="relative h-[45vh] min-h-[320px] w-full isolate">
        <img
          src={property.imageIndex % 2 === 0 ? heroImg : unitImg}
          alt={property.name}
          className="absolute inset-0 w-full h-full object-cover -z-20"
        />
        <div className="absolute inset-0 bg-slate-900/40 -z-10" />

        <button onClick={() => navigate('/')} className="absolute top-6 left-4 sm:left-6 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        <div className="h-full flex flex-col justify-end p-6 max-w-3xl mx-auto">
          <div className="mb-2">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {property.name}
            </span>
          </div>

          {isCheckInDay ? (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 tracking-tight">Welcome to Manila!</h1>
              <p className="text-white/90 text-lg mb-6">Your room on the {property.floor} is ready.</p>
              <Button onClick={handleDigitalKey} className="w-full sm:w-auto min-h-[56px] text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg transition-transform active:scale-95">
                Check-in with Digital Key
              </Button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-5xl sm:text-6xl font-display font-bold text-white mb-2 tracking-tight">
                {daysUntilTrip} <span className="text-2xl sm:text-3xl font-medium opacity-90 font-sans tracking-normal">days left</span>
              </h1>
              <p className="text-white/90 text-lg mb-6 leading-snug">Until your luxury staycation at<br />{property.name}.</p>
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <Button className="w-full sm:w-auto min-h-[48px] font-semibold bg-white text-slate-900 hover:bg-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 rounded-xl shadow-md cursor-help">
                    <MapPin className="mr-2 h-4 w-4" /> View Directions
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent side="top" align="center" sideOffset={10} className="w-80 p-0 overflow-hidden shadow-2xl border-slate-200">
                  <div className="bg-slate-50 p-3 border-b border-slate-100">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> SM Mall of Asia Complex
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Seaside Blvd, Pasay, Metro Manila</p>
                  </div>
                  <div className="relative">
                    <a href="https://www.google.com/maps/search/?api=1&query=SM+Mall+of+Asia+Complex,+Seaside+Blvd,+Pasay,+Metro+Manila" target="_blank" rel="noopener noreferrer" className="absolute top-2 left-2 z-10 bg-white hover:bg-slate-50 text-blue-600 px-3 py-1.5 rounded-sm shadow-md text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors">
                      Open in Maps <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15448.971511252119!2d120.9754!3d14.5323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cb318ad4df81%3A0xe7bc36a4fabb6f7!2sSM%20Mall%20of%20Asia!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 space-y-16">

        {/* Payment Banner */}
        {booking.paymentStatus === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-2 fade-in">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-full shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-yellow-900 leading-tight">Payment Required</p>
                <p className="text-sm text-yellow-800">Please complete your payment to secure your stay.</p>
              </div>
            </div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-sm w-full sm:w-auto font-semibold">
              Complete Payment
            </Button>
          </div>
        )}

        {/* Core Trip Details Card */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Confirmation</p>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight dark:text-white">{booking.id.toUpperCase()}</span>
                <button onClick={handleCopyCode} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" title="Copy code">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              {booking.paymentStatus === 'paid' && (
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 min-h-[40px] w-10 transition-colors" title="Download Invoice">
                  <Download className="h-4 w-4" />
                </Button>
              )}
              <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block cursor-not-allowed">
                        <DialogTrigger asChild>
                          <Button disabled={!isPastCheckout || hasReviewed} variant="outline" className={`rounded-xl border-slate-200 text-slate-600 min-h-[40px] transition-colors ${(!isPastCheckout || hasReviewed) ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
                            {hasReviewed ? 'Review Submitted' : 'Write a Review'} <Star className="ml-2 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </span>
                    </TooltipTrigger>
                    {(!isPastCheckout || hasReviewed) && (
                      <TooltipContent side="top" className="bg-slate-900 text-white font-medium shadow-xl border-0">
                        <p>{hasReviewed ? 'You have already submitted a review for this stay.' : 'You can write a review after your checkout date.'}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                      Share your experience at {property.name} with others.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Overall Rating</Label>
                      <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            className={`h-8 w-8 cursor-pointer transition-all ${
                              star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 hover:text-yellow-400 hover:fill-yellow-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review">Your Review</Label>
                      <Textarea id="review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="What did you love about your stay?" className="resize-none" rows={4} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => {
                        if (rating === 0) {
                          toast.error('Please select a star rating first.');
                          return;
                        }
                        addReview({
                          propertyId: property.id,
                          bookingId: booking.id,
                          name: 'Guest (You)',
                          rating,
                          text: reviewText,
                          date: format(new Date(), 'MMM dd, yyyy')
                        });
                        toast.success('Review submitted successfully! Thank you.');
                        setIsReviewModalOpen(false);
                      }} 
                      className="w-full sm:w-auto"
                    >
                      Submit Review
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Check-in</p>
              <p className="font-bold text-lg text-slate-900 tracking-tight">{format(checkInDate, 'MMM d, yyyy')}</p>
              <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-1"><Clock className="h-4 w-4" /> 3:00 PM</span>
            </div>
            <div className="border-l pl-4 border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Check-out</p>
              <p className="font-bold text-lg text-slate-900 tracking-tight">{format(checkOutDate, 'MMM d, yyyy')}</p>
              <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-1"><Clock className="h-4 w-4" /> 11:00 AM</span>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <h3 className="font-semibold text-sm mb-3 dark:text-slate-200">Weather during your stay</h3>
            <div className="flex justify-between items-center text-center">
              <div>
                <span className="text-xs text-slate-500 block mb-1">{format(checkInDate, 'EEE')}</span>
                <Sun className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                <span className="text-sm font-semibold dark:text-white">32°</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">{format(new Date(checkInDate.getTime() + 86400000), 'EEE')}</span>
                <CloudSun className="h-6 w-6 text-slate-400 dark:text-slate-500 mx-auto mb-1" />
                <span className="text-sm font-semibold dark:text-white">30°</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">{format(new Date(checkInDate.getTime() + 172800000), 'EEE')}</span>
                <CloudRain className="h-6 w-6 text-slate-400 dark:text-slate-500 mx-auto mb-1" />
                <span className="text-sm font-semibold dark:text-white">28°</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Communication Hub */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
        {/* Optional Host Status Card (shows briefly on load or hover) */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-3 flex items-center gap-3 animate-in slide-in-from-right-8 fade-in h-[60px] cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Host Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
          </div>
          <div className="pr-2 hidden sm:block">
            <p className="text-sm font-bold leading-none mb-1">Sarah (Host)</p>
            <p className="text-xs text-slate-500 leading-none">Online typically replies in 5m</p>
          </div>
        </div>

        <Button className="h-14 w-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl flex items-center justify-center hover:scale-105 transition-all">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

    </div>
  );
}
