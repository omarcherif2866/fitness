package project.service;

import project.models.Cours;
import project.models.JourSemaine;

import java.util.List;
import java.util.Set;

public interface ICoursService {
    public Cours addCours(Cours cours);

    public void deleteCours(Long id);

    Cours updateCours(Long id, Cours cours);

    public Cours getCoursById (Long id);

    public Set<Cours> getAllCours ();

    public List<Cours> getCoursByDates(JourSemaine jour);

}
