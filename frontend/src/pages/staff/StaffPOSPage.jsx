import { useState, useMemo } from 'react';

const TICKET_PRICE = 14.50;

const ADDONS = [
  { id: 'a1', name: 'Lrg Popcorn', price: 8.50, icon: 'local_dining', color: 'text-secondary-fixed' },
  { id: 'a2', name: 'Med Soda', price: 5.00, icon: 'local_drink', color: 'text-tertiary-fixed' },
  { id: 'a3', name: 'Nachos', price: 4.50, icon: 'tapas', color: 'text-primary-fixed' },
  { id: 'a4', name: 'Candy Box', price: 3.00, icon: 'icecream', color: 'text-on-surface-variant' }
];

const MOVIES = [
  {
    id: 'm1',
    title: 'Dune: Part Two',
    info: '166 min • Sci-Fi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyuOKboyR3J79DtbDAQrx5SWsc9keibNSthHh7moqYb_gZ3X24YjSrlTbjF7AGahYM9AwztJdR9D3HsE6hGOixrAaSM7tsQoMBYGKTamDrtzeumhHgIFcnLM_S-vTL9WbldUcGp9RPMnC_WhrzniClft17LnmoxUasJLHzSo8ivBglCkcSmDCClPeiyLJufrY_ARLL9CQvZB8Z9n22a9tLZk8FtP3B3lUv-CKJX4AsTqvM_Sbi3Zju',
    badge: 'IMAX',
    badgeColor: 'bg-primary-container text-on-primary-container',
    showtimes: ['14:30', '18:00', '21:15']
  },
  {
    id: 'm2',
    title: 'Godzilla x Kong',
    info: '115 min • Action',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBScRRhxeQxMEASiD4Klp4TCfz_y1USh2mzoF4BVHFFdVtwAHO6HAuuAuzzmnChpW-GJW1V2IpeD3jjP0VhX0-IOHmoIM9iJ23GOJpH6LNVh8NnmVWvkAQA9tdRXlacrP3FJSM4vwYBOjv3mVxUa0lmU_NGsN84IgfLshUXE3a0drLPOUFwMfDBl-hV0avumv8VPxTmdS74djzP8d5fTnUme3BuzquGo-jlDpanPlUcT0nu_xoAAUKF',
    badge: '3D',
    badgeColor: 'bg-secondary-container text-on-secondary-container',
    showtimes: ['13:15', '15:45', '19:30']
  },
  {
    id: 'm3',
    title: 'Civil War',
    info: '109 min • Thriller',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNyA9sLwPjSvLZsBy6L9xDblunrWeQCQeDC3b2yr00Ks9ZKGtddSdzDV6U9QkCfuPJjosCrJHwbpeUYnr4i1Ab08xVfm13vAfK5aey5r1sGwnXOyhIn4XoNkq10m8NiQxDBejTZvhXRdiSlCSk0PO9MSHZUfCb_dBGoLiP8iy23nui5NPTxKFMbWMxJ2V56s-O9laqL0CKBl17dA-R8FwqHCimB2y4yI2NPaE98FWvhRWmdsTxdnPt',
    showtimes: ['16:00', '20:20', '22:45 (Sold Out)']
  }
];

const StaffPOSPage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  
  // Generating a static seat map for demo
  const seatRows = useMemo(() => {
    const rows = ['A','B','C','D','E','F','G','H'];
    return rows.map((rowLabel, rIndex) => {
      const blocks = [4, 6, 4];
      let seatNum = 1;
      const rowBlocks = blocks.map(blockSize => {
        const seatsInBlock = [];
        for(let i=0; i<blockSize; i++) {
          const seatId = `${rowLabel}${seatNum}`;
          const isTaken = Math.random() < (0.4 + (rIndex * 0.05)) && rIndex > 1; 
          seatsInBlock.push({ id: seatId, isTaken });
          seatNum++;
        }
        return seatsInBlock;
      });
      return { label: rowLabel, blocks: rowBlocks };
    });
  }, [selectedShowtime]); // Re-generate seats when showtime changes

  const handleShowtimeClick = (movie, time) => {
    if (time.includes('Sold Out')) return;
    setSelectedMovie(movie);
    setSelectedShowtime(time);
    // clear tickets from cart when changing showtime
    setCartItems(prev => prev.filter(item => item.type !== 'ticket'));
  };

  const handleBackToMovies = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
  };

  const handleSeatClick = (seat) => {
    if (seat.isTaken) return;
    
    setCartItems(prev => {
      const exists = prev.find(item => item.id === `seat-${seat.id}`);
      if (exists) {
        return prev.filter(item => item.id !== `seat-${seat.id}`);
      } else {
        return [...prev, {
          type: 'ticket',
          id: `seat-${seat.id}`,
          name: `Ticket • Seat ${seat.id}`,
          price: TICKET_PRICE
        }];
      }
    });
  };

  const handleAddonClick = (addon) => {
    setCartItems(prev => [...prev, {
      type: 'addon',
      id: `addon-${Date.now()}-${Math.random()}`,
      name: addon.name,
      price: addon.price
    }]);
  };

  const removeCartItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden">
        
        {/* Left Panel: Movie & Showtime Selection / Seat Map */}
        <div className="flex-1 overflow-y-auto bg-surface-container-lowest flex flex-col p-lg gap-xl custom-scrollbar relative">
          
          {!selectedMovie ? (
            <>
              {/* Date & Quick Filters */}
              <div className="flex items-center justify-between sticky top-0 z-10 bg-surface-container-lowest/90 backdrop-blur-md pb-md border-b border-surface-container-highest">
                <div className="flex items-center gap-md overflow-x-auto no-scrollbar py-sm">
                  <button className="px-md py-sm rounded-full bg-primary text-on-primary font-label-caps text-label-caps shrink-0 shadow-sm transition-transform hover:scale-105">TODAY</button>
                  <button className="px-md py-sm rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-container-high font-label-caps text-label-caps shrink-0 transition-colors">TMRW</button>
                  <button className="px-md py-sm rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-container-high font-label-caps text-label-caps shrink-0 transition-colors">FRI 24</button>
                  <button className="px-md py-sm rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-container-high font-label-caps text-label-caps shrink-0 transition-colors">SAT 25</button>
                </div>
                <div className="relative w-64">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                  <input className="w-full bg-surface-container text-on-surface font-body-md text-body-md py-sm pl-xl pr-md rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder-on-surface-variant transition-all" placeholder="Search title..." type="text" />
                </div>
              </div>

              {/* Movie Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-lg">
                {MOVIES.map(movie => (
                  <div key={movie.id} className="movie-card group flex flex-col gap-sm rounded-xl overflow-hidden bg-surface-container hover:bg-surface-container-high transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="relative aspect-[2/3] w-full overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${movie.image}')` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-80"></div>
                      {movie.badge && (
                        <div className={`absolute top-sm right-sm font-label-caps text-[10px] px-sm py-xs rounded ${movie.badgeColor}`}>
                          {movie.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-md flex flex-col gap-xs">
                      <h3 className="font-headline-md text-[18px] text-on-surface leading-tight truncate">{movie.title}</h3>
                      <p className="font-body-md text-[14px] text-on-surface-variant">{movie.info}</p>
                      <div className="flex flex-wrap gap-sm mt-sm">
                        {movie.showtimes.map(time => {
                          const disabled = time.includes('Sold Out');
                          return (
                            <button 
                              key={time}
                              disabled={disabled}
                              onClick={() => handleShowtimeClick(movie, time)}
                              className={`px-sm py-xs rounded bg-surface-container-highest font-button text-[12px] border border-transparent transition-colors
                                ${disabled 
                                  ? 'text-on-surface opacity-50 cursor-not-allowed' 
                                  : 'text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary'}`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Seat Map Section */
            <div className="flex flex-col gap-lg bg-surface-container rounded-2xl p-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <button onClick={handleBackToMovies} className="p-sm rounded-full bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div>
                    <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-surface">Select Seats</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Screen 4 • {selectedShowtime}</p>
                  </div>
                </div>
                <div className="flex gap-lg">
                  <div className="flex items-center gap-xs"><div className="w-4 h-4 rounded-sm border border-on-surface-variant"></div><span className="font-label-caps text-[10px] text-on-surface-variant">AVAILABLE</span></div>
                  <div className="flex items-center gap-xs"><div className="w-4 h-4 rounded-sm bg-secondary text-on-secondary flex items-center justify-center"><span className="material-symbols-outlined text-[12px]">done</span></div><span className="font-label-caps text-[10px] text-on-surface-variant">SELECTED</span></div>
                  <div className="flex items-center gap-xs"><div className="w-4 h-4 rounded-sm bg-error-container text-on-error-container flex items-center justify-center"><span className="material-symbols-outlined text-[12px]">close</span></div><span className="font-label-caps text-[10px] text-on-surface-variant">TAKEN</span></div>
                </div>
              </div>
              
              {/* The Screen */}
              <div className="w-full flex flex-col items-center mt-md mb-xl">
                <div className="w-3/4 h-2 bg-gradient-to-b from-surface-bright to-transparent rounded-t-full shadow-[0_-10px_30px_rgba(255,255,255,0.1)]"></div>
                <span className="font-label-caps text-[10px] text-on-surface-variant mt-sm tracking-[0.3em]">SCREEN</span>
              </div>
              
              {/* Seats Grid */}
              <div className="flex flex-col gap-sm items-center overflow-x-auto pb-lg no-scrollbar">
                {seatRows.map((row) => (
                  <div key={row.label} className="flex items-center gap-xs">
                    <div className="w-6 text-center font-label-caps text-on-surface-variant mr-sm">{row.label}</div>
                    <div className="flex gap-md">
                      {row.blocks.map((block, bIdx) => (
                        <div key={bIdx} className="flex gap-xs">
                          {block.map(seat => {
                            const isSelected = cartItems.some(i => i.id === `seat-${seat.id}`);
                            return (
                              <button
                                key={seat.id}
                                disabled={seat.isTaken}
                                onClick={() => handleSeatClick(seat)}
                                className={`seat-btn ${seat.isTaken ? 'seat-taken' : isSelected ? 'seat-selected' : 'seat-available'}`}
                              >
                                {seat.isTaken ? (
                                  <span className="material-symbols-outlined text-[14px]">close</span>
                                ) : isSelected ? (
                                  <span className="material-symbols-outlined text-[16px]">done</span>
                                ) : (
                                  seat.id
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Cart & Checkout */}
        <div className="w-96 bg-surface flex flex-col shadow-xl z-20 border-l border-surface-container-highest">
          <div className="p-lg bg-surface-container-lowest flex flex-col gap-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">receipt_long</span> Current Order
            </h2>
            <p className="font-body-md text-[14px] text-on-surface-variant">Order #9942 • Counter 2</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-md custom-scrollbar bg-surface/50">
            <div className="flex flex-col gap-sm">
              {cartItems.length === 0 ? (
                <div className="text-center py-xl text-on-surface-variant font-body-md italic">No items selected yet.</div>
              ) : (
                cartItems.map(item => {
                  const isTicket = item.type === 'ticket';
                  const icon = isTicket ? 'confirmation_number' : 'fastfood';
                  const colorClass = isTicket ? 'text-primary' : 'text-secondary-fixed';
                  return (
                    <div key={item.id} className="flex justify-between items-center bg-surface-container rounded-lg p-sm pl-md border border-surface-container-highest shadow-sm group">
                      <div className="flex items-center gap-sm">
                        <span className={`material-symbols-outlined ${colorClass} text-[18px]`}>{icon}</span>
                        <span className="font-button text-[13px] text-on-surface">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-sm">
                        <span className="font-body-md text-[13px] text-on-surface-variant">${item.price.toFixed(2)}</span>
                        <button 
                          onClick={() => removeCartItem(item.id)}
                          className="text-error hover:text-error-container p-xs rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Add-ons Section */}
            <div className="mt-xl pt-lg border-t border-surface-container-highest">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md tracking-wider">QUICK ADD-ONS</h3>
              <div className="grid grid-cols-2 gap-sm">
                {ADDONS.map(addon => (
                  <button 
                    key={addon.id}
                    onClick={() => handleAddonClick(addon)}
                    className="flex flex-col items-center justify-center gap-xs p-md bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors shadow-sm"
                  >
                    <span className={`material-symbols-outlined ${addon.color} text-[32px]`}>{addon.icon}</span>
                    <span className="font-button text-[12px] text-on-surface">{addon.name}</span>
                    <span className="font-body-md text-[12px] text-on-surface-variant">${addon.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Totals & Actions */}
          <div className="bg-surface-container-lowest p-lg shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-30">
            <div className="flex justify-between items-center mb-sm">
              <span className="font-body-md text-on-surface-variant">Subtotal</span>
              <span className="font-body-md text-on-surface">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-lg">
              <span className="font-body-md text-on-surface-variant">Tax (8%)</span>
              <span className="font-body-md text-on-surface">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end mb-xl border-t border-surface-container-highest pt-sm">
              <span className="font-headline-md text-[18px] text-on-surface uppercase tracking-wide">Total</span>
              <span className="font-display-lg-mobile text-[36px] text-primary leading-none">${total.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-sm mb-lg">
              <button className="py-md bg-surface-container rounded-lg flex flex-col items-center gap-xs hover:bg-surface-container-high hover:text-primary transition-all text-on-surface shadow-sm">
                <span className="material-symbols-outlined">payments</span>
                <span className="font-label-caps text-[10px]">CASH</span>
              </button>
              <button className="py-md bg-surface-container rounded-lg flex flex-col items-center gap-xs hover:bg-surface-container-high hover:text-primary transition-all text-on-surface shadow-sm">
                <span className="material-symbols-outlined">credit_card</span>
                <span className="font-label-caps text-[10px]">CARD</span>
              </button>
              <button className="py-md bg-surface-container rounded-lg flex flex-col items-center gap-xs hover:bg-surface-container-high hover:text-primary transition-all text-on-surface shadow-sm">
                <span className="material-symbols-outlined">qr_code_scanner</span>
                <span className="font-label-caps text-[10px]">QR PAY</span>
              </button>
            </div>
            
            <button 
              disabled={cartItems.length === 0}
              className="w-full py-md bg-primary text-on-primary font-button text-[16px] rounded-lg shadow-lg hover:shadow-xl hover:bg-primary-container transition-all flex justify-center items-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">print</span>
              PRINT TICKETS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPOSPage;
