package com.cinema.component;

import com.cinema.entity.User;
import com.cinema.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Tài khoản Admin
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("123456"))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
        }

        // 2. Tài khoản Manager
        if (userRepository.findByUsername("manager").isEmpty()) {
            User manager = User.builder()
                    .username("manager")
                    .password(passwordEncoder.encode("123456"))
                    .role("MANAGER")
                    .build();
            userRepository.save(manager);
        }

        // 3. Tài khoản Staff
        if (userRepository.findByUsername("staff").isEmpty()) {
            User staff = User.builder()
                    .username("staff")
                    .password(passwordEncoder.encode("123456"))
                    .role("STAFF")
                    .build();
            userRepository.save(staff);
        }

        // 4. Tài khoản Khách hàng (Member)
        if (userRepository.findByUsername("customer").isEmpty()) {
            User member = User.builder()
                    .username("customer")
                    .password(passwordEncoder.encode("123456"))
                    .role("MEMBER")
                    .build();
            userRepository.save(member);
        }

        // --- KHỞI TẠO DỮ LIỆU RẠP & PHIM MẪU ---
        initCinemaData();

        System.out.println("=========================================");
        System.out.println("✅ KHỞI TẠO TÀI KHOẢN & DỮ LIỆU MẪU THÀNH CÔNG");
        System.out.println("👉 Admin: admin / 123456");
        System.out.println("👉 Manager: manager / 123456");
        System.out.println("👉 Staff: staff / 123456");
        System.out.println("👉 Customer: customer / 123456");
        System.out.println("=========================================");
    }

    private final com.cinema.repository.RegionRepository regionRepository;
    private final com.cinema.repository.CinemaRepository cinemaRepository;
    private final com.cinema.repository.RoomRepository roomRepository;
    private final com.cinema.repository.SeatRepository seatRepository;
    private final com.cinema.repository.MovieRepository movieRepository;
    private final com.cinema.repository.ShowtimeRepository showtimeRepository;

    private void initCinemaData() {
        if (regionRepository.count() > 0) return; // Nếu đã có dữ liệu thì không tạo lại

        // 1. Tạo Region
        com.cinema.entity.Region region = new com.cinema.entity.Region();
        region.setName("TP. Hồ Chí Minh");
        region.setCode("HCM");
        region.setActive(true);
        region = regionRepository.save(region);

        // 2. Tạo Cinema
        com.cinema.entity.Cinema cinema = new com.cinema.entity.Cinema();
        cinema.setName("CGV Sư Vạn Hạnh");
        cinema.setAddress("Tầng 6 Vạn Hạnh Mall, Quận 10");
        cinema.setPhoneNumber("19001530");
        cinema.setRegion(region);
        cinema.setActive(true);
        cinema = cinemaRepository.save(cinema);

        // 3. Tạo Room
        com.cinema.entity.Room room = new com.cinema.entity.Room();
        room.setCinema(cinema);
        room.setRoomType("IMAX");
        room.setCapacity(50);
        room.setActive(true);
        room = roomRepository.save(room);

        // 4. Tạo Seats cho Room (Tạo 3 ghế mẫu)
        for (int i = 1; i <= 3; i++) {
            com.cinema.entity.Seat seat = new com.cinema.entity.Seat();
            seat.setRoom(room);
            seat.setSeatRow("A");
            seat.setSeatColumn(i);
            seat.setType(com.cinema.entity.SeatType.NORMAL);
            seat.setPriceMultiplier(1.0);
            seat.setActive(true);
            seatRepository.save(seat);
        }

        // 5. Tạo Movie
        com.cinema.entity.Movie movie = new com.cinema.entity.Movie();
        movie.setTitle("Avenger: Endgame");
        movie.setDescription("Siêu phẩm Marvel");
        movie.setDuration(181);
        movie.setActive(true);
        movie = movieRepository.save(movie);

        // 6. Tạo Showtime
        com.cinema.entity.Showtime showtime = new com.cinema.entity.Showtime();
        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(java.time.LocalDateTime.now().plusDays(1).withHour(19).withMinute(0));
        showtime.setEndTime(java.time.LocalDateTime.now().plusDays(1).withHour(22).withMinute(0));
        showtime.setPrice(100000); // 100k
        showtimeRepository.save(showtime);
    }
}
