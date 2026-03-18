import { useParams, useNavigate } from 'react-router-dom';
import { useBookings } from '@/context/BookingContext';
import { properties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { differenceInDays, format, isToday, isPast } from 'date-fns';
import { 
  ArrowLeft, Copy, MapPin, Clock, CalendarIcon, 
  CloudSun, Sun, CloudRain, ChevronDown, MessageCircle,
  Car, Utensils, Sparkles, Moon, AlertCircle, Download
} from 'lucide-react';
import { toast } from 'sonner';
import heroImg from '@/assets/hero-staycation.jpg';
import unitImg from '@/assets/unit-preview.jpg';

export default function GuestDashboard() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings } = useBookings();

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
  
  // Logic: if today is check-in day or we are currently checked in
  const isCheckInDay = isToday(checkInDate) || (isPast(checkInDate) && !isPast(checkOutDate));
  
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
              <p className="text-white/90 text-lg mb-6 leading-snug">Until your luxury staycation at<br/>{property.name}.</p>
              <Button variant="secondary" className="w-full sm:w-auto min-h-[48px] font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl shadow-md">
                <MapPin className="mr-2 h-4 w-4" /> View Directions
              </Button>
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Confirmation</p>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight">{booking.id.toUpperCase()}</span>
                <button onClick={handleCopyCode} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-50 transition-colors" title="Copy code">
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
              <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 min-h-[40px] transition-colors">
                Manage <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Check-in</p>
              <p className="font-bold">{format(checkInDate, 'MMM d, yyyy')}</p>
              <span className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3"/> 3:00 PM</span>
            </div>
            <div className="border-l pl-4 border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Check-out</p>
              <p className="font-bold">{format(checkOutDate, 'MMM d, yyyy')}</p>
              <span className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3"/> 11:00 AM</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="font-semibold text-sm mb-3">Weather during your stay</h3>
            <div className="flex justify-between items-center text-center">
              <div>
                <span className="text-xs text-slate-500 block mb-1">{format(checkInDate, 'EEE')}</span>
                <Sun className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                <span className="text-sm font-semibold">32°</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">{format(new Date(checkInDate.getTime() + 86400000), 'EEE')}</span>
                <CloudSun className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                <span className="text-sm font-semibold">30°</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">{format(new Date(checkInDate.getTime() + 172800000), 'EEE')}</span>
                <CloudRain className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                <span className="text-sm font-semibold">28°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Concierge & Add-ons Rail */}
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight mb-4 px-2">Elevate your stay</h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide scroll-px-4 sm:scroll-px-0">
            {addOnItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm min-w-[160px] snap-start shrink-0 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <h3 className="font-semibold text-sm leading-tight mb-1">{item.title}</h3>
                    <span className="text-xs text-slate-500 font-medium">{item.price}</span>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg min-h-[36px] font-semibold text-xs transition-colors">
                    Add to stay
                  </Button>
                </div>
              );
            })}
            {/* Nano Banana Edge Spacer */}
            <div className="w-1 shrink-0 snap-end"></div>
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
