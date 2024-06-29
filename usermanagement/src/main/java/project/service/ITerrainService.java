package project.service;

import project.models.Terrain;

import java.util.Set;

public interface ITerrainService {
    public Terrain addTerrain(Terrain terrain);

    public void deleteTerrain(Long id);

    Terrain updateTerrain(Long id, Terrain terrain);

    public Terrain getTerrainById (Long id);

    public Set<Terrain> getAllTerrains ();
}
