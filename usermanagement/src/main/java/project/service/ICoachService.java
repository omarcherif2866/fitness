package project.service;

import project.models.Coach;
import project.models.Cours;
import project.models.JourSemaine;

import java.util.List;
import java.util.Set;

public interface ICoachService {
    public Coach addCoach(Coach coach);

    public void deleteCoach(Long id);

    Coach updateCoach(Long id, Coach coach);

    public Coach getCoachById (Long id);

    public Set<Coach> getAllCoach ();
    public List<Coach> getCoachByDates(JourSemaine jour);


}
