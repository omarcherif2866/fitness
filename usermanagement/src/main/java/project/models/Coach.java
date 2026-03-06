package project.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Coach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    String nom;

    String prenom;

    String specialite;

    String image;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<JourSemaine> dates = new ArrayList<>();

    @ElementCollection
    private List<String> heures = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "cours_coach", // Nom de la table d'association
            joinColumns = @JoinColumn(name = "coach_id"), // Clé étrangère du coach
            inverseJoinColumns = @JoinColumn(name = "cours_id") // Clé étrangère du cours
    )
    @JsonIgnoreProperties("coaches") // ← ajouter
    private List<Cours> cours;

    @OneToMany(mappedBy = "coach", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Reservation> reservations = new ArrayList<>();
}
