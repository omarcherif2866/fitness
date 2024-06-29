package project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.models.Reservation;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation,Long > {
    List<Reservation> findByUserId(Long userId);

}
