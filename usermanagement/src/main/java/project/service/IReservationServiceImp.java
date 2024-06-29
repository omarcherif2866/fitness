package project.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.models.*;
import project.repository.*;

import java.util.List;

@RequiredArgsConstructor
@Service
public class IReservationServiceImp implements IReservationService {
    private final ReservationRepository reservationRepository;

    private final CoursRepository coursRepository;

    private final UserRepository userRepository;

    private final TerrainRepository terrainRepository;

    private final CoachRepository coachRepository;

    @Override
    public Reservation createReservation(Reservation reservation) {
        reservation.setStatus(Status.EN_ATTENTE);

        UserEntity user = userRepository.findById(reservation.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Optionnel : Vérifiez l'existence et associez le cours, terrain et coach si fournis
        if (reservation.getCours() != null) {
            Cours cours = coursRepository.findById(reservation.getCours().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Cours not found"));
            reservation.setCours(cours);
            cours.getReservations().add(reservation);
        }

        if (reservation.getTerrain() != null) {
            Terrain terrain = terrainRepository.findById(reservation.getTerrain().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Terrain not found"));
            reservation.setTerrain(terrain);
            terrain.getReservations().add(reservation);
        }

        if (reservation.getCoach() != null) {
            Coach coach = coachRepository.findById(reservation.getCoach().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Coach not found"));
            reservation.setCoach(coach);
            coach.getReservations().add(reservation);
        }

        Reservation savedReservation = reservationRepository.save(reservation);

        user.getReservations().add(savedReservation);
        userRepository.save(user);

        return savedReservation;
    }


    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
    }

    @Override
    public Reservation updateReservation(Long id, Reservation reservation) {
        Reservation existingReservation = getReservationById(id);

        // Vérifiez et mettez à jour chaque champ un par un
        if (reservation.getDate() != null) {
            existingReservation.setDate(reservation.getDate());
        }
        if (reservation.getHeure() != null) {
            existingReservation.setHeure(reservation.getHeure());
        }
        if (reservation.getUser() != null) {
            existingReservation.setUser(reservation.getUser());
        }
        if (reservation.getCours() != null) {
            existingReservation.setCours(reservation.getCours());
        }
        if (reservation.getTerrain() != null) {
            existingReservation.setTerrain(reservation.getTerrain());
        }
        if (reservation.getCoach() != null) {
            existingReservation.setCoach(reservation.getCoach());
        }

        // Enregistrez l'objet mis à jour dans la base de données
        return reservationRepository.save(existingReservation);
    }


    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    @Override
    public List<Reservation> getReservationsByUserId(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    @Override
    public Reservation updateReservationStatus(Long reservationId, Status status) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reservation ID"));
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }
}
