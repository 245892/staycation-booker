import { Link } from 'react-router-dom';
import { Property } from '@/types/booking';
import { Users, MapPin, Bed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import unitPreview from '@/assets/unit-preview.jpg';


interface Props {
  property: Property;
  isFeaturedBento?: boolean;
}

export default function PropertyCard({ property, isFeaturedBento }: Props) {
  return (
    <Link 
      to={`/property/${property.id}`} 
      className={`group block ${isFeaturedBento ? 'md:col-span-2 lg:row-span-2' : ''}`}
    >
      <div className={`rounded-2xl overflow-hidden bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 h-full flex ${isFeaturedBento ? 'flex-col md:flex-row' : 'flex-col'}`}>
        
        {/* Image Container */}
        <div className={`overflow-hidden relative ${isFeaturedBento ? 'md:w-3/5 min-h-[280px] md:min-h-[400px]' : 'aspect-[4/3] w-full'}`}>
          <img
            src={property.gallery?.[0] ?? unitPreview}
            alt={property.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {isFeaturedBento && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-primary/95 hover:bg-primary text-white backdrop-blur-md border-none shadow-lg px-3 py-1 font-semibold">
                Featured Unit
              </Badge>
            </div>
          )}
        </div>
        
        {/* Content Container */}
        <div className={`flex flex-col flex-1 ${isFeaturedBento ? 'p-6 lg:p-10 justify-center' : 'p-5'}`}>
          <div className="flex justify-between items-start gap-2 mb-2">
            <div>
              <h3 className={`font-display font-semibold line-clamp-1 transition-colors group-hover:text-primary ${isFeaturedBento ? 'text-2xl lg:text-3xl mb-2' : 'text-lg'}`}>
                {property.name}
              </h3>
              <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <MapPin className="h-3.5 w-3.5 text-primary/70" /> MOA Complex · {property.floor}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium ${isFeaturedBento ? 'my-5 lg:my-6' : 'my-3'}`}>
            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2 py-1.5 rounded-md">
              <Users className="h-3.5 w-3.5 text-slate-400" /> {property.maxGuests} guests
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2 py-1.5 rounded-md">
              <Bed className="h-3.5 w-3.5 text-slate-400" /> {property.amenities?.[0] || '1 Bed'}
            </span>
          </div>

          <p className={`text-slate-500 dark:text-slate-400 flex-grow leading-relaxed ${isFeaturedBento ? 'text-base lg:text-lg line-clamp-3 mb-8' : 'text-sm line-clamp-2 mb-5'}`}>
            {property.description}
          </p>
          
          <div className="pt-4 border-t border-slate-100 dark:border-border flex justify-between items-center mt-auto">
            <p className={`font-semibold tracking-tight text-slate-900 dark:text-white ${isFeaturedBento ? 'text-2xl lg:text-3xl' : 'text-lg'}`}>
              ₱{property.pricePerNight.toLocaleString()} <span className="text-xs lg:text-sm font-normal text-slate-400">/ night</span>
            </p>
            <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Unit <span className="text-lg leading-none">&rsaquo;</span>
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}
