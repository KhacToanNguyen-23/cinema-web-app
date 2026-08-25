const Footer = () => {
  return (
    <footer className="w-full bg-surface-container py-xl border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-xl flex flex-col md:flex-row justify-between items-center gap-lg">
        <div className="flex items-center gap-md">
          <img
            alt="CineMax Logo"
            className="h-6 w-auto opacity-50"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvgg4Wp22jeCWvGm7j5FrWuV9C-uvktLjp2ovGPx-G0r2HdOQ2mFzJvCHwf8w2za9LIo88snmW7BpglMbUYw_CHEgMv3PAxmuMMl3rlzllLdn_ufPtKhO7ATJVZyP73g8TGAr0gOcyAVML12RXVNs5xeQKTMBtBbSIE7UHN6JnERF2Lbl1PvUKPGItJShOhNEoqiEuuLvLsHi_QjXs5TeaiT9Az72MMGFksd2c--ny21fcSFOKPiwY"
          />
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant">
              © 2024 CINEMAX PREMIUM ENTERTAINMENT
            </p>
          </div>
        </div>
        <div className="flex gap-lg">
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
