import { useSearchParams } from 'react-router-dom';
import MovieCard from '../../components/feature/MovieCard';

// Mock Data combined
const ALL_MOVIES = [
  { id: 1, title: 'Deadpool & Wolverine', genre: 'Hành động, Hài', posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', ageLimit: 18 },
  { id: 2, title: 'Inside Out 2', genre: 'Hoạt hình, Gia đình', posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', ageLimit: 13 },
  { id: 3, title: 'A Quiet Place: Day One', genre: 'Kinh dị, Khoa học viễn tưởng', posterUrl: 'https://image.tmdb.org/t/p/w500/yrpPYKijwdMTEOBmQLyEtT06Efb.jpg', ageLimit: 16 },
  { id: 4, title: 'Despicable Me 4', genre: 'Hoạt hình, Hài', posterUrl: 'https://image.tmdb.org/t/p/w500/3w84hCFJATpiCO5g8hpd0Rv4Xk4.jpg', ageLimit: null },
  { id: 5, title: 'Alien: Romulus', genre: 'Kinh dị, Khoa học viễn tưởng', posterUrl: 'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZTasyIw4n.jpg', ageLimit: 18 },
  { id: 6, title: 'Kraven the Hunter', genre: 'Hành động, Phiêu lưu', posterUrl: 'https://image.tmdb.org/t/p/w500/i47IUSsN126K11JU1qN9jOQoP2d.jpg', ageLimit: 16 },
  { id: 7, title: 'Gladiator II', genre: 'Hành động, Lịch sử', posterUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg', ageLimit: 18 },
  { id: 8, title: 'Wicked', genre: 'Kỳ ảo, Nhạc kịch', posterUrl: 'https://image.tmdb.org/t/p/w500/df1ZqX4YI6L4vE6f06n4f8X7U0o.jpg', ageLimit: 13 },
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = ALL_MOVIES.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase()) || 
    movie.genre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-[1200px] py-12 min-h-[60vh]">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Kết quả tìm kiếm cho: <span className="text-[#E50914]">"{query}"</span>
      </h1>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#141414] rounded-lg">
          <p className="text-xl text-[#A1A1A1]">Không tìm thấy bộ phim nào phù hợp với từ khóa của bạn.</p>
          <p className="text-sm text-[#555555] mt-2">Vui lòng thử lại với từ khóa khác.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
