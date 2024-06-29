package project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.models.Terrain;

public interface TerrainRepository extends JpaRepository<Terrain,Long > {
}
