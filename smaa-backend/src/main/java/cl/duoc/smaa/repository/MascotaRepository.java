package cl.duoc.smaa.repository;
import cl.duoc.smaa.model.Mascota;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByDeclaracionViajeId(Long idDeclaracion);
}
