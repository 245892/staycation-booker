import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/booking';
import { Users, MapPin, Star, Wifi, Maximize2, CheckCircle2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import unitPreview from '@/assets/unit-preview.jpg';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { getPhTime } from '@/lib/utils';
import { useBookings } from '@/context/BookingContext';
import { startOfDay } from 'date-fns';


interface Props {
  property: Property;
  isFeaturedBento?: boolean;
  isAvailable?: boolean;
}

export default function PropertyCard({ property, isFeaturedBento, isAvailable = true }: Props) {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const { getBookingsForProperty } = useBookings();
  
  const propertyBookings = getBookingsForProperty(property.id);
  const bookedDates = propertyBookings.map(b => ({
    from: startOfDay(new Date(b.checkIn)),
    to: startOfDay(new Date(b.checkOut))
  }));

  const modifiers = { booked: bookedDates };
  const modifiersStyles = {
    booked: { 
      backgroundColor: '#ef4444', 
      color: 'white',
      textDecoration: 'line-through'
    }
  };

  return (
    <div className={`group relative rounded-[12px] bg-transparent perspective-1000 h-full ${isFeaturedBento ? 'md:col-span-2 lg:row-span-2' : ''}`}>
      {/* 3D Container */}
      <div className="w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        
        {/* Front Face */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[12px] overflow-hidden bg-white dark:bg-card border border-slate-200 dark:border-slate-800 shadow-md flex ${isFeaturedBento ? 'flex-col md:flex-row' : 'flex-col'}`}>
          {/* Image Container */}
          <div className={`overflow-hidden relative ${isFeaturedBento ? 'md:w-3/5' : 'h-[60%] w-full'}`}>
            <img
              src={property.gallery?.[0] ?? unitPreview}
              alt={property.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Top Right Overlays */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
              <Badge className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-slate-100 border-none shadow-sm px-2 py-1 text-[10px] font-bold">
                ₱{property.pricePerNight.toLocaleString()} <span className="font-normal opacity-70">/ night</span>
              </Badge>
              {isAvailable ? (
                <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md border border-emerald-200 dark:border-emerald-500/30">
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Available</span>
                </div>
              ) : (
                <div className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md border border-rose-200 dark:border-rose-800/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Booked</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Content Container */}
          <div className={`flex flex-col flex-1 p-5 ${isFeaturedBento ? 'lg:p-8 justify-center' : ''}`}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-display font-bold text-slate-900 dark:text-white ${isFeaturedBento ? 'text-2xl' : 'text-lg'}`}>
                  {property.name}
                </h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{property.rating ?? '4.8'}</span>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-300 italic">
                "{property.bestFeature ?? 'Premium experience with a view'}"
              </p>
            </div>
            {/* Quick Icons */}
            <div className="flex items-center gap-6 mt-auto border-t border-slate-100 dark:border-slate-800/50 pt-3">
              <div className="flex flex-col items-center gap-1 flex-1">
                <Maximize2 className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{property.sqft ?? '32'} sqm</span>
              </div>
              <div className="flex flex-col items-center gap-1 flex-1 border-x border-slate-100 dark:border-slate-800/50">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{property.maxGuests} Guests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[12px] bg-white dark:bg-card border border-border shadow-xl overflow-hidden flex flex-col text-card-foreground">
          <div className="p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold">{property.rating ?? '4.8'}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 line-clamp-2">{property.name}</h3>
              
              <div className="flex flex-col gap-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">What this place offers</p>
                <div className="grid grid-cols-1 gap-y-2.5">
                  {property.amenities?.slice(0, 5).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                  {(property.amenities?.length ?? 0) > 5 && (
                    <div className="flex items-center gap-3 text-muted-foreground text-xs italic mt-1">
                      <span>+ {(property.amenities?.length ?? 0) - 5} more amenities</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    onClick={(e) => { e.stopPropagation(); }}
                    className="w-full"
                  >
                    Check Availability
                  </Button>
                </DialogTrigger>
                <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-[400px] border-none bg-slate-950 text-white flex flex-col items-center">
                  <DialogHeader className="w-full text-center">
                    <DialogTitle>Availability</DialogTitle>
                  </DialogHeader>
                  <Calendar
                    mode="multiple"
                    disabled={[{ before: getPhTime() }]}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    className="bg-slate-900 rounded-xl p-4 border border-slate-800"
                  />
                  <div className="flex items-center gap-6 mt-4 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div> Booked
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white"></div> Available
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                onClick={(e) => { e.stopPropagation(); navigate(`/property/${property.id}`); }}
                className="w-full"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Invisible spacer to give the card height since front and back are absolute */}
      <div className={`invisible ${isFeaturedBento ? 'h-[400px]' : 'h-[480px]'}`}></div>
    </div>
  );
}
