package cl.duoc.smaa.repository;
import cl.duoc.smaa.model.Vehiculo;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    Optional<Vehiculo> findByPatente(String patente);
    boolean existsByPatente(String patente);
}
