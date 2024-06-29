package project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.models.Coach;
import project.models.Cours;
import project.models.JourSemaine;

import java.util.List;

public interface CoachRepository extends JpaRepository<Coach,Long > {
    List<Coach> findByDatesContainingIgnoreCase(JourSemaine jour);

}
