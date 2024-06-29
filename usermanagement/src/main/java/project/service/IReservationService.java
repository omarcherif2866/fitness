package project.service;

import project.models.Reservation;
import project.models.Status;

import java.util.List;

public interface IReservationService {
    Reservation createReservation(Reservation reservation);
    List<Reservation> getAllReservations();
    Reservation getReservationById(Long id);
    Reservation updateReservation(Long id, Reservation reservation);
    void deleteReservation(Long id);

    List<Reservation> getReservationsByUserId(Long userId) ;


    Reservation updateReservationStatus(Long reservationId, Status status);
}
