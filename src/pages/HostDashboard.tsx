import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingContext';
import { useWaitlist } from '@/context/WaitlistContext';
import { properties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, addDays, isBefore, isSameDay, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, differenceInDays } from 'date-fns';
import { LogOut, CalendarDays, Users, Building2, Zap, Bell, TrendingUp, ChevronRight, Home, CreditCard } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { findGaps } from '@/lib/pricing';

export default function HostDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const { bookings, updateBookingStatus } = useBookings();
  const { entries: waitlistEntries } = useWaitlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'waitlist'>('bookings');

  // Gap detection across all properties
  const allGaps = useMemo(() => {
    const gaps: { propertyId: string; propertyName: string; date: Date }[] = [];
    properties.forEach(p => {
      const propertyGaps = findGaps(bookings, p.id);
      propertyGaps.forEach(g => {
        gaps.push({ propertyId: p.id, propertyName: p.name, date: g.date });
      });
    });
    return gaps;
  }, [bookings]);

  if (!isAuthenticated) {
    navigate('/host/login', { replace: true });
    return null;
  }

  const sorted = [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;

  const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + b.totalPrice, 0);
  const occupiedNights = bookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + differenceInDays(new Date(b.checkOut), new Date(b.checkIn)), 0);
  const occupancyRate = properties.length ? Math.min(100, Math.round((occupiedNights / (properties.length * 30)) * 100)) : 0;

  const getPropertyName = (id: string) => properties.find(p => p.id === id)?.name ?? id;

  // Multi-calendar data
  const today = new Date();
  const calendarStart = startOfMonth(today);
  const calendarEnd = endOfMonth(addMonths(today, 1));
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getBookingForDay = (propertyId: string, day: Date) => {
    return bookings.find(b =>
      b.propertyId === propertyId &&
      b.status !== 'cancelled' &&
      new Date(b.checkIn) <= day &&
      new Date(b.checkOut) > day
    );
  };


  return (
    <div className="min-h-screen bg-muted/20">
      {/* Breadcrumbs */}
      <div className="bg-background border-b sticky top-0 z-10 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-12 text-sm text-muted-foreground">
          <Home className="h-4 w-4 mr-2" />
          <span>Staycation Booker</span>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <span className="text-foreground font-medium">Host Dashboard</span>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <span className="text-foreground capitalize">{activeTab === 'calendar' ? 'Multi-Calendar' : activeTab}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="hidden lg:block">
              <h1 className="font-display text-2xl font-bold mb-1">Dashboard</h1>
              <p className="text-sm text-muted-foreground mb-6">Manage properties</p>
            </div>

            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {(['bookings', 'calendar', 'waitlist'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all min-w-max lg:min-w-0 duration-300",
                    activeTab === tab 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === 'bookings' && <CalendarDays className="h-4 w-4" />}
                  {tab === 'calendar' && <Building2 className="h-4 w-4" />}
                  {tab === 'waitlist' && <Bell className="h-4 w-4" />}
                  <span className="capitalize">{tab === 'calendar' ? 'Multi-Calendar' : tab}</span>
                </button>
              ))}
            </nav>

            <Button variant="outline" className="w-full justify-start mt-auto" onClick={() => { logout(); navigate('/host/login'); }}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* SaaS Metrics Row */}
            {activeTab === 'bookings' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                <div className="bg-card rounded-xl p-5 border shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CreditCard className="w-16 h-16"/></div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold font-display">₱{totalRevenue.toLocaleString()}</p>
                  <div className="mt-2 flex items-center text-xs text-success font-medium">
                    <TrendingUp className="h-3 w-3 mr-1"/>
                    <span>+12% from last month</span>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl p-5 border shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Building2 className="w-16 h-16"/></div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Occupancy Rate</p>
                  <p className="text-2xl font-bold font-display">{occupancyRate}%</p>
                  <div className="mt-2 flex items-center text-xs text-success font-medium">
                    <TrendingUp className="h-3 w-3 mr-1"/>
                    <span>+5% from last month</span>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-5 border shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-16 h-16"/></div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Confirmed Bookings</p>
                  <p className="text-2xl font-bold font-display">{confirmed}</p>
                  <div className="mt-2 flex items-center text-xs text-muted-foreground font-medium">
                    <span>{sorted.length - confirmed} pending actions</span>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-5 border shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Zap className="w-16 h-16"/></div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Gap Alerts</p>
                  <p className="text-2xl font-bold font-display">{allGaps.length}</p>
                  <div className="mt-2 flex items-center text-xs text-destructive font-medium">
                    <Zap className="h-3 w-3 mr-1"/>
                    <span>Action required</span>
                  </div>
                </div>
              </div>
            )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">All Bookings</h2>
              {allGaps.length > 0 && (
                <Badge variant="outline" className="gap-1 text-destructive border-destructive/30">
                  <Zap className="h-3 w-3" /> {allGaps.length} gap{allGaps.length > 1 ? 's' : ''} detected
                </Badge>
              )}
            </div>

            {sorted.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No bookings yet. Guests will appear here once they book.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-6 py-3 font-medium">Booking ID</th>
                      <th className="text-left px-6 py-3 font-medium">Guest</th>
                      <th className="text-left px-6 py-3 font-medium">Unit</th>
                      <th className="text-left px-6 py-3 font-medium">Dates</th>
                      <th className="text-left px-6 py-3 font-medium">Total</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                      <th className="text-left px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(b => (
                      <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{b.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{b.guestName}</p>
                          <p className="text-xs text-muted-foreground">{b.guestEmail}</p>
                        </td>
                        <td className="px-6 py-4">{getPropertyName(b.propertyId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(b.checkIn), 'MMM d')} – {format(new Date(b.checkOut), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 font-medium">₱{b.totalPrice.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <Badge variant={b.status === 'confirmed' ? 'default' : b.status === 'cancelled' ? 'destructive' : 'secondary'}>
                            {b.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {b.status === 'confirmed' && (
                            <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, 'cancelled')}>
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Multi-Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-display text-lg font-semibold">Unit Availability — {format(calendarStart, 'MMM yyyy')} to {format(calendarEnd, 'MMM yyyy')}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-3 py-2 font-medium sticky left-0 bg-muted/50 min-w-[140px]">Unit</th>
                    {allDays.map(day => (
                      <th key={day.toISOString()} className={cn(
                        "px-1 py-2 font-medium text-center min-w-[28px]",
                        isSameDay(day, today) && "bg-secondary/20"
                      )}>
                        <div>{format(day, 'd')}</div>
                        <div className="text-[10px] text-muted-foreground">{format(day, 'EEE')}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="px-3 py-2 font-medium sticky left-0 bg-card whitespace-nowrap">{p.name}</td>
                      {allDays.map(day => {
                        const booking = getBookingForDay(p.id, day);
                        const isGap = allGaps.some(g => g.propertyId === p.id && isSameDay(g.date, day));
                        return (
                          <td key={day.toISOString()} className={cn(
                            "px-1 py-2 text-center",
                            booking && "bg-secondary/30",
                            isGap && "bg-destructive/20",
                            isSameDay(day, today) && "ring-1 ring-inset ring-secondary/50"
                          )}>
                            {booking && <div className="w-2 h-2 rounded-full bg-secondary mx-auto" />}
                            {isGap && <Zap className="h-3 w-3 text-destructive mx-auto" />}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allGaps.length > 0 && (
              <div className="px-6 py-4 border-t bg-muted/30">
                <p className="text-sm font-medium mb-2 flex items-center gap-1"><Zap className="h-4 w-4 text-destructive" /> Gap Filler Opportunities</p>
                <div className="flex flex-wrap gap-2">
                  {allGaps.map((g, i) => (
                    <Badge key={i} variant="outline" className="gap-1 text-destructive border-destructive/30">
                      {g.propertyName} — {format(g.date, 'MMM d')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Waitlist Tab */}
        {activeTab === 'waitlist' && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-display text-lg font-semibold">Waitlist Entries</h2>
            </div>
            {waitlistEntries.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No waitlist entries yet. Guests can join when dates are unavailable.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-6 py-3 font-medium">ID</th>
                      <th className="text-left px-6 py-3 font-medium">Guest</th>
                      <th className="text-left px-6 py-3 font-medium">Unit</th>
                      <th className="text-left px-6 py-3 font-medium">Desired Dates</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlistEntries.map(e => (
                      <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{e.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{e.guestName}</p>
                          <p className="text-xs text-muted-foreground">{e.guestEmail}</p>
                        </td>
                        <td className="px-6 py-4">{getPropertyName(e.propertyId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(e.desiredCheckIn), 'MMM d')} – {format(new Date(e.desiredCheckOut), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={e.notified ? 'default' : 'secondary'}>
                            {e.notified ? 'Notified' : 'Waiting'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
