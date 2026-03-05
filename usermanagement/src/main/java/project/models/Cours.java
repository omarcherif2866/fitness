package project.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Cours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    String nom;

    String image;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<JourSemaine> dates = new ArrayList<>();


    @ElementCollection
    private List<String> heures = new ArrayList<>();


    @OneToMany(mappedBy = "cours")
    @JsonIgnoreProperties("cours")
    private List<Reservation> reservations = new ArrayList<>();

    @ManyToMany(mappedBy = "cours")
    @JsonIgnoreProperties("cours")
    private List<Coach> coaches;
}
