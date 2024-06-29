package project.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToMany
    @JoinTable(
            name = "cours_coach", // Nom de la table d'association
            joinColumns = @JoinColumn(name = "coach_id"), // Clé étrangère du coach
            inverseJoinColumns = @JoinColumn(name = "cours_id") // Clé étrangère du cours
    )
    private List<Cours> cours;

    @OneToMany(mappedBy = "coach")
    private List<Reservation> reservations = new ArrayList<>();
}
