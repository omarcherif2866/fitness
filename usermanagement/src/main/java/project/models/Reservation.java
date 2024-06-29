package project.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String heure;
    @Enumerated(EnumType.STRING)
    private Status status ;

    @ManyToOne
    @JsonIgnoreProperties("reservations")
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JsonIgnoreProperties("reservations")
    @JoinColumn(name = "course_id")
    private Cours cours;

    @ManyToOne
    @JsonIgnoreProperties("reservations")
    @JoinColumn(name = "terrain_id")
    private Terrain terrain;

    @ManyToOne
    @JsonIgnoreProperties("reservations")
    @JoinColumn(name = "coach_id")
    private Coach coach;
}
