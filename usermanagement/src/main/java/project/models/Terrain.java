package project.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Terrain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    String nom;

    String image;

    @OneToMany(mappedBy = "terrain")
    private List<Reservation> reservations = new ArrayList<>();


}
