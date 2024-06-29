package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.models.Cours;
import project.models.Terrain;
import project.repository.CoursRepository;
import project.repository.TerrainRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
@RequiredArgsConstructor
@Service
public class ITerrainServiceImp implements ITerrainService{

    private final TerrainRepository terrainRepository ;

    @Override
    public Terrain addTerrain(Terrain terrain) {
        return terrainRepository.save(terrain);
    }

    @Override
    public void deleteTerrain(Long id) {
        terrainRepository.deleteById(id);

    }

    @Override
    public Terrain updateTerrain(Long id, Terrain terrain) {
        Terrain existingTerrain = terrainRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Terrain not found"));

        existingTerrain.setNom(terrain.getNom());
        existingTerrain.setImage(terrain.getImage());


        return terrainRepository.save(existingTerrain);
    }

    @Override
    public Terrain getTerrainById(Long id) {
        return terrainRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Terrain not found"));
    }

    @Override
    public Set<Terrain> getAllTerrains() {
        List<Terrain> terrainList = terrainRepository.findAll();
        return new HashSet<>(terrainList);    }
}
