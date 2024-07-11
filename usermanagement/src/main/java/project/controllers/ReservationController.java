package project.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.models.Reservation;
import project.models.Status;
import project.models.UserEntity;
import project.service.EmailService;
import project.service.IReservationService;

import java.util.List;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final IReservationService reservationService;
    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<Reservation> addReservation(@RequestBody Reservation reservation) {
        Reservation createdReservation = reservationService.createReservation(reservation);
        return ResponseEntity.ok(createdReservation);
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Reservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) {
        Reservation updatedReservation = reservationService.updateReservation(id, reservation);
        return ResponseEntity.ok(updatedReservation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

  /*  @PutMapping("/status/{reservationId}")
    public ResponseEntity<Reservation> updateReservationStatus(
            @PathVariable Long reservationId,
            @RequestParam("status") Status status) {
        try {
            Reservation updatedReservation = reservationService.updateReservationStatus(reservationId, status);



            return ResponseEntity.ok(updatedReservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    } */


    @PutMapping("/status/{reservationId}")
    public ResponseEntity<Reservation> updateReservationStatus(
            @PathVariable Long reservationId,
            @RequestParam("status") Status status) {
        try {
            Reservation updatedReservation = reservationService.updateReservationStatus(reservationId, status);

            // Envoyer un e-mail de notification à l'utilisateur
            String userEmail = updatedReservation.getUser().getEmail();
            String emailTo = userEmail;
            String emailSubject = "Mise à jour du statut de votre réservation";
            String emailBody = "Bonjour " + updatedReservation.getUser().getUsername() + ",\n\n" +
                    "Le statut de votre réservation pour l'activité " + updatedReservation.getCours().getNom() + " a été mis à jour à '' " + status + "  ''.\n\n" +
                    "Merci,\nL'équipe";
            emailService.sendEmail(emailTo, emailSubject, emailBody);


            return ResponseEntity.ok(updatedReservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUserId(@PathVariable Long userId) {
        List<Reservation> reservations = reservationService.getReservationsByUserId(userId);
        if (reservations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reservations);
    }
}


