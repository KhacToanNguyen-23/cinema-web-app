import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-[#1A1A1A] transition-transform duration-300 hover:scale-105">
      {/* Aspect Ratio 2:3 container */}
      <div className="relative aspect-[2/3] w-full">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-4">
          <button className="flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-colors font-semibold">
            <Play size={18} fill="currentColor" /> Trailer
          </button>
          <Link 
            to={`/movie/${movie.id}`} 
            className="bg-[#E50914] text-white px-8 py-2 rounded-full hover:bg-[#D22027] hover:shadow-[0_0_15px_rgba(229,9,20,0.5)] transition-all font-semibold"
          >
            Mua Vé
          </Link>
        </div>
        {/* Age rating */}
        {movie.ageLimit && (
          <div className="absolute top-2 right-2 bg-[#E50914] text-white text-xs font-bold px-2 py-1 rounded">
            C{movie.ageLimit}
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white truncate uppercase" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-sm text-[#A1A1A1] mt-1 line-clamp-2">
          {movie.genre}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
